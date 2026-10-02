import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Store, StoreCategory } from '../types';
import { generateStorePlanAi } from '../services/aiService';
import { PARTNER_STORE_EVIDENCE } from '../data/caseData';
import {
  Store as StoreIcon,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  ArrowRight,
  RefreshCw,
  Zap,
  Info,
} from 'lucide-react';

export const StoreIntelligence: React.FC = () => {
  const {
    stores,
    selectedCity,
    selectedStoreId,
    setSelectedStoreId,
    selectedStore,
    activeStorePlan,
    setActiveStorePlan,
    markStoreActionPlanDone,
    addToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const categories: string[] = [
    'All',
    'Groceries & Staples',
    'Fresh Produce & Fruits',
    'Dairy & Bakery',
    'Daily Essentials',
    'Organic & Gourmet',
  ];

  const filteredStores = useMemo(() => {
    return stores.filter(s => {
      const matchesCity = selectedCity === 'All' || s.city === selectedCity;
      const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCity && matchesCategory && matchesSearch;
    });
  }, [stores, selectedCity, categoryFilter, searchTerm]);

  // Handle Action Plan Generation
  const handleGeneratePlan = async (st: Store) => {
    setIsGeneratingPlan(true);
    try {
      const res = await generateStorePlanAi(st);
      setActiveStorePlan(res.data);
      addToast({
        type: 'success',
        title: `AI Action Plan Prepared for ${st.name}`,
        description: `Operational support roadmap generated via ${res.modelUsed}`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Action Plan Failed',
        description: 'Unable to compile store plan.',
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">STORE INTELLIGENCE</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Partner Enablement
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Empower local kirana merchants with rapid inventory audits and busy-period throttling — <span className="text-emerald-400 font-medium">support stores, do not penalize them.</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Active Stores: <strong className="text-white">{stores.length}</strong> (620 Case Total)
          </div>
        </div>
      </div>

      {/* Partner Store Empathy Notice (Mandatory Section 5 & 14) */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-indigo-500/30 flex items-start gap-3.5 shadow-lg">
        <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-bold text-white flex items-center gap-2">
            <span>Partner Philosophy: Co-Elevation, Not Store Blaming</span>
            <span className="text-[10px] text-indigo-300 font-mono">18% Merchant Churn Risk</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            39% of partner stores report inventory maintenance requires too much manual effort, and 23% reject orders simply because physical counter queues are full. NOVA PULSE solves this through <strong>90-second rapid barcode sync</strong> and <strong>dynamic rush throttling</strong>, protecting merchant dignity and unit economics.
          </p>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search stores by name, locality, or ID (e.g. Local Mart Indiranagar)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Stores Registry & Store Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Stores Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Partner Store Registry
            </span>
            <span className="text-[11px] text-slate-500">Showing {filteredStores.length} stores</span>
          </div>

          <div className="overflow-x-auto max-h-[720px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 sticky top-0 z-10 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Store</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Health</th>
                  <th className="py-3 px-3 text-center">Inventory</th>
                  <th className="py-3 px-3 text-center">Acceptance</th>
                  <th className="py-3 px-4 text-right">Action Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-normal">
                {filteredStores.map(st => {
                  const isSelected = selectedStore?.id === st.id;
                  let healthBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                  if (st.healthScore < 65) healthBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';
                  else if (st.healthScore < 80) healthBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';

                  return (
                    <tr
                      key={st.id}
                      onClick={() => {
                        setSelectedStoreId(st.id);
                        if (!activeStorePlan || activeStorePlan.storeId !== st.id) {
                          setActiveStorePlan(null);
                        }
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-950/40 border-l-4 border-l-indigo-500'
                          : 'hover:bg-slate-900/50'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{st.name}</span>
                          {st.riskOfLeaving && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="At risk of leaving platform" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{st.city} • {st.inventoryUpdateFrequency}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300">{st.category}</td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-mono text-xs border ${healthBadge}`}>
                          {st.healthScore}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-200">
                        {st.inventoryAccuracy}%
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-200">
                        {st.orderAcceptanceRate}%
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            st.actionPlanStatus === 'Actioned'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {st.actionPlanStatus || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Store Intelligence & Action Plan Drawer (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl space-y-5 sticky top-20">
          {selectedStore ? (
            <>
              {/* Store Drawer Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedStore.name}</h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Score: {selectedStore.healthScore}/100
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {selectedStore.address}
                  </div>
                </div>

                <button
                  onClick={() => handleGeneratePlan(selectedStore)}
                  disabled={isGeneratingPlan}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingPlan ? 'Generating...' : 'Generate Action Plan'}</span>
                </button>
              </div>

              {/* Operational Metrics Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Inventory Freshness</div>
                  <div className={`text-xs font-bold font-mono mt-0.5 ${selectedStore.inventoryUpdateFrequency.includes('days') ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedStore.inventoryUpdateFrequency}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Sync: {selectedStore.lastInventoryUpdate}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Stock Accuracy</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">{selectedStore.inventoryAccuracy}%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Physical Audit</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Rush Rejection</div>
                  <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">{selectedStore.busyPeriodRejectionRate}%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">7-9 PM Peak</div>
                </div>
              </div>

              {/* Identified Friction Points */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Store Performance Diagnostic</span>
                  <span className="text-[10px] text-slate-400">Monthly Volume: {selectedStore.activeMonthlyOrders} orders</span>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Order Cancellation Rate:</span>
                    <span className="font-mono font-bold text-rose-400">{selectedStore.cancellationRate}% (Avg is 11%)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Item Substitution Frequency:</span>
                    <span className="font-mono font-bold text-amber-400">{selectedStore.substitutionRate}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Merchant Partner Satisfaction:</span>
                    <span className="font-mono text-slate-200">{selectedStore.partnerSatisfaction} / 5.0</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Retention Risk:</span>
                    <span className={`font-semibold ${selectedStore.riskOfLeaving ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {selectedStore.riskOfLeaving ? 'Considering leaving within 12 months' : 'Committed partner'}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Store Action Plan Card (Mandatory Section 14) */}
              {activeStorePlan ? (
                <div className="p-4 rounded-xl border border-indigo-500/40 bg-indigo-950/20 space-y-3.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        AI Store Action Plan
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        activeStorePlan.status === 'Actioned'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {activeStorePlan.status === 'Actioned' ? 'Actioned • Deployed' : 'Action Plan Ready'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {activeStorePlan.actions.map((act, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                        <div className="font-bold text-indigo-200">{act.title}</div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{act.description}</p>
                        <div className="text-[10px] text-emerald-400 font-medium">Impact: {act.impact}</div>
                      </div>
                    ))}
                  </div>

                  {/* Partner Support Offering */}
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-200 space-y-1">
                    <strong className="text-white font-semibold">NOVA CART Merchant Support Commitment:</strong>
                    <p className="leading-relaxed">{activeStorePlan.partnerSupportOffering}</p>
                  </div>

                  {/* "Mark Actioned" Button (Real State Change) */}
                  <div className="pt-2">
                    <button
                      onClick={() => markStoreActionPlanDone(selectedStore.id)}
                      disabled={activeStorePlan.status === 'Actioned'}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeStorePlan.status === 'Actioned'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{activeStorePlan.status === 'Actioned' ? 'Plan Already Actioned (+12 pts Health Added)' : 'Mark Actioned (Deploy to Store Terminal)'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 text-center text-xs text-slate-400 space-y-3">
                  <p>Generate a non-punitive operational support plan tailored to {selectedStore.name}'s peak hour bottlenecks.</p>
                  <button
                    onClick={() => handleGeneratePlan(selectedStore)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Generate AI Action Plan
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select a partner store to audit inventory freshness and generate enablement roadmap.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
