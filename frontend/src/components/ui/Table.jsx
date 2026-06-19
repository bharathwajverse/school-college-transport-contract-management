export default function Table({ headers = [], children, className = '', ...props }) {
  return (
    <div className={`overflow-x-auto w-full bg-[#121827]/40 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl ${className}`} {...props}>
      <table className="min-w-full table-auto text-left text-sm">
        <thead className="bg-[#0D1220]/80 border-b border-white/5 sticky top-0">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white/90">
          {children}
        </tbody>
      </table>
    </div>
  );
}
