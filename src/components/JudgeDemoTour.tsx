import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ChevronRight, ChevronLeft, X, ArrowUpRight, Play, CheckCircle } from 'lucide-react';

export const JudgeDemoTour: React.FC = () => {
  const { tourStep, nextTourStep, prevTourStep, endJudgeTour } = useApp();

  if (tourStep === null) return null;

  const tourStepsData = [
    {
      step: 1,
      page: 'Command Center',
      title: '1. The Growth Paradox — Deteriorating Retention',
      talkTrack: '“NOVA CART is growing, but the quality of growth is deteriorating.”',
      focusPoints: [
        'Repeat Purchase collapsed: 41% → 27% (Critical)',
        'Delivery Time stretched: 29 → 37 minutes',
        'Order Cancellations doubled: 6% → 11%',
        'Monthly Support Tickets spiked: 3,100 → 5,900',
        'Topline order growth (+23%) is masking severe operational breakdown.',
      ],
      actionPrompt: 'Click "Next Step" to trace where this breakdown begins in the supply chain.',
    },
    {
      step: 2,
      page: 'Root Cause Explorer',
      title: '2. Causal Chain Analysis',
      talkTrack: '“Inventory inaccuracy triggers late prep, store rejection, delivery delays, and churn.”',
      focusPoints: [
        '35% of all cancellations are caused by Product Unavailability in store',
        '27% caused by Delivery Delays exceeding quick-commerce tolerances',
        '18% caused by Store Busy-Period Order Rejections',
        'Trace the live causal chain: Customer → Order → Product → Store → Stale Inventory → Retention Risk.',
      ],
      actionPrompt: 'Click "Next Step" to inspect an individual high-risk customer profile.',
    },
    {
      step: 3,
      page: 'Customer Rescue',
      title: '3. Customer Risk Analysis — Priya Sharma',
      talkTrack: '“Transparent rule-based risk score: 82/100 with targeted Reliability Recovery.”',
      focusPoints: [
        'Notice Priya Sharma: 82/100 Risk Score (High Risk)',
        'Click "Analyze Customer" or review the Top 3 Drivers: Inactivity, Delivery Delays, Unavailable Stock',
        'Notice AI Recommendation: "Reliability Recovery" with SLA guarantees',
        'Important: Discounts are withheld! Large first-order discounts do not produce long-term retention.',
      ],
      actionPrompt: 'Click "Next Step" to investigate the root store where Priya\'s order failed.',
    },
    {
      step: 4,
      page: 'Store Intelligence',
      title: '4. Partner Store Intelligence — Local Mart Indiranagar',
      talkTrack: '“Help stores instead of simply blaming them!”',
      focusPoints: [
        'Local Mart Indiranagar Health Score: 61/100',
        'Inventory last updated 2 days ago; 28% peak-hour rush rejection rate',
        'Click "Generate Action Plan" to produce the 4-point operational support roadmap',
        'Click "Mark Actioned" to see rapid-sync inventory adopted and health score improve (+12 pts).',
      ],
      actionPrompt: 'Click "Next Step" to resolve the pending disrupted order in Operations.',
    },
    {
      step: 5,
      page: 'Operations Command Center',
      title: '5. Real-Time Operations — Resolving Order #NC10482',
      talkTrack: '“Close the loop: resolve at-risk orders in real time to prevent churn.”',
      focusPoints: [
        'Find Order #NC10482 (Priya Sharma at Local Mart Indiranagar, ₹684)',
        'Status: Delayed / Stale Inventory mismatch',
        'Click "Resolve" or "Escalate" on the drawer or table',
        'Observe live state change to "Resolved", ticket closed, and toast notification.',
      ],
      actionPrompt: 'Click "Next Step" to simulate the business impact of shifting budget into reliability.',
    },
    {
      step: 6,
      page: 'Scenario Simulator',
      title: '6. Strategic Scenario Simulator — "What If?"',
      talkTrack: '“What happens if we improve reliability instead of simply increasing promotions?”',
      focusPoints: [
        'Adjust Delivery Time: 37 → 30 min',
        'Adjust Cancellation Rate: 11% → 7%',
        'Adjust Inventory Accuracy: 70% → 90%',
        'Trim Promo Spend from ₹17L to ₹13L/mo',
        'Watch Repeat Purchase recover to ~34% and net margins turn strongly positive, paying back the ₹25L pilot.',
      ],
      actionPrompt: 'Click "Next Step" to examine the comprehensive Business Impact & Pilot Budget framework.',
    },
    {
      step: 7,
      page: 'Business Impact & Budget Framework',
      title: '7. Pilot KPI Measurement & ₹25 Lakh Constraint',
      talkTrack: '“Grounded in verifiable pilot mechanisms, not fabricated achieved claims.”',
      focusPoints: [
        'Track all 8 KPIs: Baseline vs Target vs Measurement Mechanism',
        'Strict ₹25 Lakh 6-month budget breakdown across 4 implementation phases',
        'Clear payback period of ~6.5 months driven by avoided cancellations and customer recovery.',
      ],
      actionPrompt: 'Demo complete! Click "Finish Tour" to freely navigate NOVA PULSE.',
    },
  ];

  const current = tourStepsData[tourStep - 1];

  return (
    <div className="fixed top-18 right-6 z-40 max-w-lg w-full bg-slate-900/95 border-2 border-indigo-500/50 shadow-2xl rounded-2xl p-5 backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs border border-indigo-500/40">
            {tourStep}/7
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Judge Demonstration Tour
            </span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{current.page}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>
        <button
          onClick={endJudgeTour}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          title="Exit Tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Script & Talk Track */}
      <div className="mt-3">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
          Judge Pitch Talk-Track
        </div>
        <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs italic font-medium leading-relaxed">
          {current.talkTrack}
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="text-xs font-medium text-slate-300">Key Evidence to Highlight:</div>
          <ul className="text-xs text-slate-300 space-y-1 pl-1">
            {current.focusPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-400 font-bold shrink-0">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 p-2 rounded bg-slate-800/80 text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>{current.actionPrompt}</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
        <button
          onClick={prevTourStep}
          disabled={tourStep === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Previous
        </button>

        <div className="flex gap-1">
          {tourStepsData.map(s => (
            <div
              key={s.step}
              className={`w-2 h-2 rounded-full transition-all ${
                s.step === tourStep ? 'bg-indigo-400 scale-125' : s.step < tourStep ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextTourStep}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
        >
          {tourStep === 7 ? (
            <>
              <CheckCircle className="w-3.5 h-3.5" /> Finish Tour
            </>
          ) : (
            <>
              Next Step <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
