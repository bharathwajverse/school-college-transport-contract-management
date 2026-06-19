const alertModel = require("../models/alertModel");
const contractModel = require("../models/contractModel");
const paymentModel = require("../models/paymentModel");
const vehicleModel = require("../models/vehicleModel");

const ALERT_THRESHOLDS = [90, 60, 30, 15, 7];

function toUtcDateOnly(value) {
  const date = new Date(value);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function daysUntil(value) {
  const today = toUtcDateOnly(new Date());
  const target = toUtcDateOnly(value);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

async function createThresholdAlert({ contractId, type, dueDate, label, institutionName, contractNumber }) {
  const remainingDays = daysUntil(dueDate);

  if (!ALERT_THRESHOLDS.includes(remainingDays)) {
    return false;
  }

  const message = `${label} for ${institutionName || "institution"} contract ${contractNumber || ""} is due in ${remainingDays} days.`;

  const result = await alertModel.createIfMissing({
    contract_id: contractId,
    alert_type: type,
    alert_date: todayIsoDate(),
    message
  });

  return result.created;
}

async function scanContracts() {
  const contracts = await contractModel.findForAlertScan();
  let createdCount = 0;

  for (const contract of contracts) {
    const renewalCreated = await createThresholdAlert({
      contractId: contract.id,
      type: "RENEWAL",
      dueDate: contract.renewal_date,
      label: "Renewal",
      institutionName: contract.institution_name,
      contractNumber: contract.contract_number
    });

    const expiryCreated = await createThresholdAlert({
      contractId: contract.id,
      type: "EXPIRY",
      dueDate: contract.end_date,
      label: "Expiry",
      institutionName: contract.institution_name,
      contractNumber: contract.contract_number
    });

    createdCount += Number(renewalCreated) + Number(expiryCreated);
  }

  return createdCount;
}

async function scanVehicles() {
  const vehicles = await vehicleModel.findForInsuranceAlertScan();
  let createdCount = 0;

  for (const vehicle of vehicles) {
    const insuranceCreated = await createThresholdAlert({
      contractId: vehicle.contract_id,
      type: "INSURANCE_EXPIRY",
      dueDate: vehicle.insurance_expiry,
      label: `Insurance expiry for vehicle ${vehicle.vehicle_number}`,
      institutionName: vehicle.institution_name,
      contractNumber: vehicle.contract_number
    });

    createdCount += Number(insuranceCreated);

    if (vehicle.fitness_expiry) {
      const fitnessCreated = await createThresholdAlert({
        contractId: vehicle.contract_id,
        type: "INSURANCE_EXPIRY",
        dueDate: vehicle.fitness_expiry,
        label: `Fitness expiry for vehicle ${vehicle.vehicle_number}`,
        institutionName: vehicle.institution_name,
        contractNumber: vehicle.contract_number
      });

      createdCount += Number(fitnessCreated);
    }
  }

  return createdCount;
}

async function scanOverduePayments() {
  const overduePayments = await paymentModel.markOverdue();
  let createdCount = 0;

  for (const payment of overduePayments) {
    const result = await alertModel.createIfMissing({
      contract_id: payment.contract_id,
      alert_type: "PAYMENT_DUE",
      alert_date: todayIsoDate(),
      message: `Invoice ${payment.invoice_number} is overdue. Amount due: ${payment.amount}.`
    });

    createdCount += Number(result.created);
  }

  return {
    overduePaymentsUpdated: overduePayments.length,
    paymentAlertsCreated: createdCount
  };
}

async function runAlertEngine() {
  await contractModel.updateDerivedStatuses();

  const contractAlertsCreated = await scanContracts();
  const vehicleAlertsCreated = await scanVehicles();
  const paymentResult = await scanOverduePayments();

  return {
    contractAlertsCreated,
    vehicleAlertsCreated,
    ...paymentResult,
    ranAt: new Date().toISOString()
  };
}

module.exports = {
  runAlertEngine,
  ALERT_THRESHOLDS
};

