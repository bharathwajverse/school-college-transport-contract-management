import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import ChartCard from '../components/ui/ChartCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { 
  FileText, 
  RefreshCw, 
  AlertTriangle, 
  Bell, 
  Calendar,
  Sparkles,
  CreditCard
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, revenueRes, alertsRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/revenue-chart'),
          api.get('/alerts/upcoming'),
        ]);
        setSummary(summaryRes.data.data || summaryRes.data);
        setRevenueData(revenueRes.data.data || revenueRes.data);
        setAlerts(alertsRes.data.data || alertsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B7CFF]" />
        <p className="text-sm text-[#94A3B8] font-medium">Preparing your premium workspace...</p>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Active Contracts',
      value: summary?.active_contracts ?? 0,
      trend: '↑ 4% this month',
      trendType: 'success',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Pending Renewals',
      value: summary?.pending_renewals ?? 0,
      trend: 'Action required',
      trendType: 'warning',
      icon: <RefreshCw className="h-5 w-5" />,
    },
    {
      title: 'Overdue Payments',
      value: summary?.overdue_payments ?? 0,
      trend: summary?.overdue_payments > 0 ? 'Urgent attention' : 'All clear',
      trendType: summary?.overdue_payments > 0 ? 'danger' : 'success',
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      title: 'Monthly Revenue',
      value: summary?.total_revenue ? `₹${Number(summary.total_revenue).toLocaleString('en-IN')}` : '₹0',
      trend: 'Total Collections',
      trendType: 'success',
      icon: <CreditCard className="h-5 w-5" />,
    },
  ];


  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Welcome Area Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121827]/40 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B7CFF]/5 rounded-full blur-2xl group-hover:bg-[#8B7CFF]/10 transition-colors duration-500" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {getGreeting()}, {user?.full_name || 'Partner'}
            <Sparkles className="w-5 h-5 text-[#A78BFA] animate-pulse" />
          </h1>
          <p className="text-sm text-[#94A3B8] font-medium mt-1">
            Here is a status update for Manivtha Tours & Travels contracts today.
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <span className="text-xs font-semibold text-[#94A3B8] flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <Badge variant="success">
            Online
          </Badge>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <StatCard
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              trendType={kpi.trendType}
              icon={kpi.icon}
            />
          </motion.div>
        ))}
      </div>

      {/* Analytics Trend & Alerts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Glowing Area Chart */}
        <div className="lg:col-span-2">
          <ChartCard title="Revenue Trend Overview">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B7CFF" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#8B7CFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: '500' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: '500' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Collections']}
                    contentStyle={{
                      backgroundColor: '#121827',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#ffffff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B7CFF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <svg className="w-12 h-12 text-[#94A3B8]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-[#94A3B8]/50 text-sm font-medium">No trend records found.</p>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Action Panel Timeline */}
        <div className="bg-[#121827]/40 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Upcoming Expirations</h3>
            <Badge variant="warning">Alerts</Badge>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 max-h-[300px] pr-1 scrollbar-thin">
            {alerts.length > 0 ? (
              alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="p-3.5 bg-[#0D1220]/50 hover:bg-[#0D1220] border border-white/5 rounded-2xl transition-all duration-200 group">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <Badge variant={alert.alert_type === 'RENEWAL' ? 'warning' : 'danger'}>
                      {alert.alert_type}
                    </Badge>
                    <span className="text-[10px] text-[#94A3B8]/60 font-bold">
                      {new Date(alert.alert_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white group-hover:text-[#8B7CFF] transition-colors mb-1 leading-normal">{alert.message}</p>
                  <span className="text-[10px] text-[#94A3B8]/60 font-bold block">
                    {alert.institution_name || 'No institution'} • Contract {alert.contract_number}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <Bell className="w-10 h-10 text-[#94A3B8]/30" />
                <p className="text-[#94A3B8]/40 text-xs font-bold">All expirations are clear.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts Table Card */}
      <div className="bg-[#121827]/40 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Active System Expirations</h2>
        </div>

        {alerts.length > 0 ? (
          <Table headers={['Type', 'Message', 'Date', 'Contract', 'Institution']}>
            {alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={alert.alert_type === 'RENEWAL' ? 'warning' : alert.alert_type === 'PAYMENT' ? 'danger' : 'info'}>
                    {alert.alert_type}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-white/95 max-w-xs truncate">
                  {alert.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/70 font-bold">
                  {new Date(alert.alert_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-[#A78BFA]">
                  {alert.contract_number || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8] font-medium">
                  {alert.institution_name || '—'}
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <p className="text-sm font-medium text-[#94A3B8]/40">No active system alerts detected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
