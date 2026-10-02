import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Target, BarChart3, TrendingUp, ShieldCheck, DollarSign, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export const BusinessImpactModal: React.FC = () => {
  const { isBusinessImpactModalOpen, setIsBusinessImpactModalOpen } = useApp();

  if (!isBusinessImpactModalOpen) return null;

  const kpiFramework = [
    {
      kpi: 'Repeat Purchase Rate',
      current: '27.0%',
      target: '36.0%',
      mechanism: 'Resolving stockout cancellations + achieving sub-30 min SLA rebuilds buyer habituality.',
      measurement: '30-day cohort repeat purchase frequency measured across monthly cohorts.',
      status: 'Primary Retention KPI',
    },
    {
      kpi: 'Order Cancellation Rate',
      current: '11.0%',
      target: '6.5%',
      mechanism: 'Real-time inventory syncing + walk-in rush order throttling at partner stores.',
      measurement: 'Total cancelled orders divided by gross customer orders initiated.',
      status: 'Reliability Gate',
    },
    {
      kpi: 'Average Delivery Time',
      current: '37 min',
      target: '28 min',
      mechanism: 'Immediate merchant prep alerts + automated rider dispatch queuing upon checkout.',
      measurement: 'GPS delta between order placement timestamp and customer drop-off confirmation.',
      status: 'Speed & SLA',
    },
    {
      kpi: 'Partner Inventory Accuracy',
      current: '70.0%',
      target: '92.0%',
      mechanism: '90-second rapid barcode scan checklist conducted daily before peak morning/evening shifts.',
      measurement: 'Physical store cycle audit spot-checks across top 100 fast-moving SKUs.',
      status: 'Upstream Root Cause',
    },
    {
      kpi: 'Store Order Acceptance',
      current: '81.0%',
      target: '94.0%',
      mechanism: 'Auto-throttle online queues during 7-9 PM peak in-store walk-in rushes instead of manual rejections.',
      measurement: 'Merchant terminal acceptance rate within 120-second threshold.',
      status: 'Merchant Trust',
    },
    {
      kpi: 'Monthly Support Tickets',
      current: '5,900 / mo',
      target: '2,400 / mo',
      mechanism: 'Proactive customer notifications + eradication of surprise out-of-stock cancellations.',
      measurement: 'Total inbound CX tickets opened via WhatsApp, phone, and in-app chat.',
      status: 'Customer Happiness',
    },
    {
      kpi: 'Refund Disputes',
      current: '6.0% orders',
      target: '2.2% orders',
      mechanism: 'Pre-approved brand substitution rules + eliminating billed items that are unavailable.',
      measurement: 'Payment gateway UPI/card refund reversal logs.',
      status: 'Margin Leakage',
    },
    {
      kpi: 'Promotion Spend Efficiency',
      current: '₹17.0L / mo (44% unredeemed)',
      target: '₹11.5L / mo',
      mechanism: 'Reallocating wasteful blanket first-order coupons into targeted SLA assurances and merchant tooling.',
      measurement: 'Incremental GMV generated per rupee of promotional expense (ROAS).',
      status: 'Capital Discipline',
    },
    {
      kpi: 'Average Support Resolution Time',
      current: '9.2 Hours',
      target: '< 2.0 Hours',
      mechanism: 'Instant operational order interception, auto-failover dark-store allocation, and 1-click UPI refund credits.',
      measurement: 'Ticket creation timestamp to customer resolution confirmation log.',
      status: 'CX Velocity',
    },
  ];

  const roadmapPhases = [
    {
      phase: 'PHASE 1 (Month 1-2)',
      title: 'Data Integration & Command Center',
      budget: '₹7.5 Lakhs',
      deliverables: [
        'Connect POS and inventory tally feeds across initial 100 pilot stores in Bengaluru.',
        'Deploy NOVA PULSE executive command center with real-time KPI streaming.',
        'Establish automated stockout detection webhooks.',
      ],
      kpiFocus: 'Inventory freshness < 12 hours across pilot footprint.',
    },
    {
      phase: 'PHASE 2 (Month 2-3)',
      title: 'Customer Risk Engine & Root Cause Engine',
      budget: '₹6.5 Lakhs',
      deliverables: [
        'Deploy transparent rule-based risk scoring (30% inactivity, 25% cancel, 20% delay, 15% stockout, 10% support).',
        'Launch root-cause graph linking customer friction directly to merchant inventory timestamp.',
        'Automate targeted Reliability Recovery workflows without blanket discounts.',
      ],
      kpiFocus: 'Early churn identification for customers with 2+ orders.',
    },
    {
      phase: 'PHASE 3 (Month 3-4)',
      title: 'Store Intelligence & Operations Workflows',
      budget: '₹5.5 Lakhs',
      deliverables: [
        'Roll out Merchant Success App with 90-second rapid-sync audit checklist.',
        'Implement busy-period dynamic auto-throttling to eliminate 7-9 PM order rejections.',
        'Provide partner demand forecasting for top 25 high-velocity staple SKUs.',
      ],
      kpiFocus: 'Store acceptance rate > 90%; 0 merchant drop-offs.',
    },
    {
      phase: 'PHASE 4 (Month 5-6)',
      title: 'Full Pilot Rollout & KPI Measurement',
      budget: '₹5.5 Lakhs',
      deliverables: [
        'Expand pilot across 250 high-volume stores in Bengaluru, Mumbai, and Delhi-NCR.',
        'Measure 30-day cohort repeat purchase recovery against unassisted control groups.',
        'Finalize unit-economic audit and executive board governance report.',
      ],
      kpiFocus: 'Repeat purchase recovery toward 36% target.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Business Impact & Measurement Framework</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ₹25 Lakh Constraint
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authoritative measurement mechanisms, baseline vs targets, and 6-month capital allocation.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBusinessImpactModalOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 text-slate-200">
          {/* Note on claims */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-amber-200">
              <strong className="text-amber-100 font-semibold">Governance & Transparency Rule:</strong> NOVA PULSE uses verifiable language such as <em>“Target”</em>, <em>“Pilot KPI”</em>, and <em>“Scenario Estimate”</em>. We do not fabricate achieved improvements prior to completion of pilot validation.
            </div>
          </div>

          {/* Section 1: KPI Framework */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>1. Core Metric Targets & Measurement Framework</span>
              </h3>
              <span className="text-xs text-slate-400">8 Critical Operational Dimensions</span>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4">Current Baseline</th>
                    <th className="py-3 px-4">Pilot Target</th>
                    <th className="py-3 px-4">Operational Mechanism</th>
                    <th className="py-3 px-4">Measurement Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-normal">
                  {kpiFramework.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        <div>{row.kpi}</div>
                        <span className="text-[10px] text-indigo-400 uppercase tracking-wider">{row.status}</span>
                      </td>
                      <td className="py-3 px-4 text-rose-400 font-mono font-medium">{row.current}</td>
                      <td className="py-3 px-4 text-emerald-400 font-mono font-bold">{row.target}</td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs">{row.mechanism}</td>
                      <td className="py-3 px-4 text-slate-400 max-w-xs text-[11px] leading-relaxed">{row.measurement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Implementation Roadmap & Budget */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">2. Six-Month Implementation Roadmap</h3>
              </div>
              <div className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Total Budget: ₹25.0 Lakhs
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmapPhases.map((phase, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{phase.phase}</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{phase.budget}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-white">{phase.title}</h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 pl-1">
                    {phase.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <strong className="text-slate-300">Phase KPI:</strong> {phase.kpiFocus}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Financial ROI & Payback */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Payback & Financial Return on the ₹25 Lakh Capital Constraint
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400">Monthly Sunk Cost Savings</div>
                <div className="text-base font-bold text-white font-mono mt-1">₹2.1 Lakhs/mo</div>
                <div className="text-[10px] text-slate-400 mt-1">From avoided cancellation refunds and customer service ticket hours.</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400">Marketing Reallocation Savings</div>
                <div className="text-base font-bold text-white font-mono mt-1">₹5.5 Lakhs/mo</div>
                <div className="text-[10px] text-slate-400 mt-1">Trimming ineffective broadcast coupon burn from ₹17L to ₹11.5L.</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400">Projected Payback Window</div>
                <div className="text-base font-bold text-emerald-400 font-mono mt-1">~6.5 Months</div>
                <div className="text-[10px] text-slate-400 mt-1">Pilot investment is fully recovered within the six-month roadmap horizon.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            NOVA PULSE • Strategic Executive Framework for PromptWars Challenge
          </div>
          <button
            onClick={() => setIsBusinessImpactModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Framework
          </button>
        </div>
      </div>
    </div>
  );
};
