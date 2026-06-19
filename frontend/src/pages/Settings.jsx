import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Shield,
  Bell,
  Sliders,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [toastMessage, setToastMessage] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: user?.full_name || 'Bharathwaj',
    email: user?.email || 'admin@manivtha.com',
    role: user?.role || 'ADMIN'
  });

  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  // Notifications State
  const [notifications, setNotifications] = useState({
    expiry90: true,
    expiry30: true,
    paymentOverdue: true,
    paymentSuccess: false,
    systemLogs: true
  });

  // System Preferences State
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    compactMode: false,
    animations: true,
    currency: 'INR'
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    // Simulate API update
    triggerToast('Profile information successfully saved!');
  };

  const handleSecuritySave = (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      triggerToast('Error: Passwords do not match!');
      return;
    }
    // Simulate API update
    triggerToast('Password successfully updated!');
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleNotificationsSave = (e) => {
    e.preventDefault();
    triggerToast('Notification preferences successfully saved!');
  };

  const handlePreferencesSave = (e) => {
    e.preventDefault();
    triggerToast('System preferences successfully updated!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Access', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 text-white animate-fade-in relative">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 border rounded-2xl shadow-2xl backdrop-blur-md ${
              toastMessage.startsWith('Error')
                ? 'bg-red-950/80 border-red-500/20 text-red-200'
                : 'bg-[#121827]/90 border-emerald-500/20 text-emerald-200'
            }`}
          >
            <CheckCircle className={`w-5 h-5 ${toastMessage.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`} />
            <span className="text-xs font-bold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Settings</h1>
        <p className="text-xs text-[#94A3B8] mt-1 font-medium">
          Manage your personal account parameters, security overrides, and user alert notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar Panel */}
        <Card className="lg:col-span-1 p-3 bg-[#121827]/40 border border-white/5 shadow-2xl">
          <div className="flex flex-col gap-1">
            {tabs.map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-[#8B7CFF]/15 to-transparent text-[#8B7CFF] border border-[#8B7CFF]/20 shadow-md shadow-[#8B7CFF]/5'
                      : 'text-[#94A3B8] hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Content Form Workstation */}
        <Card className="lg:col-span-3 p-6 bg-[#121827]/40 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B7CFF]/5 rounded-full blur-2xl pointer-events-none" />

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-[#8B7CFF]" />
                  Profile details
                </h3>
                <p className="text-[11px] text-[#94A3B8] font-medium mt-1">
                  Ensure your user contact information is up to date.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="e.g. Bharathwaj"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                />

                <Input
                  label="Email Address"
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="e.g. admin@manivtha.com"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                  Assigned User Role
                </label>
                <div className="flex items-center gap-2">
                  <Badge variant="success">
                    {profileForm.role}
                  </Badge>
                  <span className="text-[11px] text-[#94A3B8]/60 font-medium">
                    (Contact administrator to request privilege escalation)
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <Button type="submit" variant="primary">
                  Save Details
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSecuritySave} className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4.5 h-4.5 text-[#8B7CFF]" />
                  Access Security
                </h3>
                <p className="text-[11px] text-[#94A3B8] font-medium mt-1">
                  Change your current password below to enforce account integrity.
                </p>
              </div>

              <div className="space-y-4 max-w-lg">
                <div className="relative">
                  <Input
                    label="Current Password"
                    type={showPass.current ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    required
                    placeholder="Enter your current password"
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                    className="absolute right-3.5 top-[34px] text-[#94A3B8] hover:text-white cursor-pointer"
                  >
                    {showPass.current ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPass.new ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    required
                    placeholder="Enforce 8+ alphanumeric characters"
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                    className="absolute right-3.5 top-[34px] text-[#94A3B8] hover:text-white cursor-pointer"
                  >
                    {showPass.new ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showPass.confirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    placeholder="Verify your new password input"
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                    className="absolute right-3.5 top-[34px] text-[#94A3B8] hover:text-white cursor-pointer"
                  >
                    {showPass.confirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <Button type="submit" variant="primary">
                  Update Password
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationsSave} className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4.5 h-4.5 text-[#8B7CFF]" />
                  Alert Notification Thresholds
                </h3>
                <p className="text-[11px] text-[#94A3B8] font-medium mt-1">
                  Enforce parameters for automated email prompts and upcoming system expirations.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3.5 p-3.5 bg-[#0D1220]/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-[#0D1220]/75 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.expiry90}
                    onChange={(e) => setNotifications({ ...notifications, expiry90: e.target.checked })}
                    className="mt-0.5 rounded border-white/10 text-[#8B7CFF] focus:ring-[#8B7CFF] bg-[#121827] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Email Alerts on 90-Day Expiries</span>
                    <span className="text-[11px] text-[#94A3B8] font-medium">Trigger warning notices when contracts enter 90-day remaining margin.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3.5 p-3.5 bg-[#0D1220]/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-[#0D1220]/75 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.expiry30}
                    onChange={(e) => setNotifications({ ...notifications, expiry30: e.target.checked })}
                    className="mt-0.5 rounded border-white/10 text-[#8B7CFF] focus:ring-[#8B7CFF] bg-[#121827] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Email Alerts on 30-Day Critical Expiries</span>
                    <span className="text-[11px] text-[#94A3B8] font-medium">Enforce high-frequency warnings when contracts are within 30 days of termination.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3.5 p-3.5 bg-[#0D1220]/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-[#0D1220]/75 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.paymentOverdue}
                    onChange={(e) => setNotifications({ ...notifications, paymentOverdue: e.target.checked })}
                    className="mt-0.5 rounded border-white/10 text-[#8B7CFF] focus:ring-[#8B7CFF] bg-[#121827] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Overdue Payment Invoices</span>
                    <span className="text-[11px] text-[#94A3B8] font-medium">Receive direct email notifications when a contract invoice misses its scheduled deadline.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3.5 p-3.5 bg-[#0D1220]/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-[#0D1220]/75 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.paymentSuccess}
                    onChange={(e) => setNotifications({ ...notifications, paymentSuccess: e.target.checked })}
                    className="mt-0.5 rounded border-white/10 text-[#8B7CFF] focus:ring-[#8B7CFF] bg-[#121827] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Transaction Receipts</span>
                    <span className="text-[11px] text-[#94A3B8] font-medium">Receive direct audit notification files on successful contract collections.</span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <Button type="submit" variant="primary">
                  Save Preferences
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'preferences' && (
            <form onSubmit={handlePreferencesSave} className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4.5 h-4.5 text-[#8B7CFF]" />
                  System Preferences
                </h3>
                <p className="text-[11px] text-[#94A3B8] font-medium mt-1">
                  Adjust standard styling tokens, animation behaviors, and visual density.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                    Default Interface Theme
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-[#080B14] border-2 border-[#8B7CFF]/60 flex items-center justify-between shadow-lg">
                      <div>
                        <span className="text-xs font-bold text-white block">Dark Stakent Theme</span>
                        <span className="text-[10px] text-[#A78BFA] font-bold uppercase tracking-wider mt-0.5 block">Active Preference</span>
                      </div>
                      <Sparkles className="w-4 h-4 text-[#8B7CFF] animate-pulse" />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 opacity-50 flex items-center justify-between cursor-not-allowed">
                      <div>
                        <span className="text-xs font-bold text-slate-400 block">System light theme</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 block">Locked</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-5 space-y-4">
                  <label className="flex items-center justify-between p-3.5 bg-[#0D1220]/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-[#0D1220]/75 transition-colors">
                    <div>
                      <span className="text-xs font-bold text-white block">Grid Compact Mode</span>
                      <span className="text-[11px] text-[#94A3B8] font-medium">Display tables and list item matrices with reduced padding density.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.compactMode}
                      onChange={(e) => setPreferences({ ...preferences, compactMode: e.target.checked })}
                      className="rounded border-white/10 text-[#8B7CFF] focus:ring-[#8B7CFF] bg-[#121827] w-4.5 h-4.5 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-[#0D1220]/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-[#0D1220]/75 transition-colors">
                    <div>
                      <span className="text-xs font-bold text-white block">Framer Motion Transitions</span>
                      <span className="text-[11px] text-[#94A3B8] font-medium">Enable smooth fade-ins and scale animations globally.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.animations}
                      onChange={(e) => setPreferences({ ...preferences, animations: e.target.checked })}
                      className="rounded border-white/10 text-[#8B7CFF] focus:ring-[#8B7CFF] bg-[#121827] w-4.5 h-4.5 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <Button type="submit" variant="primary">
                  Apply Preferences
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
