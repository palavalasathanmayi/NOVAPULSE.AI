import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SimulationInputs } from '../types';
import { runScenarioSimulation, BASELINE_SCENARIO } from '../services/scenarioEngine';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const ScenarioSimulator: React.FC = () => {
  const { setIsBusinessImpactModalOpen } = useApp();

  const [inputs, setInputs] = useState<SimulationInputs>(BASELINE_SCENARIO);

  const results = useMemo(() => {
    return runScenarioSimulation(inputs);
  }, [inputs]);

  const handleReset = () => {
    setInputs(BASELINE_SCENARIO);
  };

  const applyTargetPilotPreset = () => {
    setInputs({
      promotionalSpendLakhs: 12.0,
      averageDeliveryMinutes: 29,
      cancellationRatePercent: 6.5,
      inventoryAccuracyPercent: 92.0,
      repeatPurchaseRatePercent: 27.0, // model will project to ~36%
    });
  };

  const applyAggressivePromoPreset = () => {
    setInputs({
      promotionalSpendLakhs: 22.1, // 30% increase on ₹17L as considered by management
      averageDeliveryMinutes: 37,
      cancellationRatePercent: 11.0,
      inventoryAccuracyPercent: 70.0,
      repeatPurchaseRatePercent: 27.0,
    });
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">SCENARIO SIMULATOR</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Interactive "What If?" Engine
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Model the business impact of shifting capital from ineffective promotional vouchers into operational fulfillment reliability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={applyTargetPilotPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Pilot Target Preset</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer Callout (Section 17 Constraint) */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-200">Mandatory Modeling Notice:</strong> Labelled as a <span className="text-indigo-300 font-semibold">"Prototype scenario estimate"</span> and <span className="text-indigo-300 font-semibold">"Illustrative decision-support model"</span>. These projections demonstrate elasticity mechanisms and operational tradeoffs rather than guaranteed financial forecasts.
        </div>
      </div>

      {/* Main Grid: Input Sliders & Projected Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Input Sliders (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Operational Levers</span>
            </h2>
            <span className="text-[11px] text-slate-500">Live Adjustment</span>
          </div>

          {/* Slider 1: Average Delivery Time */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Average Delivery Time</span>
              </span>
              <span className="font-mono font-bold text-sky-400">
                {inputs.averageDeliveryMinutes} min
                <span className="text-slate-500 text-[10px] ml-1">(Baseline: 37m)</span>
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={45}
              step={1}
              value={inputs.averageDeliveryMinutes}
              onChange={e => setInputs({ ...inputs, averageDeliveryMinutes: parseInt(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20 min (Elite SLA)</span>
              <span>37 min (Current)</span>
              <span>45 min (Severe Delay)</span>
            </div>
          </div>

          {/* Slider 2: Order Cancellation Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Cancellation Rate</span>
              </span>
              <span className="font-mono font-bold text-rose-400">
                {inputs.cancellationRatePercent}%
                <span className="text-slate-500 text-[10px] ml-1">(Baseline: 11%)</span>
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={16}
              step={0.5}
              value={inputs.cancellationRatePercent}
              onChange={e => setInputs({ ...inputs, cancellationRatePercent: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>4% (Benchmark)</span>
              <span>11% (Current)</span>
              <span>16% (Crisis)</span>
            </div>
          </div>

          {/* Slider 3: Inventory Accuracy */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Partner Inventory Accuracy</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {inputs.inventoryAccuracyPercent}%
                <span className="text-slate-500 text-[10px] ml-1">(Baseline: 70%)</span>
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={98}
              step={1}
              value={inputs.inventoryAccuracyPercent}
              onChange={e => setInputs({ ...inputs, inventoryAccuracyPercent: parseInt(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>60% (Stale)</span>
              <span>70% (Current)</span>
              <span>98% (Live Sync)</span>
            </div>
          </div>

          {/* Slider 4: Monthly Promotional Spend */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Monthly Promotional Spend</span>
              </span>
              <span className="font-mono font-bold text-amber-400">
                ₹{inputs.promotionalSpendLakhs.toFixed(1)}L
                <span className="text-slate-500 text-[10px] ml-1">(Baseline: ₹17L)</span>
              </span>
            </div>
            <input
              type="range"
              min={9.5}
              max={25.0}
              step={0.5}
              value={inputs.promotionalSpendLakhs}
              onChange={e => setInputs({ ...inputs, promotionalSpendLakhs: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>₹9.5L (Historical)</span>
              <span>₹17.0L (Current)</span>
              <span>₹25.0L (Extreme Burn)</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Test Business Strategies:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={applyTargetPilotPreset}
                className="p-2 rounded-lg bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-left transition-colors"
              >
                <div className="text-xs font-bold text-emerald-300">Target Pilot Fix</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Reliability + Lower Promo</div>
              </button>
              <button
                onClick={applyAggressivePromoPreset}
                className="p-2 rounded-lg bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/30 text-left transition-colors"
              >
                <div className="text-xs font-bold text-rose-300">Management +30% Push</div>
                <div className="text-[10px] text-slate-400 mt-0.5">₹22.1L Burn (Leaking Bucket)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Projected Outcomes & Impact Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Comparison Cards: Current vs Scenario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Projected Repeat Rate */}
            <div className="p-4 rounded-xl border border-indigo-500/40 bg-slate-900/80 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Projected Repeat Purchase</span>
                <span className="font-mono text-[11px]">Current: 27.0%</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-white font-mono">
                  {results.projectedRepeatRate}%
                </span>
                <span
                  className={`text-xs font-bold flex items-center gap-1 ${
                    results.projectedRepeatRate >= 27.0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {results.projectedRepeatRate >= 27.0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{results.projectedRepeatRate >= 27.0 ? `+${(results.projectedRepeatRate - 27.0).toFixed(1)}%` : `${(results.projectedRepeatRate - 27.0).toFixed(1)}%`}</span>
                </span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                Estimated retention lift across ~{results.customerRetentionGain.toLocaleString()} monthly active buyers.
              </div>
            </div>

            {/* Projected Net Unit Margin */}
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-slate-900/80 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Projected Net Monthly Margin</span>
                <span className="font-mono text-[11px]">Current: ~₹2.0L</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-emerald-400 font-mono">
                  ₹{results.projectedNetMarginLakhs}L
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {results.projectedNetMarginLakhs >= 2.02 ? `+₹${(results.projectedNetMarginLakhs - 2.02).toFixed(2)}L` : `-₹${(2.02 - results.projectedNetMarginLakhs).toFixed(2)}L`}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                Net of operational promo subsidies and customer support handling costs.
              </div>
            </div>

            {/* Projected Monthly Orders */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Monthly Completed Orders</span>
                <span className="font-mono text-[11px]">Current: 38,500</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {results.projectedOrders.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                Gross GMV expands to ~₹{((results.projectedOrders * 486) / 100000).toFixed(1)} Lakhs based on ₹486 AOV.
              </div>
            </div>

            {/* Payback on ₹25 Lakh Constraint */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Payback on ₹25L Pilot</span>
                <span className="font-mono text-[11px]">Target: &lt;6 Mo</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                ~{results.sixMonthPaybackOn25L} Months
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                Derived from saved refund friction and redeployed marketing capital.
              </div>
            </div>
          </div>

          {/* Qualitative Implications: Operational, Customer, Business (Section 17) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Strategic Implication Matrix
            </h3>

            {/* Operational Implications */}
            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-sky-400 text-[11px] uppercase tracking-wider">
                1. Operational Implications
              </div>
              {results.operationalImplications.map((imp, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </div>
              ))}
            </div>

            {/* Customer Implications */}
            <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800">
              <div className="font-semibold text-indigo-400 text-[11px] uppercase tracking-wider">
                2. Customer & Retention Implications
              </div>
              {results.customerImplications.map((imp, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </div>
              ))}
            </div>

            {/* Business Implications */}
            <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800">
              <div className="font-semibold text-emerald-400 text-[11px] uppercase tracking-wider">
                3. Financial & Boardroom Implications
              </div>
              {results.businessImplications.map((imp, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick link to Roadmap */}
          <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-white">Ready to examine the full execution roadmap?</div>
              <div className="text-[11px] text-slate-400">Review 4 phases, deliverables, and pilot measurement methodology.</div>
            </div>
            <button
              onClick={() => setIsBusinessImpactModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-1"
            >
              <span>View Budget Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
