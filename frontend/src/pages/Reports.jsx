import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import StatCard from '../components/ui/StatCard';
import ChartCard from '../components/ui/ChartCard';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Download, 
  FileText, 
  RefreshCw, 
  AlertTriangle, 
  Bell, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

const formatCurrency = (value) => {
  if (value == null) return '₹0';
  return '₹' + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export default function Reports() {
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [contractStatus, setContractStatus] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Date filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [revenueRes, statusRes] = await Promise.all([
        api.get('/reports/revenue-trend', { params }),
        api.get('/reports/contract-status', { params }),
      ]);
      setRevenueTrend(revenueRes.data.data || revenueRes.data || []);
      setContractStatus(statusRes.data.data || statusRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load report data.');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Load summary KPI numbers
  useEffect(() => {
    api.get('/dashboard/summary')
      .then((res) => {
        setSummary(res.data.data || res.data);
      })
      .catch((err) => console.error('Failed to load KPI summaries:', err));
  }, []);

  const handleExportCSV = () => {
    let url = '/api/reports/export?type=csv';
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    window.open(url, '_blank');
  };

  const handleExportPDF = () => {
    let url = '/api/reports/export?type=pdf';
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    window.open(url, '_blank');
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const kpis = [
    {
      title: 'Active Contracts',
      value: summary?.active_contracts ?? 0,
      trend: 'Legally binding',
      trendType: 'info',
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: 'Pending Renewals',
      value: summary?.pending_renewals ?? 0,
      trend: 'Expiring soon',
      trendType: 'warning',
      icon: <RefreshCw className="w-5 h-5" />
    },
    {
      title: 'Overdue Invoices',
      value: summary?.overdue_payments ?? 0,
      trend: summary?.overdue_payments > 0 ? 'Collect payments' : 'Paid up',
      trendType: summary?.overdue_payments > 0 ? 'danger' : 'success',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      title: 'System Alerts Logged',
      value: summary?.upcoming_alerts ?? 0,
      trend: 'Requires review',
      trendType: 'info',
      icon: <Bell className="w-5 h-5" />
    },
  ];

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reports & Analytics</h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium font-sans">
            Review organizational metrics, financial trends, and contract distribution profiles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportCSV}
            variant="secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="primary"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <StatCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            trendType={kpi.trendType}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Date Range Filters */}
      <Card className="p-4 bg-[#121827]/40 border border-white/5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <Input
              label="Start Date"
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div className="flex-1">
            <Input
              label="End Date"
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {(startDate || endDate) && (
            <Button
              onClick={handleClearFilters}
              variant="danger"
              className="py-[11px]"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-955/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl animate-fade-in">
          {error}
        </div>
      )}

      {/* Charts Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#121827]/40 border border-white/5 rounded-3xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7CFF]" />
          <p className="text-xs text-[#94A3B8] font-bold">Compiling reports charts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Area Chart */}
          <ChartCard title="Revenue Performance Trend">
            {revenueTrend.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-[#94A3B8]/40 text-xs font-semibold">
                No revenue data available for the selected range.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={revenueTrend} margin={{ top: 5, right: 15, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorReportsRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B7CFF" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#8B7CFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#121827',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: '#ffffff'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', fill: '#94A3B8' }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B7CFF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorReportsRevenue)"
                    name="Revenue Collected"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Contract Status Bar Chart */}
          <ChartCard title="Contract Status Profile">
            {contractStatus.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-[#94A3B8]/40 text-xs font-semibold">
                No contract profiles found for the selected range.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={contractStatus} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorReportsBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#8B7CFF" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v?.replace('_', ' ')}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    formatter={(value) => [value, 'Contracts']}
                    contentStyle={{
                      backgroundColor: '#121827',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: '#ffffff'
                    }}
                    labelFormatter={(label) => `Status: ${label?.replace('_', ' ')}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Bar
                    dataKey="count"
                    fill="url(#colorReportsBar)"
                    radius={[6, 6, 0, 0]}
                    name="Total Contracts"
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      )}
    </div>
  );
}
