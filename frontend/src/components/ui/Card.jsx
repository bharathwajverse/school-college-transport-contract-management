export default function Card({ children, className = '', hoverable = false, ...props }) {
  return (
    <div
      className={`bg-[#121827]/70 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
        hoverable ? 'hover:border-[#8B7CFF]/30 hover:shadow-[#8B7CFF]/5 hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
