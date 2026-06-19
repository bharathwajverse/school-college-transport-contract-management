import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import { 
  Printer, 
  Edit, 
  ChevronRight, 
  Info, 
  Map, 
  Bus, 
  IndianRupee, 
  Bell, 
  History, 
  FileText 
} from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  const hr = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  
  if (dateStr.includes('T')) {
    return `${day}-${months[d.getMonth()]}-${d.getFullYear()} ${hr}:${min}`;
  }
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

const formatCurrency = (value) => {
  if (value == null) return '—';
  return '₹' + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/contracts/${id}/detail`)
      .then((res) => {
        setData(res.data.data || res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load contract details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#121827]/40 border border-white/5 rounded-3xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7CFF]" />
        <p className="text-xs text-[#94A3B8] font-bold">Compiling agreement details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 text-white">
        <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl">
          {error || 'Contract data not found.'}
        </div>
        <Button onClick={() => navigate('/contracts')} variant="secondary">
          Back to Contracts
        </Button>
      </div>
    );
  }

  const { contract, payments, routes, vehicles, alerts, auditLogs } = data;

  return (
    <div className="space-y-6 print:space-y-6 max-w-7xl mx-auto pb-12 text-white animate-fade-in">
      {/* Header Row (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-bold mb-1">
            <Link to="/contracts" className="hover:text-[#8B7CFF] transition-colors">Contracts</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]/60" />
            <span className="text-[#8B7CFF] bg-[#8B7CFF]/10 px-2.5 py-0.5 rounded-2xl border border-[#8B7CFF]/20">{contract.contract_number}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
            Agreement Specification
          </h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="secondary">
            <Printer className="w-4 h-4 mr-2" />
            Print Spec
          </Button>
          <Link to={`/contracts/${contract.id}/edit`}>
            <Button variant="primary">
              <Edit className="w-4 h-4 mr-2" />
              Edit Contract
            </Button>
          </Link>
        </div>
      </div>

      {/* Print-Only Header */}
      <div className="hidden print:block border-b border-gray-700 pb-4 mb-6">
        <h1 className="text-xl font-bold text-white">Transportation Contract Specification</h1>
        <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mt-1">Institutional Transport Contract Specification Document</p>
      </div>

      {/* Metadata Card Section */}
      <Card className="p-6 md:p-8 space-y-6 relative overflow-hidden bg-[#121827]/40 border border-white/5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-xs font-black text-[#A78BFA] uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-[#8B7CFF]" />
            General Terms
          </h3>
          <Badge variant={
            contract.status === 'ACTIVE' ? 'success' :
            contract.status === 'PENDING_RENEWAL' ? 'warning' : 'neutral'
          }>
            {contract.status?.replace('_', ' ')}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs font-semibold text-[#94A3B8]">
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#94A3B8]/60">Contract Number</span>
            <span className="block text-white font-black text-sm mt-1">{contract.contract_number}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#94A3B8]/60">Institution</span>
            <span className="block text-white font-black text-sm mt-1">{contract.institution_name}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#94A3B8]/60">Billing Cycle</span>
            <span className="block text-white font-black text-sm mt-1 capitalize">{contract.billing_cycle?.toLowerCase()?.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#94A3B8]/60">Contract Value</span>
            <span className="inline-flex items-center px-2.5 py-0.5 mt-1 bg-[#8B7CFF]/10 text-[#8B7CFF] border border-[#8B7CFF]/20 text-xs font-bold rounded-2xl">{formatCurrency(contract.contract_value)}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#94A3B8]/60">Start Date</span>
            <span className="block text-white/90 font-bold mt-1">{formatDate(contract.start_date)}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#94A3B8]/60">End Date</span>
            <span className="block text-white/90 font-bold mt-1">{formatDate(contract.end_date)}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#94A3B8]/60">Renewal Date</span>
            <span className="block text-white/90 font-bold mt-1">{formatDate(contract.renewal_date)}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#94A3B8]/60">Created Date</span>
            <span className="block text-white/90 font-bold mt-1">{formatDate(contract.created_at)}</span>
          </div>
        </div>

        {contract.notes && (
          <div className="pt-4 border-t border-white/5 text-xs">
            <span className="block text-[10px] uppercase font-bold text-[#94A3B8]/60 mb-1.5">Additional Terms / Notes</span>
            <p className="text-white/80 bg-[#0D1220]/60 p-4 rounded-2xl border border-white/5 leading-relaxed font-medium">{contract.notes}</p>
          </div>
        )}
      </Card>

      {/* Routes Assignments */}
      <Card className="p-6 space-y-4 bg-[#121827]/40 border border-white/5 shadow-2xl backdrop-blur-md">
        <h3 className="text-xs font-black text-[#A78BFA] uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
          <Map className="w-4 h-4 text-[#8B7CFF]" />
          Route Assignments
        </h3>
        {routes.length === 0 ? (
          <p className="text-xs text-[#94A3B8]/60 font-semibold py-4">No routes registered for this contract.</p>
        ) : (
          <Table headers={['Route Name', 'Distance', 'Pickup Points', 'Drop Points']}>
            {routes.map((r) => (
              <tr key={r.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">{r.route_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">{r.distance_km} km</td>
                <td className="px-6 py-4 text-xs font-semibold text-[#94A3B8] max-w-xs truncate">{Array.isArray(r.pickup_points) ? r.pickup_points.join(', ') : '—'}</td>
                <td className="px-6 py-4 text-xs font-semibold text-[#94A3B8] max-w-xs truncate">{Array.isArray(r.drop_points) ? r.drop_points.join(', ') : '—'}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Fleet Assignment */}
      <Card className="p-6 space-y-4 bg-[#121827]/40 border border-white/5 shadow-2xl backdrop-blur-md">
        <h3 className="text-xs font-black text-[#A78BFA] uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
          <Bus className="w-4 h-4 text-[#8B7CFF]" />
          Fleet Assignment
        </h3>
        {vehicles.length === 0 ? (
          <p className="text-xs text-[#94A3B8]/60 font-semibold py-4">No vehicles assigned to this contract.</p>
        ) : (
          <Table headers={['Vehicle Number', 'Type', 'Capacity', 'Insurance Expiry', 'Fitness Expiry']}>
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">{v.vehicle_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-[#94A3B8]">{v.vehicle_type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">{v.capacity} Passengers</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-bold">{formatDate(v.insurance_expiry)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-bold">{formatDate(v.fitness_expiry)}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Payment Schedule */}
      <Card className="p-6 space-y-4 bg-[#121827]/40 border border-white/5 shadow-2xl backdrop-blur-md">
        <h3 className="text-xs font-black text-[#A78BFA] uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-[#8B7CFF]" />
          Payment Schedule & Billing Tracker
        </h3>
        {payments.length === 0 ? (
          <p className="text-xs text-[#94A3B8]/60 font-semibold py-4">No payments or invoices recorded.</p>
        ) : (
          <Table headers={['Invoice', 'Billing Period', 'Amount', 'Due Date', 'Payment Date', 'Status']}>
            {payments.map((p) => {
              const statusVal = p.payment_status || p.status;
              return (
                <tr key={p.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">{p.invoice_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-medium">{formatDate(p.billing_period_start)} to {formatDate(p.billing_period_end)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-black text-[#8B7CFF]">{formatCurrency(p.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/70 font-bold">{formatDate(p.due_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/70 font-bold">{formatDate(p.payment_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={statusVal === 'PAID' ? 'success' : statusVal === 'OVERDUE' ? 'danger' : 'warning'}>
                      {statusVal}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>

      {/* System Alerts */}
      <Card className="p-6 space-y-4 bg-[#121827]/40 border border-white/5 shadow-2xl backdrop-blur-md">
        <h3 className="text-xs font-black text-[#A78BFA] uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#F59E0B]" />
          System Alerts History
        </h3>
        {alerts.length === 0 ? (
          <p className="text-xs text-[#94A3B8]/60 font-semibold py-4">No alerts have been generated for this contract.</p>
        ) : (
          <Table headers={['Type', 'Alert Date', 'Message', 'Status']}>
            {alerts.map((a) => (
              <tr key={a.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={a.alert_type === 'RENEWAL' ? 'warning' : a.alert_type === 'PAYMENT_DUE' ? 'danger' : 'info'}>
                    {a.alert_type}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-bold">{formatDate(a.alert_date)}</td>
                <td className="px-6 py-4 text-xs font-semibold text-white/90">{a.message}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={a.is_sent ? 'success' : 'warning'}>
                    {a.is_sent ? 'Sent' : 'Pending'}
                  </Badge>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Action History (Audit Log) */}
      <Card className="p-6 space-y-4 bg-[#121827]/40 border border-white/5 shadow-2xl backdrop-blur-md print:break-before-page">
        <h3 className="text-xs font-black text-[#A78BFA] uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
          <History className="w-4 h-4 text-[#8B7CFF]" />
          Action History (Audit Log)
        </h3>
        {auditLogs.length === 0 ? (
          <p className="text-xs text-[#94A3B8]/60 font-semibold py-4">No modifications logged for this contract.</p>
        ) : (
          <Table headers={['Action', 'User', 'Date', 'Changes (Old → New)']}>
            {auditLogs.map((log) => {
              const hasOld = log.old_value && Object.keys(log.old_value).length > 0;
              const hasNew = log.new_value && Object.keys(log.new_value).length > 0;
              
              return (
                <tr key={log.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      log.action === 'CREATE' ? 'success' :
                      log.action === 'UPDATE' ? 'info' : 'danger'
                    }>
                      {log.action}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-white">{log.user_name || 'System'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-bold">{formatDate(log.created_at)}</td>
                  <td className="px-6 py-4 text-xs font-medium max-w-md">
                    {log.action === 'UPDATE' && hasOld && hasNew ? (
                      <div className="space-y-1">
                        {Object.keys(log.new_value).map((key) => {
                          const oldVal = log.old_value[key];
                          const newVal = log.new_value[key];
                          if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                            return (
                              <div key={key} className="truncate text-xs">
                                <span className="font-bold text-[#94A3B8]/70">{key}:</span>{' '}
                                <span className="text-[#EF4444] line-through font-semibold">{String(oldVal)}</span>
                                {' → '}
                                <span className="text-[#22C55E] font-bold">{String(newVal)}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    ) : log.action === 'CREATE' ? (
                      <span className="text-[#94A3B8] font-semibold">Record Created</span>
                    ) : (
                      <span className="text-[#94A3B8] font-semibold">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>
    </div>
  );
}
