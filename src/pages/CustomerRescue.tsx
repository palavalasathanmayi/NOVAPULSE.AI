import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Customer, RiskLevel } from '../types';
import { analyzeCustomerAi } from '../services/aiService';
import {
  Search,
  Filter,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Package,
  Headphones,
  RotateCcw,
  Zap,
  CheckCircle2,
  ChevronRight,
  Info,
  Calendar,
} from 'lucide-react';

export const CustomerRescue: React.FC = () => {
  const {
    customers,
    selectedCity,
    selectedCustomerId,
    setSelectedCustomerId,
    selectedCustomer,
    activeCustomerAnalysis,
    setActiveCustomerAnalysis,
    applyCustomerIntervention,
    orders,
    tickets,
    addToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'history'>('overview');

  // Filter customers by city, risk, and search query
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesCity = selectedCity === 'All' || c.city === selectedCity;
      const matchesRisk = riskFilter === 'All' || c.riskLevel === riskFilter;
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCity && matchesRisk && matchesSearch;
    });
  }, [customers, selectedCity, riskFilter, searchTerm]);

  // Orders and tickets for selected customer
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(o => o.customerId === selectedCustomer.id);
  }, [orders, selectedCustomer]);

  const customerTickets = useMemo(() => {
    if (!selectedCustomer) return [];
    return tickets.filter(t => t.customerId === selectedCustomer.id);
  }, [tickets, selectedCustomer]);

  // Handle "Analyze Customer" action
  const handleAnalyzeCustomer = async (cust: Customer) => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeCustomerAi(cust);
      setActiveCustomerAnalysis(res.data);
      setActiveTab('analysis');
      addToast({
        type: 'success',
        title: `Analysis Generated for ${cust.name}`,
        description: `Risk Score: ${res.data.score}/100 (${res.data.level} Risk) • ${res.modelUsed}`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Analysis Failed',
        description: 'Unable to calculate risk factors.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">CUSTOMER RESCUE</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              Retention Defense
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Detect at-risk customers, audit transparent root drivers, and deploy non-discount reliability recoveries.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2">
          {(['All', 'High', 'Medium', 'Low'] as const).map(level => (
            <button
              key={level}
              onClick={() => setRiskFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                riskFilter === level
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {level === 'All' ? 'All Customers' : `${level} Risk`}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, email, or ID (e.g. Priya Sharma)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 self-center px-2">
          Showing <span className="font-bold text-white">{filteredCustomers.length}</span> of {customers.length} records (Demo Data)
        </div>
      </div>

      {/* Main 2-Column Split: Customer List & Detailed Customer Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Risk Registry
            </span>
            <span className="text-[11px] text-slate-500">Click a customer to view diagnostic drawer</span>
          </div>

          <div className="overflow-x-auto max-h-[720px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 sticky top-0 z-10 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-3">City</th>
                  <th className="py-3 px-3 text-center">Orders</th>
                  <th className="py-3 px-3">Last Order</th>
                  <th className="py-3 px-3 text-center">Friction</th>
                  <th className="py-3 px-4 text-right">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-normal">
                {filteredCustomers.map(cust => {
                  const isSelected = selectedCustomer?.id === cust.id;
                  let riskPill = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                  if (cust.riskLevel === 'High') riskPill = 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';
                  if (cust.riskLevel === 'Medium') riskPill = 'bg-amber-500/20 text-amber-300 border-amber-500/40';

                  return (
                    <tr
                      key={cust.id}
                      onClick={() => {
                        setSelectedCustomerId(cust.id);
                        if (!activeCustomerAnalysis || activeCustomerAnalysis.customerId !== cust.id) {
                          setActiveCustomerAnalysis(null);
                          setActiveTab('overview');
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
                          <span>{cust.name}</span>
                          {cust.riskLevel === 'High' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{cust.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300">{cust.city}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-200">
                        {cust.totalOrders}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                        {cust.lastOrderDate}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[11px]">
                          {cust.cancelledOrdersCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono" title={`${cust.cancelledOrdersCount} cancelled`}>
                              {cust.cancelledOrdersCount}C
                            </span>
                          )}
                          {cust.deliveryDelayedOrdersCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono" title={`${cust.deliveryDelayedOrdersCount} delayed`}>
                              {cust.deliveryDelayedOrdersCount}D
                            </span>
                          )}
                          {cust.supportTicketsCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono" title={`${cust.supportTicketsCount} tickets`}>
                              {cust.supportTicketsCount}T
                            </span>
                          )}
                          {cust.cancelledOrdersCount === 0 && cust.deliveryDelayedOrdersCount === 0 && (
                            <span className="text-slate-500">—</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono border ${riskPill}`}>
                          <span>{cust.riskScore}</span>
                          <span className="text-[10px]">/100</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Customer Diagnostic Drawer (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl space-y-5 sticky top-20">
          {selectedCustomer ? (
            <>
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedCustomer.name}</h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold border font-mono ${
                        selectedCustomer.riskLevel === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : selectedCustomer.riskLevel === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {selectedCustomer.riskScore}/100 • {selectedCustomer.riskLevel} Risk
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>{selectedCustomer.city}</span>
                    <span>•</span>
                    <span className="font-mono">{selectedCustomer.phone}</span>
                    <span>•</span>
                    <span className="font-mono">{selectedCustomer.id}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAnalyzeCustomer(selectedCustomer)}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzing ? 'Calculating...' : 'Analyze Customer'}</span>
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 px-3 font-semibold transition-colors border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-indigo-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Profile & Risk Factors
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`pb-2 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'analysis'
                      ? 'border-indigo-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>AI Recommendation</span>
                  {activeCustomerAnalysis && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`pb-2 px-3 font-semibold transition-colors border-b-2 ${
                    activeTab === 'history'
                      ? 'border-indigo-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Orders ({customerOrders.length})
                </button>
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Summary Metric Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Lifetime Spend</div>
                      <div className="text-sm font-bold text-white font-mono mt-0.5">₹{selectedCustomer.lifetimeValue}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Total Orders</div>
                      <div className="text-sm font-bold text-white font-mono mt-0.5 flex items-center justify-center gap-1">
                        <span>{selectedCustomer.totalOrders}</span>
                        <span className="text-[10px] font-normal text-slate-500">/ 3 threshold</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Prior Rating</div>
                      <div className="text-sm font-bold text-amber-400 font-mono mt-0.5 flex items-center justify-center gap-0.5">
                        <span>★</span>
                        <span>{selectedCustomer.previousRating || 4.5}</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Acquisition</div>
                      <div className="text-[11px] font-semibold text-slate-300 mt-0.5 truncate" title={selectedCustomer.acquisitionChannel}>
                        {selectedCustomer.acquisitionChannel}
                      </div>
                    </div>
                  </div>

                  {/* 61% High Intent Rater Callout */}
                  {selectedCustomer.riskLevel === 'High' && (
                    <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">★ {selectedCustomer.previousRating || 4.8}</span>
                        <span>High-Intent Churner (61% of lost customers previously rated 4★+)</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                        Recoverable
                      </span>
                    </div>
                  )}

                  {/* Operational Friction Breakdown */}
                  <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Operational Friction Encountered</span>
                      <span className="text-[10px] text-slate-400">Cumulative Telemetry</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                          <span>Order Cancellations:</span>
                        </span>
                        <span className="font-mono font-bold text-rose-400">
                          {selectedCustomer.cancelledOrdersCount} ({selectedCustomer.totalOrders > 0 ? Math.round((selectedCustomer.cancelledOrdersCount / selectedCustomer.totalOrders) * 100) : 0}%)
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Delivery Delays (&gt;promised):</span>
                        </span>
                        <span className="font-mono font-bold text-amber-400">
                          {selectedCustomer.deliveryDelayedOrdersCount}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Package className="w-3.5 h-3.5 text-sky-400" />
                          <span>Stockout Orders & Phantom Queries:</span>
                        </span>
                        <span className="font-mono font-bold text-sky-400">
                          {selectedCustomer.unavailableProductOrdersCount} out-of-stock + {selectedCustomer.searchesForUnavailableCount} queries
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Headphones className="w-3.5 h-3.5 text-violet-400" />
                          <span>Customer Support Inquiries:</span>
                        </span>
                        <span className="font-mono font-bold text-violet-400">
                          {selectedCustomer.supportTicketsCount} tickets ({selectedCustomer.refundsCount} refunds)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Case Notes */}
                  {selectedCustomer.recentNotes && (
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                      <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1">
                        Recent Diagnostic Notes
                      </div>
                      <p className="text-slate-300 leading-relaxed italic">
                        "{selectedCustomer.recentNotes}"
                      </p>
                    </div>
                  )}

                  {/* Call to Action to Analyze */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleAnalyzeCustomer(selectedCustomer)}
                      disabled={isAnalyzing}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isAnalyzing ? 'Calculating Factors...' : 'Analyze Customer Risk & Generate Recovery Plan'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: AI RECOMMENDATION / RISK ENGINE (Section 11 & 12) */}
              {activeTab === 'analysis' && (
                <div className="space-y-4">
                  {/* Transparent Rule-based Score Notice (Section 11 Constraint) */}
                  <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Prototype rule-based risk score:</strong> Formulated using transparent weights: 30% inactivity, 25% cancellations, 20% delivery delays, 15% unavailable products, 10% support friction.
                    </div>
                  </div>

                  {/* Factor Breakdown Bars */}
                  {activeCustomerAnalysis && (
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>Risk Factor Weighting Breakdown</span>
                        <span className="font-mono text-xs text-rose-400 font-bold">
                          {activeCustomerAnalysis.score}/100 ({activeCustomerAnalysis.level} Risk)
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Recent Inactivity (30% weight)</span>
                            <span className="font-mono text-slate-300">{activeCustomerAnalysis.factorBreakdown.inactivityScore}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${activeCustomerAnalysis.factorBreakdown.inactivityScore}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Cancellation History (25% weight)</span>
                            <span className="font-mono text-slate-300">{activeCustomerAnalysis.factorBreakdown.cancellationScore}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${activeCustomerAnalysis.factorBreakdown.cancellationScore}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Delivery Delay Rate (20% weight)</span>
                            <span className="font-mono text-slate-300">{activeCustomerAnalysis.factorBreakdown.deliveryScore}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${activeCustomerAnalysis.factorBreakdown.deliveryScore}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Product Availability Stockouts (15% weight)</span>
                            <span className="font-mono text-slate-300">{activeCustomerAnalysis.factorBreakdown.availabilityScore}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${activeCustomerAnalysis.factorBreakdown.availabilityScore}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Support & Refund Burden (10% weight)</span>
                            <span className="font-mono text-slate-300">{activeCustomerAnalysis.factorBreakdown.supportScore}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${activeCustomerAnalysis.factorBreakdown.supportScore}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Top 3 Drivers & Evidence (Section 11) */}
                  {activeCustomerAnalysis && (
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-white">Top 3 Primary Risk Drivers</div>
                      <div className="space-y-1.5">
                        {activeCustomerAnalysis.evidence.map((ev, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="text-rose-400 font-bold font-mono shrink-0">#{i + 1}</span>
                            <span className="leading-snug">{ev}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Targeted Recovery Action Plan (Section 12) */}
                  {activeCustomerAnalysis && (
                    <div className="p-4 rounded-xl border border-indigo-500/40 bg-indigo-950/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                          Recommended Recovery Strategy
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
                          {activeCustomerAnalysis.recommendationType}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-slate-300 font-medium">Prescribed Actions:</div>
                        <ul className="text-xs text-slate-300 space-y-1.5 pl-1">
                          {activeCustomerAnalysis.recommendedActions.map((act, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Explanation of WHY this was chosen (Section 12) */}
                      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                        <strong className="text-indigo-300 font-semibold">Why this recommendation?</strong>
                        <p className="leading-relaxed">{activeCustomerAnalysis.whyRecommended}</p>
                      </div>

                      {/* Explicit Discount Justification Logic (No spray-and-pray coupons) */}
                      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-amber-300 font-semibold">Discount Voucher Decision:</strong>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              activeCustomerAnalysis.discountJustified
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {activeCustomerAnalysis.discountJustified ? 'Justified' : 'Withheld (Anti-Churn)'}
                          </span>
                        </div>
                        <p className="leading-relaxed text-slate-400">{activeCustomerAnalysis.discountRationale}</p>
                      </div>

                      {/* Trigger Intervention Button */}
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            applyCustomerIntervention(
                              selectedCustomer.id,
                              activeCustomerAnalysis.recommendationType,
                              activeCustomerAnalysis.recommendedActions[0]
                            );
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all"
                        >
                          <Zap className="w-4 h-4" />
                          <span>Deploy Targeted Recovery Intervention</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {!activeCustomerAnalysis && (
                    <div className="p-6 text-center text-xs text-slate-400 space-y-3">
                      <p>Click "Analyze Customer" above to calculate transparent risk drivers and generate the non-discount recovery protocol.</p>
                      <button
                        onClick={() => handleAnalyzeCustomer(selectedCustomer)}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                      >
                        Run Analysis
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ORDER HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Recent Orders for {selectedCustomer.name}
                  </div>

                  {customerOrders.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {customerOrders.map(ord => (
                        <div
                          key={ord.id}
                          className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white font-mono">#{ord.id}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.status === 'Resolved' || ord.status === 'Delivered'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : ord.status === 'Delayed'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <div className="text-slate-400 flex items-center justify-between">
                            <span>Store: <strong className="text-slate-300">{ord.storeName}</strong></span>
                            <span className="font-mono text-white font-semibold">₹{ord.orderValue}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center justify-between">
                            <span>ETA: {ord.estimatedMinutes}m • Actual: {ord.actualMinutes ? `${ord.actualMinutes}m` : 'N/A'}</span>
                            <span>{ord.orderDate}</span>
                          </div>
                          {ord.rootCause && (
                            <div className="p-2 rounded bg-rose-950/30 border border-rose-500/20 text-[11px] text-rose-300">
                              <strong>Cause:</strong> {ord.rootCause}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 p-4 text-center">
                      No recent order history logged for this customer.
                    </div>
                  )}

                  {customerTickets.length > 0 && (
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Linked Support Tickets
                      </div>
                      {customerTickets.map(tkt => (
                        <div key={tkt.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-slate-300 font-semibold">{tkt.ticketNumber} ({tkt.issueType})</span>
                            <span className="text-[10px] text-amber-400 font-medium">{tkt.status}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 italic">"{tkt.description}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select a customer from the registry to inspect profile and run risk engine.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
