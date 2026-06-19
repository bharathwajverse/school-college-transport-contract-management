import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Map,
  Bus,
  CreditCard,
  Bell,
  BarChart3,
  Database,
  LogOut,
  Sparkles,
  Settings
} from 'lucide-react';

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  const links = [
    {
      to: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      to: '/institutions',
      label: 'Institutions',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      to: '/contracts',
      label: 'Contracts',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      to: '/routes',
      label: 'Routes',
      icon: <Map className="w-5 h-5" />,
    },
    {
      to: '/vehicles',
      label: 'Vehicles',
      icon: <Bus className="w-5 h-5" />,
    },
    {
      to: '/payments',
      label: 'Payments',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      to: '/alerts',
      label: 'Alerts',
      icon: <Bell className="w-5 h-5" />,
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  if (user?.role === 'ADMIN') {
    links.push({
      to: '/audit-logs',
      label: 'Audit Logs',
      icon: <Database className="w-5 h-5" />,
    });
  }


  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0D1220] text-slate-200 border-r border-white/5 transform transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto flex flex-col`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5 bg-[#090C16]/50">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B7CFF] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#8B7CFF]/25 text-white font-bold">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide leading-tight text-white uppercase flex items-center gap-1.5">
              Manivtha
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#A78BFA]">
              Tours & Travels
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 mt-6 px-4 space-y-1.5 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group relative cursor-pointer
                ${isActive
                  ? 'bg-gradient-to-r from-[#8B7CFF]/15 to-transparent text-[#8B7CFF] border border-[#8B7CFF]/20'
                  : 'text-[#94A3B8] hover:bg-white/5 hover:text-white border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span 
                      layoutId="activeSideBarLink"
                      className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#8B7CFF] rounded-r-md"
                    />
                  )}
                  <span className={`transition-transform group-hover:scale-105 duration-200 ${isActive ? 'text-[#8B7CFF]' : 'text-[#94A3B8] group-hover:text-white'}`}>{link.icon}</span>
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Premium Upgrade Badge (styled like the bottom of Stakent sidebar) */}
        <div className="px-4 mb-4">
          <div className="p-4 bg-gradient-to-br from-[#121827] to-[#0D1220] border border-white/5 rounded-2xl relative overflow-hidden flex flex-col gap-2 shadow-inner">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#8B7CFF]/10 rounded-full blur-xl" />
            <div className="flex items-center gap-2 text-[#A78BFA] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Premium Core</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-normal font-medium">
              Enterprise Dashboard active with automatic alert detection system.
            </p>
          </div>
        </div>

        {/* Footer Area with User and Logout */}
        <div className="p-4 border-t border-white/5 bg-[#090C16]/50">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-medium text-[#94A3B8] hover:bg-red-950/20 hover:text-red-400 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-red-400/80" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
