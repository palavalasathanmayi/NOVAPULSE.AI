import { Customer, Store, RiskAnalysis, StoreActionPlan } from '../types';
import { calculateCustomerRisk } from './riskEngine';
import { generateStoreActionPlan } from './storeIntelligence';

export interface AiResponse<T> {
  data: T;
  isAiGenerated: boolean;
  modelUsed?: string;
  latencyMs: number;
}

/**
 * AI Service Abstraction Layer
 * Seamlessly leverages server-side / client-side AI when available,
 * with zero-latency deterministic business logic fallbacks.
 */
export async function analyzeCustomerAi(customer: Customer): Promise<AiResponse<RiskAnalysis>> {
  const startTime = Date.now();
  const fallback = calculateCustomerRisk(customer);

  try {
    const res = await fetch('/api/ai/analyze-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        return {
          data: {
            ...fallback,
            ...json.data,
            score: json.data.score ?? fallback.score,
            level: json.data.level ?? fallback.level,
            topDrivers: json.data.topDrivers ?? fallback.topDrivers,
            evidence: json.data.evidence ?? fallback.evidence,
            recommendedActions: json.data.recommendedActions ?? fallback.recommendedActions,
            whyRecommended: json.data.whyRecommended ?? fallback.whyRecommended,
          },
          isAiGenerated: true,
          modelUsed: json.modelUsed || 'Gemini 2.5 Flash',
          latencyMs: Date.now() - startTime,
        };
      }
    }
  } catch {
    // Graceful offline fallback
  }

  // Deterministic rule-based fallback
  return {
    data: fallback,
    isAiGenerated: false,
    modelUsed: 'Deterministic Rule Engine (Fallback)',
    latencyMs: Date.now() - startTime,
  };
}

export async function generateStorePlanAi(store: Store): Promise<AiResponse<StoreActionPlan>> {
  const startTime = Date.now();
  const fallback = generateStoreActionPlan(store);

  try {
    const res = await fetch('/api/ai/generate-store-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ store }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        return {
          data: {
            ...fallback,
            ...json.data,
            actions: json.data.actions ?? fallback.actions,
            partnerSupportOffering: json.data.partnerSupportOffering ?? fallback.partnerSupportOffering,
          },
          isAiGenerated: true,
          modelUsed: json.modelUsed || 'Gemini 2.5 Flash',
          latencyMs: Date.now() - startTime,
        };
      }
    }
  } catch {
    // Graceful fallback
  }

  return {
    data: fallback,
    isAiGenerated: false,
    modelUsed: 'Deterministic Merchant Support Engine',
    latencyMs: Date.now() - startTime,
  };
}

export async function askExecutiveAi(question: string, contextPrompt?: string): Promise<{ answer: string; isAi: boolean; sources: string[] }> {
  try {
    const res = await fetch('/api/ai/ask-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context: contextPrompt }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.answer) {
        return {
          answer: json.answer,
          isAi: true,
          sources: json.sources || ['NOVA CART Live Case Data', 'Operational Telemetry'],
        };
      }
    }
  } catch {
    // Fallback
  }

  // High-fidelity business reasoning fallback tailored to the 7 core challenge questions
  const q = question.toLowerCase();
  let answer = '';
  const sources = ['NOVA CART Verified Case Data', 'Customer Survey Data (N=4,200)', 'Merchant Operations Telemetry'];

  if (q.includes('repeat') || q.includes('retention') || q.includes('why') || q.includes('deteriorat')) {
    answer = `Executive Summary:\nNOVA CART's repeat purchase rate collapsed from 41% to 27% over 6 months because top-of-funnel customer growth (82k → 120k users) masked severe operational strain.\n\nRoot Cause Breakdown:\n1. 11% of all orders are cancelled (up from 6%), with 35% of cancellations caused directly by in-store product stockouts.\n2. Delivery times stretched from 29 to 37 minutes, with 13% arriving >15 minutes late.\n3. Heavy promotional spend (₹9.5L → ₹17L/mo) attracted discount-sensitive one-off shoppers (44% coupons unredeemed, low LTV) while failing to fix the core operational leakage.`;
  } else if (q.includes('inventory') || q.includes('stock') || q.includes('availability')) {
    answer = `Inventory & Availability Impact:\nProduct unavailability is the #1 operational failure point (35% of all cancellations, 29% customer survey complaints).\n\nWhy it happens:\nPartner kirana stores maintain manual inventory logs; some update every 2-3 days while fulfilling busy in-store walk-in queues. Stale digital stock leads directly to phantom orders, 20+ minute prep delays, and forced cancellations.\n\nActionable Fix:\nDeploy 90-second rapid barcode stock sync + auto-throttling during 7-9 PM peak walk-in rushes.`;
  } else if (q.includes('store') || q.includes('partner') || q.includes('merchant')) {
    answer = `Merchant Partnership Diagnosis:\nNOVA CART must partner with stores rather than penalize them.\n\nSurvey Evidence:\n• 46% of stores appreciate customer volume\n• 39% struggle with inventory update friction\n• 31% report margin compression from aggressive platform promos\n• 23% reject orders when physical queues peak\n• 18% consider leaving within 12 months\n\nRecommendation:\nDo not penalize merchants for busy periods. Provide dynamic queue auto-throttling and 48-hour predictive staple demand forecasts.`;
  } else if (q.includes('budget') || q.includes('25') || q.includes('roi') || q.includes('cost')) {
    answer = `₹25 Lakh Pilot Budget Allocation (6 Months):\n• Phase 1: Rapid Inventory Barcode Sync (₹7.5 Lakhs)\n• Phase 2: Operations Dispatch & Throttle Engine (₹6.5 Lakhs)\n• Phase 3: Proactive Customer Rescue Triage (₹5.5 Lakhs)\n• Phase 4: Merchant Retention & Staff Training (₹5.5 Lakhs)\n\nFinancial Return:\nBy curbing cancellations from 11% to 7% and trimming delivery to 30 mins, repeat purchase recovers to ~34%, yielding ₹3.8L/mo in net margin recovery and paying back the ₹25L pilot within 6.5 months.`;
  } else {
    answer = `NOVA CART Operational Diagnosis:\nTopline order growth (+23.4%) and user growth (+46.3%) are concealing severe operational degradation. Repeat purchase has plummeted to 27%, cancellations doubled to 11%, and monthly support tickets surged to 5,900. By shifting capital from wasteful discount vouchers into store inventory accuracy and dispatch reliability, NOVA CART can restore customer retention and achieve profitable unit economics.`;
  }

  return { answer, isAi: false, sources };
}
