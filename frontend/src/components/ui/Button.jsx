export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyle =
    'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]/50 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary:
      'bg-gradient-to-tr from-[#8B7CFF] to-[#A78BFA] text-white shadow-lg shadow-[#8B7CFF]/25 hover:brightness-110',
    secondary:
      'bg-[#121827] border border-white/10 text-[#94A3B8] hover:bg-white/5 hover:text-white hover:border-white/20',
    danger:
      'bg-[#EF4444] text-white shadow-lg shadow-red-500/20 hover:bg-red-500',
    success:
      'bg-[#22C55E] text-white shadow-lg shadow-green-500/20 hover:bg-green-600',
    ghost:
      'bg-transparent hover:bg-white/5 text-[#94A3B8] hover:text-white',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
