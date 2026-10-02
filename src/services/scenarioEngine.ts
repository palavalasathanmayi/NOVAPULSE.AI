import { SimulationInputs, SimulationResults } from '../types';

export const BASELINE_SCENARIO: SimulationInputs = {
  promotionalSpendLakhs: 17.0,
  averageDeliveryMinutes: 37,
  cancellationRatePercent: 11.0,
  inventoryAccuracyPercent: 70.0,
  repeatPurchaseRatePercent: 27.0,
};

export function runScenarioSimulation(inputs: SimulationInputs): SimulationResults {
  // Deltas against baseline
  const deltaDelivery = inputs.averageDeliveryMinutes - BASELINE_SCENARIO.averageDeliveryMinutes; // negative is good (faster)
  const deltaCancellation = inputs.cancellationRatePercent - BASELINE_SCENARIO.cancellationRatePercent; // negative is good (fewer cancels)
  const deltaAccuracy = inputs.inventoryAccuracyPercent - BASELINE_SCENARIO.inventoryAccuracyPercent; // positive is good (more accurate)
  const deltaPromo = inputs.promotionalSpendLakhs - BASELINE_SCENARIO.promotionalSpendLakhs;

  // Repeat rate impact calculation:
  // Improving delivery (-1 min) yields approx +0.45% repeat
  // Reducing cancellations (-1%) yields approx +1.1% repeat
  // Increasing inventory accuracy (+1%) yields approx +0.35% repeat
  // Note: promo spend has very low repeat elasticity (+0.08% per Lakh, but high cost)
  const deliveryRepeatEffect = -deltaDelivery * 0.45;
  const cancelRepeatEffect = -deltaCancellation * 1.1;
  const accuracyRepeatEffect = deltaAccuracy * 0.35;
  const promoRepeatEffect = deltaPromo * 0.08;

  const rawProjectedRepeat = BASELINE_SCENARIO.repeatPurchaseRatePercent + deliveryRepeatEffect + cancelRepeatEffect + accuracyRepeatEffect + promoRepeatEffect;
  const projectedRepeatRate = Math.min(55, Math.max(15, parseFloat(rawProjectedRepeat.toFixed(1))));

  // Order volume projection:
  // Base orders: 38,500
  // Higher repeat directly expands order frequency from existing base
  const repeatMultiplier = projectedRepeatRate / BASELINE_SCENARIO.repeatPurchaseRatePercent;
  const cancellationSalvage = (-deltaCancellation / 100) * 38500;
  const projectedOrders = Math.round(38500 * (0.6 + 0.4 * repeatMultiplier) + cancellationSalvage);

  // Revenue projection (AOV approx ₹486)
  const aov = 486;
  const grossGMVLakhs = (projectedOrders * aov) / 100000;
  // Net revenue take rate approx 13.9% (26.1L on 187L GMV)
  const projectedRevenueLakhs = parseFloat((grossGMVLakhs * 0.139).toFixed(2));

  // Support tickets: 5,900 base
  // Cancellations drive 42% of tickets, delivery delay drives 35% of tickets
  const ticketReductionPercent = Math.max(
    -50,
    Math.min(75, (-deltaCancellation * 3.5) + (-deltaDelivery * 2.2) + (deltaAccuracy * 0.8))
  );
  const supportTicketReduction = Math.round(5900 * (ticketReductionPercent / 100));

  // Operational cost savings:
  // Avoided order re-dispatches, customer appeasements, CX agent handling costs
  // Each resolved ticket saves ~₹120; each avoided cancellation saves ~₹180 in sunk delivery and merchant fees
  const ticketSavings = (supportTicketReduction * 120) / 100000;
  const cancelSavings = Math.max(0, (cancellationSalvage * 180) / 100000);
  const promoSavings = -deltaPromo; // saving on promo burn
  const operationalSavingsLakhs = parseFloat((ticketSavings + cancelSavings + (promoSavings > 0 ? promoSavings : 0)).toFixed(2));

  // Net Margin projection:
  // Revenue - Promo Spend - Support Handling Costs
  const currentNetMargin = 26.1 - 17.0 - (5900 * 120 / 100000); // ~2.02 Lakhs
  const projectedNetMarginLakhs = parseFloat(
    (projectedRevenueLakhs - inputs.promotionalSpendLakhs - ((5900 - supportTicketReduction) * 120 / 100000) + cancelSavings).toFixed(2)
  );

  // Payback period for the ₹25 Lakh 6-month budget constraint
  const monthlyIncrementalBenefit = Math.max(0.1, projectedNetMarginLakhs - currentNetMargin + operationalSavingsLakhs);
  const sixMonthPaybackOn25L = parseFloat(Math.min(24, 25.0 / (monthlyIncrementalBenefit * 1.5)).toFixed(1));

  // Customer retention gain
  const customerRetentionGain = Math.round(46000 * ((projectedRepeatRate - BASELINE_SCENARIO.repeatPurchaseRatePercent) / 100) * 0.8);
  const churnReductionPercent = parseFloat(Math.max(0, (projectedRepeatRate - BASELINE_SCENARIO.repeatPurchaseRatePercent) * 1.8).toFixed(1));
  const monthlyPromoEfficiency = parseFloat(((projectedRevenueLakhs / Math.max(1, inputs.promotionalSpendLakhs))).toFixed(2));

  // Qualitative Insights
  const operationalImplications: string[] = [];
  const customerImplications: string[] = [];
  const businessImplications: string[] = [];

  if (inputs.inventoryAccuracyPercent >= 85) {
    operationalImplications.push('High inventory freshness drastically cuts stockout-induced prep cancellations at local partner stores.');
  } else {
    operationalImplications.push('Sub-80% inventory accuracy will continue to generate phantom orders and peak-hour friction.');
  }

  if (inputs.averageDeliveryMinutes <= 30) {
    operationalImplications.push('Sub-30 minute delivery comfortably re-establishes quick-commerce SLA competitiveness.');
    customerImplications.push('Customer trust rebounds: 34% of surveyed customers who cited slow delivery are retained.');
  } else {
    customerImplications.push('Delivery times >35 mins remain a primary churn catalyst regardless of discounts.');
  }

  if (inputs.promotionalSpendLakhs < BASELINE_SCENARIO.promotionalSpendLakhs) {
    businessImplications.push(`Reallocating ₹${(BASELINE_SCENARIO.promotionalSpendLakhs - inputs.promotionalSpendLakhs).toFixed(1)}L/mo from blanket discount codes into partner inventory tooling yields superior unit margins.`);
  } else {
    businessImplications.push('Continuing heavy discount spend subsidizes a leaky bucket without addressing structural SLA flaws.');
  }

  businessImplications.push(`Projected net margin shifts from ₹${currentNetMargin.toFixed(2)}L to ₹${projectedNetMarginLakhs.toFixed(2)}L/month, providing clear payback on the ₹25 Lakh pilot within ~${sixMonthPaybackOn25L} months.`);

  return {
    projectedRepeatRate,
    projectedOrders,
    projectedRevenueLakhs,
    projectedNetMarginLakhs,
    churnReductionPercent,
    supportTicketReduction,
    customerRetentionGain,
    monthlyPromoEfficiency,
    operationalSavingsLakhs,
    sixMonthPaybackOn25L,
    operationalImplications,
    customerImplications,
    businessImplications,
  };
}
