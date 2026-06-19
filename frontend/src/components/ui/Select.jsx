export default function Select({
  label,
  id,
  options = [],
  value,
  onChange,
  error,
  helperText,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 bg-[#0D1220] text-white border rounded-2xl text-sm transition-all duration-200 outline-none focus:border-[#8B7CFF]/60 focus:ring-4 focus:ring-[#8B7CFF]/10 cursor-pointer appearance-none ${
          error ? 'border-[#EF4444] focus:ring-red-500/10' : 'border-white/10 hover:border-white/20'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394A3B8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 1rem center',
          backgroundSize: '1.25rem',
          backgroundRepeat: 'no-repeat',
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0D1220] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-[#EF4444] font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-[#94A3B8]/60">{helperText}</span>}
    </div>
  );
}
