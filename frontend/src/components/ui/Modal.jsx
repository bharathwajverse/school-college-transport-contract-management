import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Box */}
      <div
        className={`relative bg-[#121827] rounded-3xl shadow-2xl border border-white/5 max-w-lg w-full overflow-hidden p-6 z-10 animate-fade-in text-white ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#94A3B8] hover:bg-white/5 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}
