import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import StatCard from '../components/ui/StatCard';
import { FileText, CheckCircle2, Clock, AlertTriangle, Search } from 'lucide-react';

const STATUS_OPTIONS = ['All', 'Unpaid', 'Paid', 'Overdue'];
const STATUS_MAP = {
  'All': '',
  'Unpaid': 'UNPAID',
  'Paid': 'PAID',
  'Overdue': 'OVERDUE',
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

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [markingId, setMarkingId] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (STATUS_MAP[statusFilter]) params.status = STATUS_MAP[statusFilter];
      if (search.trim()) params.search = search.trim();
      const res = await api.get('/payments', { params });
      const body = res.data.data || res.data;
      const items = body.items || body.payments || body || [];
      setPayments(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payments.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleMarkPaid = async (id) => {
    setMarkingId(id);
    try {
      await api.patch(`/payments/${id}/status`, { payment_status: 'PAID' });
      fetchPayments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update payment status.');
    } finally {
      setMarkingId(null);
    }
  };

  // Calculate statistics based on current fetched payments
  const totalAmount = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const paidAmount = payments.filter(p => (p.payment_status || p.status) === 'PAID').reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const unpaidAmount = payments.filter(p => (p.payment_status || p.status) === 'UNPAID').reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const overdueAmount = payments.filter(p => (p.payment_status || p.status) === 'OVERDUE').reduce((acc, p) => acc + Number(p.amount || 0), 0);

  const stats = [
    {
      title: 'Total Invoiced',
      value: formatCurrency(totalAmount),
      trend: `${payments.length} transactions`,
      trendType: 'info',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      title: 'Collected Revenue',
      value: formatCurrency(paidAmount),
      trend: 'Received',
      trendType: 'success',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      title: 'Pending Invoices',
      value: formatCurrency(unpaidAmount),
      trend: 'Awaiting payment',
      trendType: 'warning',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      title: 'Overdue Collections',
      value: formatCurrency(overdueAmount),
      trend: overdueAmount > 0 ? 'Action required' : 'All clear',
      trendType: overdueAmount > 0 ? 'danger' : 'success',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Payments & Invoicing</h1>
        <p className="text-xs text-[#94A3B8] mt-1 font-medium">
          Track school/college transportation subscription invoicing and collection status.
        </p>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <StatCard
            key={idx}
            title={s.title}
            value={s.value}
            trend={s.trend}
            trendType={s.trendType}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 bg-[#121827]/40 border border-white/5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              type="text"
              placeholder="Search by invoice number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all duration-200 cursor-pointer ${
                  statusFilter === s
                    ? 'bg-gradient-to-tr from-[#8B7CFF] to-[#A78BFA] text-white shadow-lg shadow-[#8B7CFF]/25'
                    : 'bg-[#121827] border border-white/10 text-[#94A3B8] hover:bg-white/5 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Payment Logs */}
      {error && (
        <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl animate-fade-in">
          {error}
        </div>
      )}

      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#121827]/40 border border-white/5 rounded-3xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7CFF]" />
            <p className="text-xs text-[#94A3B8] font-semibold">Fetching payment logs...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-[#121827]/40 border border-white/5 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-[#0D1220] border border-white/5 flex items-center justify-center text-[#8B7CFF] text-2xl">
              <FileText className="w-8 h-8" />
            </div>
            <div className="max-w-sm">
              <h3 className="text-sm font-bold text-white">No transactions found</h3>
              <p className="text-xs text-[#94A3B8] mt-1 leading-normal">
                There are no transactions matching your search criteria or filter configuration.
              </p>
            </div>
          </div>
        ) : (
          <Table headers={['Invoice No.', 'Contract', 'Institution', 'Amount', 'Due Date', 'Status', 'Actions']}>
            {payments.map((p) => {
              const statusVal = p.payment_status || p.status;
              return (
                <tr key={p.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">
                    {p.invoice_number || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-[#8B7CFF] hover:text-[#A78BFA] transition-colors">
                    {p.Contract?.id ? (
                      <Link to={`/contracts/${p.Contract.id}`} className="hover:underline">
                        {p.Contract?.contract_number || p.contract_number || 'View Contract'}
                      </Link>
                    ) : (
                      p.Contract?.contract_number || p.contract_number || '—'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8] font-semibold">
                    {p.Contract?.Institution?.institution_name || p.institution_name || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-bold">
                    {formatDate(p.due_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={statusVal === 'PAID' ? 'success' : statusVal === 'OVERDUE' ? 'danger' : 'warning'}>
                      {statusVal}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(statusVal === 'UNPAID' || statusVal === 'OVERDUE') ? (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleMarkPaid(p.id)}
                        disabled={markingId === p.id}
                      >
                        {markingId === p.id ? 'Saving...' : 'Mark Paid'}
                      </Button>
                    ) : (
                      <span className="text-[#94A3B8]/30 text-xs font-semibold">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </div>
    </div>
  );
}
