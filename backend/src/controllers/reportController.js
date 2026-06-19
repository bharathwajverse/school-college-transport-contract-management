const PDFDocument = require("pdfkit");
const reportModel = require("../models/reportModel");
const { toCsv } = require("../utils/csv");
const { asyncHandler } = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");
const { AppError } = require("../utils/appError");

const revenueTrend = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const report = await reportModel.revenueTrend(startDate, endDate);
  return success(res, report);
});

const contractStatus = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const report = await reportModel.contractStatus(startDate, endDate);
  return success(res, report);
});

const exportReport = asyncHandler(async (req, res) => {
  const format = req.query.type || "csv";
  const reportType = req.query.report || "revenue-trend";
  const { startDate, endDate } = req.query;
  const rows = await reportModel.exportRows(reportType, startDate, endDate);

  if (format === "csv") {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${reportType}.csv"`);
    return res.send(toCsv(rows));
  }

  if (format === "pdf") {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${reportType}.pdf"`);

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);
    doc.fontSize(16).text("School & College Transport Contract Management", { align: "center" });
    doc.moveDown();
    doc.fontSize(13).text(`Report: ${reportType}`);
    doc.moveDown();

    rows.forEach((row) => {
      doc.fontSize(10).text(JSON.stringify(row));
    });

    doc.end();
    return;
  }

  throw new AppError("Unsupported export type", 400);
});

module.exports = {
  revenueTrend,
  contractStatus,
  exportReport
};

