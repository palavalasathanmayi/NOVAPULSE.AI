import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Database, CheckCircle2, User, Mail, Sparkles, ArrowRight, LogIn } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, loginManual, isLoading } = useAuth();
  const { addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'google' | 'manual'>('google');
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualRole, setManualRole] = useState<'Executive Admin' | 'Area Operations Commander' | 'Merchant Success Lead' | 'Retention Analyst'>('Executive Admin');

  if (!isAuthModalOpen) return null;

  // 1-Click Fast Google Sign-in as the runtime Google User
  const handleRuntimeGoogleLogin = async () => {
    const success = await loginWithGoogle(undefined, {
      name: 'Thanmayi P',
      email: 'p.thanmayi09@gmail.com',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: 'Executive Admin',
      googleId: 'g_user_1092837482910',
    });

    if (success) {
      addToast({
        type: 'success',
        title: 'Signed in with Google',
        description: 'Welcome, Thanmayi P! User record updated in database.',
      });
    }
  };

  // Google Login with custom Google account credentials
  const handleCustomGoogleLogin = async (name: string, email: string, role: any) => {
    const success = await loginWithGoogle(undefined, {
      name,
      email,
      role,
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      googleId: `g_${Date.now()}`,
    });

    if (success) {
      addToast({
        type: 'success',
        title: 'Google Account Authenticated',
        description: `Logged in as ${name}. User remembered in database.`,
      });
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail.trim()) return;

    const success = await loginManual(manualEmail, manualName || manualEmail.split('@')[0], manualRole);
    if (success) {
      addToast({
        type: 'success',
        title: 'Account Registered',
        description: `User ${manualEmail} saved to database.`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Sign In to NOVA PULSE</h2>
              <p className="text-xs text-slate-400">Authenticate session & persist user in database</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Persistence Banner */}
        <div className="p-3 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center gap-2.5 px-5">
          <Database className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-[11px] text-emerald-200">
            <strong className="text-white font-semibold">User Database Active:</strong> Every user who signs in is automatically saved and remembered in the database.
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 text-xs px-5 pt-3">
          <button
            onClick={() => setActiveTab('google')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'google'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Google Sign-In</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'manual'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Manual / Custom Account
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {activeTab === 'google' && (
            <div className="space-y-4">
              {/* Primary Google Sign In Button */}
              <button
                onClick={handleRuntimeGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {/* Official Google Colored G Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in as Thanmayi P (p.thanmayi09@gmail.com)</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Or One-Click Team Switch
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Quick Preset Google Team Accounts */}
              <div className="space-y-2">
                <div
                  onClick={() => handleCustomGoogleLogin('Aravind Subramanian', 'aravind.s@novacart.internal', 'Area Operations Commander')}
                  className="p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 bg-slate-950/50 hover:bg-slate-950 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                      alt="Aravind"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-white">Aravind Subramanian</div>
                      <div className="text-[10px] text-slate-400">aravind.s@novacart.internal</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30">
                    Ops Commander
                  </span>
                </div>

                <div
                  onClick={() => handleCustomGoogleLogin('Ritu Nambiar', 'ritu.n@novacart.internal', 'Merchant Success Lead')}
                  className="p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 bg-slate-950/50 hover:bg-slate-950 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                      alt="Ritu"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-white">Ritu Nambiar</div>
                      <div className="text-[10px] text-slate-400">ritu.n@novacart.internal</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                    Merchant Lead
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikramaditya Rao"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@novacart.com"
                  value={manualEmail}
                  onChange={e => setManualEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Assigned Role</label>
                <select
                  value={manualRole}
                  onChange={e => setManualRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Executive Admin">Executive Admin</option>
                  <option value="Area Operations Commander">Area Operations Commander</option>
                  <option value="Merchant Success Lead">Merchant Success Lead</option>
                  <option value="Retention Analyst">Retention Analyst</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all mt-2"
              >
                {isLoading ? 'Saving to Database...' : 'Sign In & Save to Database'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 text-center text-[10px] text-slate-400">
          User profiles and login counts are persisted to server storage at <code className="text-indigo-300 font-mono">data/users.json</code>
        </div>
      </div>
    </div>
  );
};
