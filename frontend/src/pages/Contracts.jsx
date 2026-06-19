import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import { Plus, Search, FileText, Check, AlertTriangle, IndianRupee } from 'lucide-react';

const STATUS_OPTIONS = ['All', 'Active', 'Pending Renewal', 'Expired', 'Terminated'];
const STATUS_MAP = {
  'All': '',
  'Active': 'ACTIVE',
  'Pending Renewal': 'PENDING_RENEWAL',
  'Expired': 'EXPIRED',
  'Terminated': 'TERMINATED',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

const formatCurrency = (value) => {
  if (value == null) return '—';
  return '₹' + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit };
      if (STATUS_MAP[statusFilter]) params.status = STATUS_MAP[statusFilter];
      if (search.trim()) params.search = search.trim();
      const res = await api.get('/contracts', { params });
      const body = res.data.data || res.data;
      const items = body.items || body || [];
      setContracts(Array.isArray(items) ? items : []);
      setTotalPages(items.length < limit ? page : page + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contracts.');
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contract? This action cannot be undone.')) return;
    try {
      await api.delete(`/contracts/${id}`);
      fetchContracts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contract.');
    }
  };

  // Aggregated quick stats
  const activeCount = contracts.filter((c) => c.status === 'ACTIVE').length;
  const renewalCount = contracts.filter((c) => c.status === 'PENDING_RENEWAL').length;
  const totalValue = contracts.reduce((acc, c) => acc + Number(c.contract_value || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contracts Workspace</h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">
            Oversee corporate and institutional long-term transportation agreements.
          </p>
        </div>
        <Link to="/contracts/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Contract
          </Button>
        </Link>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="flex items-center justify-between p-6 relative overflow-hidden group">
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Active Workspace Contracts</span>
            <span className="text-2xl font-bold text-white">{activeCount} active</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] flex items-center justify-center font-bold relative z-10">
            <Check className="w-5 h-5" />
          </div>
        </Card>
        
        <Card className="flex items-center justify-between p-6 relative overflow-hidden group">
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Pending Renewals</span>
            <span className="text-2xl font-bold text-white">{renewalCount} pending</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center font-bold relative z-10">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between p-6 relative overflow-hidden group">
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Combined Page Value</span>
            <span className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#8B7CFF]/10 border border-[#8B7CFF]/20 text-[#8B7CFF] flex items-center justify-center font-bold relative z-10">
            <IndianRupee className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-6 bg-[#121827]/40 border border-white/5 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 max-w-lg relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              placeholder="Search by contract number or institution..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all duration-200 cursor-pointer ${
                  statusFilter === opt
                    ? 'bg-gradient-to-tr from-[#8B7CFF] to-[#A78BFA] text-white shadow-lg shadow-[#8B7CFF]/25'
                    : 'bg-[#121827] border border-white/10 text-[#94A3B8] hover:bg-white/5 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl animate-fade-in">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#121827]/40 border border-white/5 rounded-3xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7CFF]" />
            <p className="text-xs text-[#94A3B8] font-semibold">Fetching contract records...</p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-[#121827]/40 border border-white/5 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-3xl bg-[#0D1220] border border-white/5 flex items-center justify-center text-[#8B7CFF] text-2xl">
              <FileText className="w-8 h-8" />
            </div>
            <div className="text-center max-w-sm">
              <h3 className="text-sm font-bold text-white">No contracts found</h3>
              <p className="text-xs text-[#94A3B8] mt-1 leading-normal">
                There are no transport contracts matching the filters. Create a new contract to start.
              </p>
            </div>
            <Link to="/contracts/new">
              <Button size="sm" variant="primary">Create Contract</Button>
            </Link>
          </div>
        ) : (
          <>
            <Table headers={['Contract No', 'Institution', 'Start Date', 'End Date', 'Billing', 'Renewal', 'Status', 'Value', 'Actions']}>
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-[#8B7CFF] hover:text-[#A78BFA] transition-colors">
                    <Link to={`/contracts/${c.id}`} className="hover:underline transition-all">
                      {c.contract_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8] font-semibold">
                    {c.institution_name || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-bold">
                    {formatDate(c.start_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-bold">
                    {formatDate(c.end_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/60 font-semibold capitalize">
                    {c.billing_cycle?.toLowerCase()?.replace('_', ' ') || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-bold">
                    {formatDate(c.renewal_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={c.status === 'ACTIVE' ? 'success' : c.status === 'PENDING_RENEWAL' ? 'warning' : 'danger'}>
                      {c.status?.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">
                    {formatCurrency(c.contract_value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold space-x-4">
                    <Link to={`/contracts/${c.id}/edit`} className="text-[#8B7CFF] hover:text-[#A78BFA] transition-colors">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300 transition-colors cursor-pointer">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-[#121827]/40 border border-white/5 rounded-3xl backdrop-blur-md">
                <p className="text-xs text-[#94A3B8] font-bold">
                  Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
