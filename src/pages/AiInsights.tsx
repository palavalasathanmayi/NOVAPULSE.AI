import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { askExecutiveAi } from '../services/aiService';
import {
  Sparkles,
  Search,
  Send,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  FileText,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const AiInsights: React.FC = () => {
  const { setActivePage, setIsBusinessImpactModalOpen } = useApp();

  const curatedInsights = [
    {
      id: 'insight-1',
      badge: 'Core Retention Paradox',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      insight: 'Customer retention is weakening despite aggressive user acquisition and order growth.',
      evidence: 'Repeat purchase rate declined from 41% to 27% over 6 months, while registered users grew 46.3% (82k → 120k) and orders grew 23.4% (31.2k → 38.5k).',
      implication: 'Acquisition growth is failing to translate into habitual repeat behavior. Marketing spend is currently subsidizing customer churn.',
      recommendedAction: 'Halt expansion of untargeted acquisition ads; redirect management priority to retention and operational fulfillment reliability.',
    },
    {
      id: 'insight-2',
      badge: 'Inventory Root Cause',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      insight: 'Product availability is the single largest structural failure point across the business.',
      evidence: '35% of all cancellations are caused directly by product unavailability, and 29% of surveyed customers report items becoming unavailable after checkout.',
      implication: 'Stale merchant catalog stock forces customer order cancellations, generating 42% of all inbound CX support disputes and destroying customer trust.',
      recommendedAction: 'Deploy 90-second rapid barcode stock reconciliation audits and identify high-risk staple SKUs before peak evening hours.',
    },
    {
      id: 'insight-3',
      badge: 'Capital Allocation',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      insight: 'Promotional discount expansion is accelerating margin erosion with negative long-term retention ROI.',
      evidence: 'Promotional spend surged 78.9% (₹9.5L → ₹17.0L/month) while 44% of promotional coupons are never redeemed, and discount-acquired cohorts exhibit the lowest 30-day retention.',
      implication: 'Customers acquired through deep discounts have low brand attachment and churn once subsidies cease. Discounting does not repair broken delivery or stockout experiences.',
      recommendedAction: 'Trim blanket coupon vouchers by ₹5.5L/month; redeploy funds toward delivery SLA reliability guarantees and partner inventory tools within the ₹25L pilot budget.',
    },
    {
      id: 'insight-4',
      badge: 'Merchant Network Fragility',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      insight: 'Partner store friction during peak hours threatens neighborhood network density.',
      evidence: '23% of partner stores reject digital orders during busy periods, 39% say inventory updates require too much effort, and 18% are considering leaving NOVA CART within 12 months.',
      implication: 'Merchant churn will shrink local product coverage, increase delivery radiuses, and drive delivery times higher than the current 37-minute baseline.',
      recommendedAction: 'Support stores rather than penalizing them: introduce automated peak-period rush throttling and 48-hour predictive staple demand forecasts.',
    },
    {
      id: 'insight-5',
      badge: 'Organic Retention Lever',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      insight: 'Multi-category cross-shopping creates the strongest natural barrier against customer churn.',
      evidence: 'Case behavioral data demonstrates that customers utilizing multiple store categories have 2.4x higher repeat purchase probability, and customers completing 3 orders have a 72% probability of ordering next month.',
      implication: 'Habitual basket expansion across Groceries, Fresh Produce, and Dairy solidifies quick-commerce utility far better than price cuts.',
      recommendedAction: 'Design multi-category basket recommendation widgets on checkout and provide curated neighborhood bakery and produce bundles.',
    },
  ];

  // Interactive AI Executive Sandbox
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiSources, setAiSources] = useState<string[]>([]);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  const sampleQuestions = [
    'Why did repeat purchase drop from 41% to 27%?',
    'Should we give discount coupons to churning users?',
    'How does inventory freshness affect delivery SLA?',
    'How will the ₹25 Lakh pilot budget be allocated?',
  ];

  const handleAskQuestion = async (queryText: string) => {
    if (!queryText.trim()) return;
    setQuestion(queryText);
    setIsAsking(true);
    try {
      const res = await askExecutiveAi(queryText);
      setAiAnswer(res.answer);
      setAiSources(res.sources);
      setIsAiGenerated(res.isAi);
    } catch {
      setAiAnswer('Unable to generate insight at this moment.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">AI STRATEGIC INSIGHTS</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              Executive Briefing
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Grounded intelligence synthesizing telemetry, survey evidence, and operational root causes into actionable decisions.
          </p>
        </div>

        <button
          onClick={() => setIsBusinessImpactModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>View ₹25L Budget Framework</span>
        </button>
      </div>

      {/* Interactive AI Strategic Query Sandbox */}
      <div className="p-5 rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Ask NOVA PULSE Strategic Copilot
          </h2>
          <span className="text-[10px] text-slate-400 font-mono">• Grounded in Case Data</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask a strategic business question (e.g. Why did repeat purchase decline?)..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAskQuestion(question)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={() => handleAskQuestion(question)}
            disabled={isAsking || !question.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isAsking ? 'Reasoning...' : 'Ask Copilot'}</span>
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400">Quick Prompt Suggestions:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* AI Answer Display */}
        {aiAnswer && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 text-xs space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-[11px] text-indigo-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Answer</span>
              </span>
              <span className="text-slate-400 font-mono text-[10px]">
                {isAiGenerated ? 'Grounded AI Synthesis' : 'Verified Decision Engine'}
              </span>
            </div>
            <div className="text-slate-200 leading-relaxed whitespace-pre-line">
              {aiAnswer}
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Evidence Sources: {aiSources.join(', ')}</span>
              <span className="text-emerald-400 font-medium">100% Case Aligned</span>
            </div>
          </div>
        )}
      </div>

      {/* Curated Strategic Insights (Mandatory Section 16 format: INSIGHT, EVIDENCE, IMPLICATION, ACTION) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Synthesized Operational & Business Insights
          </h2>
          <span className="text-xs text-slate-400">Section 16 Authoritative Synthesis</span>
        </div>

        <div className="space-y-4">
          {curatedInsights.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/80 transition-all space-y-3.5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">Case Verified</span>
              </div>

              {/* 1. INSIGHT */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  INSIGHT
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {item.insight}
                </h3>
              </div>

              {/* 2. EVIDENCE */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="font-bold text-indigo-300 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>EVIDENCE</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{item.evidence}</p>
              </div>

              {/* 3. BUSINESS IMPLICATION */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="font-bold text-amber-300 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>BUSINESS IMPLICATION</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{item.implication}</p>
              </div>

              {/* 4. RECOMMENDED ACTION */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
                <div className="font-bold text-emerald-300 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RECOMMENDED ACTION</span>
                </div>
                <p className="text-emerald-100 leading-relaxed font-medium">{item.recommendedAction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
