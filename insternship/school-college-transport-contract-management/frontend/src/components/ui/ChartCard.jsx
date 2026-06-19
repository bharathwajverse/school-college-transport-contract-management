import Card from './Card';

export default function ChartCard({ title, children, className = '', ...props }) {
  return (
    <Card className={`flex flex-col gap-5 ${className}`} {...props}>
      <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">{title}</h3>
      <div className="flex-1 min-h-[280px] relative w-full text-xs">
        {children}
      </div>
    </Card>
  );
}
