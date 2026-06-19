
export default function Drawer({ isOpen, onClose, title, children, className = '' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Drawer content panel */}
        <div className={`w-screen max-w-md bg-white shadow-xl border-l border-gray-100 flex flex-col p-6 animate-fade-in ${className}`}>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-950">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto pr-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
