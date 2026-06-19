export default function Badge({ children, variant = 'info', className = '', ...props }) {
  const variants = {
    success: 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 shadow-sm shadow-[#22C55E]/5',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 shadow-sm shadow-[#F59E0B]/5',
    danger: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 shadow-sm shadow-red-500/5',
    info: 'bg-[#8B7CFF]/10 text-[#8B7CFF] border border-[#8B7CFF]/20 shadow-sm shadow-[#8B7CFF]/5',
    neutral: 'bg-white/5 text-[#94A3B8] border border-white/5',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
