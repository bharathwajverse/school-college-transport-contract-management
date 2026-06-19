import Card from './Card';
import Badge from './Badge';

export default function StatCard({ title, value, icon, trend, trendType = 'success', className = '', ...props }) {
  const trendBadgeVariant = {
    success: 'success',
    danger: 'danger',
    warning: 'warning',
    info: 'info',
    neutral: 'neutral'
  };

  return (
    <Card className={`flex items-center justify-between p-6 relative overflow-hidden group ${className}`} {...props}>
      {/* Background glow hover effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#8B7CFF]/0 via-transparent to-[#8B7CFF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex flex-col gap-2 relative z-10">
        <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">{title}</span>
        <h4 className="text-3xl font-extrabold tracking-tight text-white">{value}</h4>
        {trend && (
          <Badge variant={trendBadgeVariant[trendType]} className="mt-1 w-fit">
            {trend}
          </Badge>
        )}
      </div>

      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#0D1220] border border-white/5 text-[#8B7CFF] flex items-center justify-center text-xl shadow-lg group-hover:border-[#8B7CFF]/30 group-hover:text-[#A78BFA] transition-all duration-300 relative z-10">
          {icon}
        </div>
      )}
    </Card>
  );
}
