import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { City } from '../types';
import { Activity, Play, Target, MapPin, Database, LogIn, LogOut, ChevronDown, User, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    selectedCity,
    setSelectedCity,
    startJudgeTour,
    tourStep,
    setIsBusinessImpactModalOpen,
  } = useApp();

  const {
    currentUser,
    allDatabaseUsers,
    setIsAuthModalOpen,
    setIsDatabaseUsersModalOpen,
    logout,
  } = useAuth();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cities: (City | 'All')[] = ['All', 'Bengaluru', 'Mumbai', 'Delhi-NCR'];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">NOVA PULSE</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Pilot
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            <span className="text-indigo-300 font-semibold">Turn operational friction into customer retention.</span>
          </p>
        </div>
      </div>

      {/* Middle & Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* City Filter Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <MapPin className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedCity === city
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Database Users Registry Quick Button */}
        <button
          onClick={() => setIsDatabaseUsersModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-emerald-500/40 transition-colors shadow-sm"
          title="Inspect users remembered in backend database"
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Users in DB</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {allDatabaseUsers.length}
          </span>
        </button>

        {/* Business Impact Modal Button */}
        <button
          onClick={() => setIsBusinessImpactModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors shadow-sm"
        >
          <Target className="w-3.5 h-3.5 text-indigo-400" />
          <span>Impact & Budget</span>
        </button>

        {/* Judge Demo Tour Launch Button */}
        <button
          onClick={startJudgeTour}
          className={`relative hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
            tourStep !== null
              ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/50'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/30'
          }`}
          title="Run the 7-Step Judge Demonstration Flow"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>{tourStep !== null ? `Tour Active (${tourStep}/7)` : 'Judge Demo Tour'}</span>
          {tourStep === null && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </button>

        {/* Google Sign-in / User Profile Section */}
        {currentUser ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs"
            >
              <img
                src={currentUser.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-700"
              />
              <div className="text-left hidden md:block">
                <div className="font-bold text-white leading-tight flex items-center gap-1">
                  <span>{currentUser.name}</span>
                </div>
                <div className="text-[10px] text-indigo-400 leading-tight truncate max-w-[110px]">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2.5 border-b border-slate-800 mb-1">
                  <div className="font-bold text-white text-xs">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Logged in via {currentUser.provider === 'google' ? 'Google' : 'Email'}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Total logins: {currentUser.loginCount || 1}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsDatabaseUsersModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Users in Database</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                    {allDatabaseUsers.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Switch Account / Sign In</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors mt-1 border-t border-slate-800/80 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
          >
            {/* Google G Logo */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
            <span>Login with Google</span>
          </button>
        )}
      </div>
    </header>
  );
};
