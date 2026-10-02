import React from 'react';
import { useApp, AppPage } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  GitFork,
  Store as StoreIcon,
  Truck,
  Sparkles,
  Sliders,
  AlertTriangle,
  Flame,
  HelpCircle,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, customers, orders, stores } = useApp();

  // Dynamic badges
  const highRiskCustomersCount = customers.filter(c => c.riskLevel === 'High').length;
  const atRiskOrdersCount = orders.filter(o => o.resolutionStatus === 'Active' && (o.isDelayed || o.status === 'Delayed' || o.hasUnavailableItem)).length;
  const staleStoresCount = stores.filter(s => s.inventoryUpdateFrequency.includes('days') && s.healthScore < 70).length;

  const navItems: { id: AppPage; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'command_center',
      label: 'Command Center',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'customer_rescue',
      label: 'Customer Rescue',
      icon: <Users className="w-4 h-4" />,
      badge: highRiskCustomersCount,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'root_causes',
      label: 'Root Causes',
      icon: <GitFork className="w-4 h-4" />,
    },
    {
      id: 'store_intelligence',
      label: 'Store Intelligence',
      icon: <StoreIcon className="w-4 h-4" />,
      badge: staleStoresCount,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'operations',
      label: 'Operations',
      icon: <Truck className="w-4 h-4" />,
      badge: atRiskOrdersCount,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'ai_insights',
      label: 'AI Insights',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'scenario_simulator',
      label: 'Scenario Simulator',
      icon: <Sliders className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0">
      {/* Navigation Links */}
      <div className="p-3 space-y-1 flex-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Command Navigation
        </div>
        {navItems.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                    isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Strategic Callout Card */}
      <div className="p-3 m-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-rose-400 font-bold mb-1.5">
          <Flame className="w-3.5 h-3.5 shrink-0" />
          <span>Core Challenge Triage</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Acquisition is growing while Repeat Purchase drops from <strong className="text-white">41% → 27%</strong>.
          Operational reliability is the primary lever.
        </p>
        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span>Constraint: ₹25L</span>
          <span className="text-emerald-400 font-medium">6-Mo Horizon</span>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>PromptWars 2026</span>
        <span className="font-mono text-slate-400">v1.2-pilot</span>
      </div>
    </aside>
  );
};
