// src/components/StatusBadge.jsx
const colors = {
  ACTIVE: 'bg-green-100 text-green-800',
  PAID: 'bg-green-100 text-green-800',
  PENDING_RENEWAL: 'bg-yellow-100 text-yellow-800',
  UNPAID: 'bg-yellow-100 text-yellow-800',
  EXPIRED: 'bg-red-100 text-red-800',
  OVERDUE: 'bg-red-100 text-red-800',
  TERMINATED: 'bg-gray-100 text-gray-800',
  SENT: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  SCHOOL: 'bg-blue-100 text-blue-800',
  COLLEGE: 'bg-purple-100 text-purple-800',
};

export default function StatusBadge({ status }) {
  const display = (status || '').replace(/_/g, ' ');
  const colorClasses = colors[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}>
      {display}
    </span>
  );
}
