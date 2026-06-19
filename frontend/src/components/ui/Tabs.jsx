
export default function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={`flex border-b border-white/5 gap-6 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
              isActive
                ? 'border-[#8B7CFF] text-[#8B7CFF]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

