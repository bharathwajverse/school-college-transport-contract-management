import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Calendar, AlertCircle } from 'lucide-react';

const BILLING_CYCLES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'HALF_YEARLY', label: 'Half Yearly' },
  { value: 'YEARLY', label: 'Yearly' },
];

const STATUS_CHOICES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING_RENEWAL', label: 'Pending Renewal' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'TERMINATED', label: 'Terminated' },
];

const emptyForm = {
  institution_id: '',
  contract_number: '',
  start_date: '',
  end_date: '',
  renewal_date: '',
  billing_cycle: '',
  contract_value: '',
  notes: '',
  status: 'ACTIVE',
  created_at: '',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

export default function ContractForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [institutions, setInstitutions] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Load institutions dropdown
  useEffect(() => {
    api.get('/institutions')
      .then((res) => {
        const body = res.data.data || res.data;
        const items = body.items || body.institutions || body || [];
        setInstitutions(Array.isArray(items) ? items : []);
      })
      .catch(() => setInstitutions([]));
  }, []);

  // Load contract for editing
  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    api.get(`/contracts/${id}`)
      .then((res) => {
        const c = res.data.contract || res.data.data || res.data;
        setForm({
          institution_id: c.institution_id || '',
          contract_number: c.contract_number || '',
          start_date: c.start_date ? c.start_date.slice(0, 10) : '',
          end_date: c.end_date ? c.end_date.slice(0, 10) : '',
          renewal_date: c.renewal_date ? c.renewal_date.slice(0, 10) : '',
          billing_cycle: c.billing_cycle || '',
          contract_value: c.contract_value || '',
          notes: c.notes || '',
          status: c.status || 'ACTIVE',
          created_at: c.created_at || '',
        });
      })
      .catch((err) => setServerError(err.response?.data?.message || 'Failed to load contract.'))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.institution_id) newErrors.institution_id = 'Institution is required.';
    if (!form.contract_number.trim()) newErrors.contract_number = 'Contract number is required.';
    if (!form.start_date) newErrors.start_date = 'Start date is required.';
    if (!form.end_date) newErrors.end_date = 'End date is required.';
    if (!form.renewal_date) newErrors.renewal_date = 'Renewal date is required.';
    if (!form.billing_cycle) newErrors.billing_cycle = 'Billing cycle is required.';
    
    if (!form.contract_value) {
      newErrors.contract_value = 'Contract value is required.';
    } else if (Number(form.contract_value) <= 0) {
      newErrors.contract_value = 'Contract value must be greater than 0.';
    }

    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      if (end <= start) {
        newErrors.end_date = 'End date must be strictly after the start date.';
      }
    }

    if (form.end_date && form.renewal_date) {
      const end = new Date(form.end_date);
      const renewal = new Date(form.renewal_date);
      if (renewal > end) {
        newErrors.renewal_date = 'Renewal date must be on or before the end date.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const payload = { 
        ...form, 
        contract_value: Number(form.contract_value)
      };
      if (isEdit) {
        await api.put(`/contracts/${id}`, payload);
      } else {
        await api.post('/contracts', payload);
      }
      navigate('/contracts');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#121827]/40 border border-white/5 rounded-3xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7CFF]" />
        <p className="text-xs text-[#94A3B8] font-bold">Fetching contract data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {isEdit ? 'Modify Transport Agreement' : 'New Transport Agreement'}
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1 font-medium leading-relaxed">
          {isEdit ? 'Update terms, billing, and timeline schedules for the active contract.' : 'Define billing cycles, financial values, and timelines for a new institutional partnership.'}
        </p>
      </div>

      {serverError && (
        <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form Card */}
      <Card className="p-6 md:p-8 bg-[#121827]/40 border border-white/5 shadow-2xl backdrop-blur-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Institution & Contract Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#A78BFA] uppercase tracking-wider border-b border-white/5 pb-2">
              Agreement Identity
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Institution Target"
                id="institution_id"
                name="institution_id"
                required
                value={form.institution_id}
                onChange={handleChange}
                error={errors.institution_id}
                options={[
                  { value: '', label: 'Select institutional partner' },
                  ...institutions.map((inst) => ({
                    value: inst.id,
                    label: inst.institution_name || inst.name
                  }))
                ]}
              />

              <Input
                label="Contract Number / Identifier"
                id="contract_number"
                name="contract_number"
                required
                placeholder="e.g. CNT-2026-001"
                value={form.contract_number}
                onChange={handleChange}
                error={errors.contract_number}
              />
            </div>
          </div>

          {/* Section 2: Timeline Schedules */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#A78BFA] uppercase tracking-wider border-b border-white/5 pb-2">
              Timeline Schedules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Start Date"
                type="date"
                id="start_date"
                name="start_date"
                required
                value={form.start_date}
                onChange={handleChange}
                error={errors.start_date}
              />
              
              <Input
                label="End Date"
                type="date"
                id="end_date"
                name="end_date"
                required
                value={form.end_date}
                onChange={handleChange}
                error={errors.end_date}
              />
              
              <Input
                label="Renewal Notice Date"
                type="date"
                id="renewal_date"
                name="renewal_date"
                required
                value={form.renewal_date}
                onChange={handleChange}
                error={errors.renewal_date}
              />
            </div>
          </div>

          {/* Section 3: Billing & Valuation */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#A78BFA] uppercase tracking-wider border-b border-white/5 pb-2">
              Financial Terms
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Billing Cycle Interval"
                id="billing_cycle"
                name="billing_cycle"
                required
                value={form.billing_cycle}
                onChange={handleChange}
                error={errors.billing_cycle}
                options={[
                  { value: '', label: 'Select cycle' },
                  ...BILLING_CYCLES
                ]}
              />

              <Input
                label="Total Contract Valuation (₹)"
                type="number"
                id="contract_value"
                name="contract_value"
                required
                placeholder="e.g. 500000"
                min="0"
                step="0.01"
                value={form.contract_value}
                onChange={handleChange}
                error={errors.contract_value}
              />
            </div>
          </div>

          {/* Section 4: Operational Status (Edit Only) */}
          {isEdit && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#A78BFA] uppercase tracking-wider border-b border-white/5 pb-2">
                Operational Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Contract Lifecycle Status"
                  id="status"
                  name="status"
                  required
                  value={form.status}
                  onChange={handleChange}
                  error={errors.status}
                  options={STATUS_CHOICES}
                />

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-0.5">
                    Agreement Created On
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={formatDate(form.created_at)}
                    className="w-full px-4 py-3 bg-[#0D1220]/60 text-[#94A3B8] border border-white/5 rounded-2xl text-sm outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Extra Notes */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#A78BFA] uppercase tracking-wider border-b border-white/5 pb-2">
              Additional Terms & Notes
            </h3>

            <div>
              <label htmlFor="notes" className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Description / Memo
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes || ''}
                onChange={handleChange}
                rows={4}
                placeholder="Enter custom clauses, vehicle assignments, driver terms..."
                className="w-full px-4 py-3 bg-[#0D1220] border border-white/10 text-white rounded-2xl text-xs focus:ring-4 focus:ring-[#8B7CFF]/10 focus:border-[#8B7CFF]/60 outline-none resize-none transition-all leading-relaxed font-semibold placeholder-[#94A3B8]/30"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/contracts')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEdit ? 'Update Agreement' : 'Establish Agreement'}
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}
