import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GitFork,
  ArrowRight,
  AlertTriangle,
  Package,
  Store,
  Clock,
  Headphones,
  ShieldAlert,
  CheckCircle,
  Sparkles,
  Info,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const RootCauseExplorer: React.FC = () => {
  const { customers, orders, stores, products, setActivePage, setSelectedCustomerId, setSelectedOrderId } = useApp();

  // Preset Causal Scenarios for fast demonstration
  const scenarios = [
    {
      id: 'scenario-priya',
      title: 'Priya Sharma (Primary Demo) — Stale Inventory Stockout',
      customerId: 'CUST-1001',
      orderId: 'NC10482',
      storeId: 'STORE-201',
      productId: 'PROD-301',
      problemType: 'Product Unavailable in Store (35% Case Driver)',
      rootCause: 'Local Mart inventory tally was 2 days stale; store ran out of 5kg Atta physical bags during walk-in morning rush.',
      inventoryAge: '2 days ago (Stale)',
      impactSummary: 'Order stalled for 22 mins prep → cancelled → support ticket opened → 82/100 retention risk.',
    },
    {
      id: 'scenario-amit',
      title: 'Amit Joshi — Peak Rush In-Store Walk-in Rejection',
      customerId: 'CUST-1006',
      orderId: 'NC10484',
      storeId: 'STORE-201',
      productId: 'PROD-304',
      problemType: 'Store Rejected Order (18% Case Driver)',
      rootCause: 'Local Mart Indiranagar rejected digital checkout at 8:30 PM due to packed in-store billing counter queues.',
      inventoryAge: '2 days ago',
      impactSummary: 'Order rejected after 25 mins wait → zero alternative partner rerouting → customer churn probability spikes.',
    },
    {
      id: 'scenario-rahul',
      title: 'Rahul Verma — Rain Backlog & Unapproved Substitution',
      customerId: 'CUST-1002',
      orderId: 'NC10483',
      storeId: 'STORE-202',
      productId: 'PROD-309',
      problemType: 'Delivery Delay + Item Substitution (27% + 8% Case Drivers)',
      rootCause: 'Bandra traffic surge delayed rider pickup by 21 mins, and store substituted generic tomatoes without opt-in.',
      inventoryAge: '1 day ago',
      impactSummary: 'Milk arrived damaged + wrong items → support refund dispute filed → customer inactive for 20 days.',
    },
    {
      id: 'scenario-gaurav',
      title: 'Gaurav Bansal — Delivery Partner Congestion in Cyber City',
      customerId: 'CUST-1024',
      orderId: 'NC10495',
      storeId: 'STORE-211',
      productId: 'PROD-316',
      problemType: 'Delivery Delay (27% Case Driver)',
      rootCause: 'Cyber City torrential rain starved delivery partner availability; pickup wait extended by 27 mins.',
      inventoryAge: 'Today (Synced)',
      impactSummary: 'Snack order delayed past 52 mins → customer filed fee waiver request → churn risk 83/100.',
    },
  ];

  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const activeScenario = scenarios[selectedScenarioIndex];

  // Dynamic entity lookups
  const activeCust = customers.find(c => c.id === activeScenario.customerId) || customers[0];
  const activeOrd = orders.find(o => o.id === activeScenario.orderId) || orders[0];
  const activeSt = stores.find(s => s.id === activeScenario.storeId) || stores[0];
  const activeProd = products.find(p => p.id === activeScenario.productId) || products[0];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">ROOT CAUSE EXPLORER</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
              Causal Graph
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Map failure chains from physical kirana shelves to customer churn: <span className="text-sky-400 font-medium">Inventory Accuracy → Order Reliability → Retention</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedCustomerId(activeCust.id);
              setActivePage('customer_rescue');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
          >
            <span>Jump to Customer Rescue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Select Root Failure Case Study:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {scenarios.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioIndex(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedScenarioIndex === idx
                  ? 'bg-sky-950/40 border-sky-500/60 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-1">
                Case Study #{idx + 1}
              </div>
              <div className="text-xs font-bold text-white leading-tight">{sc.title}</div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">{sc.problemType}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Causal Graph Pipeline (Section 13) */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Causal Chain Architecture: 8 Diagnostic Nodes</span>
            </h2>
            <p className="text-xs text-slate-400">
              Trace how single store-level operational defects propagate directly to brand churn.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-sky-300 border border-slate-700">
            Order: #{activeOrd.id}
          </span>
        </div>

        {/* Causal Node Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-2 relative">
          {/* Node 1: Customer */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Customer</span>
            <div className="font-bold text-xs text-white truncate">{activeCust.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">{activeCust.city}</div>
            <span className="text-[10px] font-semibold text-indigo-400">{activeCust.totalOrders} Prior Orders</span>
          </div>

          {/* Node 2: Order */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2. Order</span>
            <div className="font-bold text-xs text-white font-mono">#{activeOrd.id}</div>
            <div className="text-[10px] text-slate-400 font-mono">₹{activeOrd.orderValue}</div>
            <span className="text-[10px] font-semibold text-amber-400">{activeOrd.status}</span>
          </div>

          {/* Node 3: Product */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">3. Product</span>
            <div className="font-bold text-xs text-white truncate" title={activeProd.name}>{activeProd.name}</div>
            <div className="text-[10px] text-slate-400">Price: ₹{activeProd.price}</div>
            <span className="text-[10px] font-semibold text-rose-400">Target Item</span>
          </div>

          {/* Node 4: Store */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">4. Store</span>
            <div className="font-bold text-xs text-white truncate" title={activeSt.name}>{activeSt.name}</div>
            <div className="text-[10px] text-slate-400">Health: {activeSt.healthScore}/100</div>
            <span className="text-[10px] font-semibold text-amber-400">{activeSt.orderAcceptanceRate}% Accept</span>
          </div>

          {/* Node 5: Inventory (Upstream Root) */}
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/50 text-center flex flex-col justify-between space-y-2 shadow-lg shadow-rose-950/20">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">5. Inventory</span>
            <div className="font-bold text-xs text-white font-mono">0 In Stock</div>
            <div className="text-[10px] text-rose-300 font-medium">{activeScenario.inventoryAge}</div>
            <span className="text-[10px] font-bold text-rose-400">ROOT CAUSE</span>
          </div>

          {/* Node 6: Delivery */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">6. Delivery</span>
            <div className="font-bold text-xs text-white">ETA {activeOrd.estimatedMinutes}m</div>
            <div className="text-[10px] text-slate-400">Prep Delay: +20m</div>
            <span className="text-[10px] font-semibold text-amber-400">SLA Breached</span>
          </div>

          {/* Node 7: Support */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">7. Support</span>
            <div className="font-bold text-xs text-white font-mono">TKT-9921</div>
            <div className="text-[10px] text-slate-400">Refund ₹{activeOrd.orderValue}</div>
            <span className="text-[10px] font-semibold text-sky-400">Dispute Open</span>
          </div>

          {/* Node 8: Retention Risk (Final Consequence) */}
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-center flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">8. Risk</span>
            <div className="font-bold text-sm text-rose-300 font-mono">{activeCust.riskScore}/100</div>
            <div className="text-[10px] text-rose-300 font-bold uppercase">{activeCust.riskLevel} Risk</div>
            <span className="text-[10px] font-semibold text-rose-400">Probable Churn</span>
          </div>
        </div>

        {/* Deep Dive Summary Box */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1">
              Operational Defect Mechanics
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activeScenario.rootCause}
            </p>
          </div>
          <div>
            <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1">
              Downstream Customer Consequence
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activeScenario.impactSummary}
            </p>
          </div>
        </div>
      </div>

      {/* The 5 Key Operational Breakdown Points from Section 4 */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          The 5 Structural Operational Breakdown Channels (Case Telemetry)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-rose-500/30 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">1. Product Unavailable</span>
              <span className="text-xs font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30">
                35% of Cancels
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Stores update stock every 1–3 days. When walk-in shoppers buy fast-moving items, app catalog still shows availability, causing inevitable cancellations after checkout.
            </p>
            <div className="text-[11px] text-indigo-400 pt-1 border-t border-slate-800">
              Fix: 90-sec rapid morning barcode stock audit.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">2. Delivery Delays</span>
              <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                27% of Cancels
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              13% of orders arrive &gt;15 mins late. Slow in-store merchant prep (searching backrooms for missing stock) adds 15–20 minutes before rider even departs.
            </p>
            <div className="text-[11px] text-indigo-400 pt-1 border-t border-slate-800">
              Fix: Merchant prep-time countdown alerts.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">3. Store Rejection</span>
              <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                18% of Cancels
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              23% of partner stores reject online orders when physical queues peak between 7:00 PM – 9:00 PM. Stores cannot manage simultaneous counter and phone queues.
            </p>
            <div className="text-[11px] text-indigo-400 pt-1 border-t border-slate-800">
              Fix: Dynamic peak-hour queue auto-throttling.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-sky-500/30 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">4. Partner Unavailable</span>
              <span className="text-xs font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/20 border border-sky-500/30">
                12% of Cancels
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Rider fleet density dips during sudden rain or micro-pocket spikes (e.g. Cyber City Gurgaon, Bandra West), leaving bags waiting at counter.
            </p>
            <div className="text-[11px] text-indigo-400 pt-1 border-t border-slate-800">
              Fix: Predictive weather and neighborhood surge routing.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">5. Other / Mind Change</span>
              <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                8% of Cancels
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Customer duplicate orders or mind changes before dispatch. Normal e-commerce baseline noise.
            </p>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              Status: Within acceptable operational margins.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-300">The Solution Nexus</div>
              <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                By solving <strong>Inventory Freshness</strong> (35%) and <strong>Store Throttling</strong> (18%), NOVA CART eliminates 53% of cancellations without adding a single extra delivery rider.
              </p>
            </div>
            <button
              onClick={() => setActivePage('store_intelligence')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-2"
            >
              <span>Explore Store Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
