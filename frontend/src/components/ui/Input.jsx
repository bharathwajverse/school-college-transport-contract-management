export default function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
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
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 bg-[#0D1220] text-white border rounded-2xl text-sm transition-all duration-200 outline-none focus:border-[#8B7CFF]/60 focus:ring-4 focus:ring-[#8B7CFF]/10 ${
          error ? 'border-[#EF4444] focus:ring-red-500/10' : 'border-white/10 hover:border-white/20'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-[#EF4444] font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-[#94A3B8]/60">{helperText}</span>}
    </div>
  );
}
