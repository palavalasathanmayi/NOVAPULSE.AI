import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { X, Database, UserCheck, Trash2, RefreshCw, LogIn, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';

export const DatabaseUsersModal: React.FC = () => {
  const {
    isDatabaseUsersModalOpen,
    setIsDatabaseUsersModalOpen,
    allDatabaseUsers,
    currentUser,
    loginWithGoogle,
    deleteDatabaseUser,
    refreshDatabaseUsers,
  } = useAuth();

  const { addToast } = useApp();

  useEffect(() => {
    if (isDatabaseUsersModalOpen) {
      refreshDatabaseUsers();
    }
  }, [isDatabaseUsersModalOpen]);

  if (!isDatabaseUsersModalOpen) return null;

  const handleSwitchUser = async (user: any) => {
    const success = await loginWithGoogle(undefined, {
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
      googleId: user.googleId,
    });
    if (success) {
      addToast({
        type: 'success',
        title: `Switched User to ${user.name}`,
        description: `Active role: ${user.role}. Recorded in database.`,
      });
      setIsDatabaseUsersModalOpen(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const ok = await deleteDatabaseUser(userId);
    if (ok) {
      addToast({
        type: 'info',
        title: 'User Removed from Database',
        description: `${userName} was deleted from data/users.json`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Users Remembered in Database</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {allDatabaseUsers.length} Persisted Records
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every user authentication is permanently recorded in <code className="text-indigo-300 font-mono">data/users.json</code>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshDatabaseUsers}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Refresh database records"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDatabaseUsersModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Database Stats Pill */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Active Session: <strong className="text-white">{currentUser ? `${currentUser.name} (${currentUser.email})` : 'Guest / Unauthenticated'}</strong>
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle className="w-3.5 h-3.5" /> Synchronized with Disk DB
          </span>
        </div>

        {/* Table of Users */}
        <div className="p-6 overflow-y-auto flex-1">
          {allDatabaseUsers.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">User Profile</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3 text-center">Logins</th>
                    <th className="py-3 px-3">Last Active</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {allDatabaseUsers.map(user => {
                    const isCurrent = currentUser?.id === user.id || currentUser?.email.toLowerCase() === user.email.toLowerCase();
                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-slate-900/50 transition-colors ${isCurrent ? 'bg-indigo-950/30' : ''}`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {isCurrent && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <span>{user.email}</span>
                                <span>•</span>
                                <span className="font-mono text-[10px] text-slate-500">{user.provider === 'google' ? 'Google OAuth' : 'Email'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              user.role === 'Executive Admin'
                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-bold'
                                : user.role === 'Area Operations Commander'
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-white">
                          {user.loginCount || 1}
                        </td>
                        <td className="py-3.5 px-3 text-[11px] text-slate-400 font-mono">
                          {new Date(user.lastLoginAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isCurrent && (
                              <button
                                onClick={() => handleSwitchUser(user)}
                                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 transition-colors"
                              >
                                Switch
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                              title="Delete from database"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No users found in database. Sign in with Google to create the first record.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Database Storage Path: <span className="font-mono text-indigo-300">data/users.json</span>
          </div>
          <button
            onClick={() => setIsDatabaseUsersModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Registry
          </button>
        </div>
      </div>
    </div>
  );
};
