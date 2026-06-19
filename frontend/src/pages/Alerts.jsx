import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { Settings, Plus, Bell, RefreshCw, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

const FILTER_OPTIONS = ['All', 'Pending', 'Sent'];
const ALERT_TYPES = [
  { value: 'RENEWAL', label: 'Renewal' },
  { value: 'EXPIRY', label: 'Expiry' },
  { value: 'PAYMENT_DUE', label: 'Payment Due' },
  { value: 'INSURANCE_EXPIRY', label: 'Insurance Expiry' },
];

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [markingId, setMarkingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [modalForm, setModalForm] = useState({ contract_id: '', alert_type: '', message: '' });
  const [modalErrors, setModalErrors] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [modalServerError, setModalServerError] = useState('');

  // Alert engine trigger state
  const [runningEngine, setRunningEngine] = useState(false);
  const [engineResult, setEngineResult] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filter === 'Pending') params.status = 'pending';
      if (filter === 'Sent') params.status = 'sent';
      const res = await api.get('/alerts', { params });
      const body = res.data.data || res.data;
      const items = body.items || body.alerts || body || [];
      setAlerts(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load alerts.');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const handleRunEngine = async () => {
    setRunningEngine(true);
    setError('');
    setEngineResult(null);
    try {
      const res = await api.post('/system/run-alert-engine');
      setEngineResult(res.data.data || res.data);
      fetchAlerts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to run the alert trigger engine. (Requires Admin role)');
    } finally {
      setRunningEngine(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Load contracts for modal dropdown
  useEffect(() => {
    if (!showModal) return;
    api.get('/contracts')
      .then((res) => {
        const body = res.data.data || res.data;
        const items = body.items || body.contracts || body || [];
        setContracts(Array.isArray(items) ? items : []);
      })
      .catch(() => setContracts([]));
  }, [showModal]);

  const handleMarkSent = async (id) => {
    setMarkingId(id);
    try {
      await api.patch(`/alerts/${id}/sent`);
      fetchAlerts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark alert as sent.');
    } finally {
      setMarkingId(null);
    }
  };

  const openModal = () => {
    setModalForm({ contract_id: '', alert_type: '', message: '' });
    setModalErrors({});
    setModalServerError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const validateModal = () => {
    const errs = {};
    if (!modalForm.contract_id) errs.contract_id = 'Contract is required.';
    if (!modalForm.alert_type) errs.alert_type = 'Alert type is required.';
    if (!modalForm.message.trim()) errs.message = 'Message is required.';
    setModalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!validateModal()) return;
    setModalLoading(true);
    setModalServerError('');
    try {
      await api.post('/alerts/manual', modalForm);
      closeModal();
      fetchAlerts();
    } catch (err) {
      setModalServerError(err.response?.data?.message || 'Failed to create alert.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Alerts & Expiry Control</h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">Track contract renewals, fleet insurance timelines, and billing schedules.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRunEngine}
            disabled={runningEngine}
            variant="secondary"
          >
            {runningEngine ? (
              <RefreshCw className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <Settings className="h-4 w-4 mr-2" />
            )}
            {runningEngine ? 'Processing...' : 'Run Alert Engine'}
          </Button>
          
          <Button onClick={openModal} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Manual Alert
          </Button>
        </div>
      </div>

      {/* Expiry Tracking Engine Output */}
      {engineResult && (
        <Card className="p-6 bg-[#121827]/85 border border-white/5 text-white space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-1 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] rounded-xl text-sm">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold">Alert Engine Executed Successfully</h4>
                <p className="text-[10px] text-[#94A3B8]">Run completed at {new Date(engineResult.ranAt).toLocaleTimeString()}</p>
              </div>
            </div>
            <button 
              onClick={() => setEngineResult(null)}
              className="text-[#94A3B8] hover:text-white text-xs font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0D1220]/60 border border-white/5 p-4 rounded-2xl">
              <span className="block text-[#94A3B8] text-[10px] uppercase font-bold tracking-wider">Contract Alerts</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{engineResult.contractAlertsCreated ?? 0}</span>
                <span className="text-[10px] text-[#22C55E] font-bold">↑ Triggered</span>
              </div>
            </div>
            <div className="bg-[#0D1220]/60 border border-white/5 p-4 rounded-2xl">
              <span className="block text-[#94A3B8] text-[10px] uppercase font-bold tracking-wider">Vehicle Alerts</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{engineResult.vehicleAlertsCreated ?? 0}</span>
                <span className="text-[10px] text-[#22C55E] font-bold">↑ Triggered</span>
              </div>
            </div>
            <div className="bg-[#0D1220]/60 border border-white/5 p-4 rounded-2xl">
              <span className="block text-[#94A3B8] text-[10px] uppercase font-bold tracking-wider">Overdue Invoices</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{engineResult.overduePaymentsUpdated ?? 0}</span>
                <span className="text-[10px] text-[#EF4444] font-bold">⚠ Flagged</span>
              </div>
            </div>
            <div className="bg-[#0D1220]/60 border border-white/5 p-4 rounded-2xl">
              <span className="block text-[#94A3B8] text-[10px] uppercase font-bold tracking-wider">Payment Alerts</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{engineResult.paymentAlertsCreated ?? 0}</span>
                <span className="text-[10px] text-[#22C55E] font-bold">↑ Triggered</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4 bg-[#121827]/40 border border-white/5 shadow-2xl">
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all duration-200 cursor-pointer ${
                filter === f
                  ? 'bg-gradient-to-tr from-[#8B7CFF] to-[#A78BFA] text-white shadow-lg shadow-[#8B7CFF]/25'
                  : 'bg-[#121827] border border-white/10 text-[#94A3B8] hover:bg-white/5 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-955/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl animate-fade-in">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#121827]/40 border border-white/5 rounded-3xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7CFF]" />
            <p className="text-xs text-[#94A3B8] font-semibold">Fetching system alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-[#121827]/40 border border-white/5 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-[#0D1220] border border-white/5 flex items-center justify-center text-[#8B7CFF] text-2xl">
              <Bell className="w-8 h-8" />
            </div>
            <div className="max-w-sm">
              <h3 className="text-sm font-bold text-white">No alerts found</h3>
              <p className="text-xs text-[#94A3B8] mt-1 leading-normal">
                There are no active alerts in this view. Run the engine to parse database timelines.
              </p>
            </div>
          </div>
        ) : (
          <Table headers={['Type', 'Message', 'Date', 'Contract', 'Institution', 'Status', 'Action']}>
            {alerts.map((a) => (
              <tr key={a.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={a.alert_type === 'RENEWAL' ? 'warning' : a.alert_type === 'PAYMENT_DUE' ? 'danger' : 'info'}>
                    {a.alert_type?.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-white/90 max-w-xs truncate">
                  {a.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-bold">
                  {formatDate(a.alert_date || a.createdAt || a.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-[#8B7CFF] hover:text-[#A78BFA] transition-colors">
                  {a.contract_id ? (
                    <Link to={`/contracts/${a.contract_id}`} className="hover:underline">
                      {a.contract_number || 'View Details'}
                    </Link>
                  ) : (
                    a.contract_number || '—'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8] font-medium">
                  {a.institution_name || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={a.is_sent ? 'success' : 'neutral'}>
                    {a.is_sent ? 'Sent' : 'Pending'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!a.is_sent ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleMarkSent(a.id)}
                      disabled={markingId === a.id}
                    >
                      {markingId === a.id ? 'Updating...' : 'Mark Sent'}
                    </Button>
                  ) : (
                    <span className="text-[#94A3B8]/30 text-xs font-semibold">—</span>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      {/* Manual Alert Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title="Create Manual Alert">
        {modalServerError && (
          <div className="mb-4 p-4 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl">
            {modalServerError}
          </div>
        )}

        <form onSubmit={handleModalSubmit} className="space-y-4">
          <Select
            label="Contract"
            id="modal_contract_id"
            required
            value={modalForm.contract_id}
            onChange={(e) => setModalForm(prev => ({ ...prev, contract_id: e.target.value }))}
            options={[
              { value: '', label: 'Select a contract' },
              ...contracts.map((c) => ({ value: c.id, label: c.contract_number })),
            ]}
            error={modalErrors.contract_id}
          />

          <Select
            label="Alert Type"
            id="modal_alert_type"
            required
            value={modalForm.alert_type}
            onChange={(e) => setModalForm(prev => ({ ...prev, alert_type: e.target.value }))}
            options={[
              { value: '', label: 'Select type' },
              ...ALERT_TYPES,
            ]}
            error={modalErrors.alert_type}
          />

          <Input
            label="Message"
            id="modal_message"
            required
            placeholder="Alert detail text..."
            value={modalForm.message}
            onChange={(e) => setModalForm(prev => ({ ...prev, message: e.target.value }))}
            error={modalErrors.message}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={modalLoading}>
              {modalLoading ? 'Creating...' : 'Create Alert'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
