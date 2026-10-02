import { Customer, RiskAnalysis, RiskLevel } from '../types';

/**
 * Prototype Rule-Based Risk Engine
 * Formulated with transparent, auditable business logic:
 *   30% Recent Inactivity
 *   25% Order Cancellation History
 *   20% Delivery Problems / Delays
 *   15% Unavailable Product Encounters
 *   10% Support & Refund Issues
 */
export function calculateCustomerRisk(customer: Customer, referenceDateStr: string = '2026-10-01'): RiskAnalysis {
  const refDate = new Date(referenceDateStr).getTime();
  const lastOrderTime = new Date(customer.lastOrderDate).getTime();
  const daysSinceLastOrder = Math.max(0, Math.floor((refDate - lastOrderTime) / (1000 * 60 * 60 * 24)));

  // 1. Inactivity Factor (30% weight):
  // 0-7 days = low (0-20), 8-14 days = med (20-60), >14 days = high (60-100)
  let inactivityRaw = 0;
  if (daysSinceLastOrder > 30) {
    inactivityRaw = 100;
  } else if (daysSinceLastOrder > 14) {
    inactivityRaw = 75 + ((daysSinceLastOrder - 14) / 16) * 25;
  } else if (daysSinceLastOrder > 7) {
    inactivityRaw = 40 + ((daysSinceLastOrder - 7) / 7) * 35;
  } else {
    inactivityRaw = (daysSinceLastOrder / 7) * 40;
  }

  // 2. Cancellation History Factor (25% weight):
  // Cancellation rate on customer's total orders
  const cancellationRatio = customer.totalOrders > 0 ? (customer.cancelledOrdersCount / customer.totalOrders) : 0;
  const cancellationRaw = Math.min(100, Math.round(cancellationRatio * 180 + (customer.cancelledOrdersCount >= 1 ? 40 : 0)));

  // 3. Delivery Problems Factor (20% weight):
  const deliveryProblemRatio = customer.totalOrders > 0 ? (customer.deliveryDelayedOrdersCount / customer.totalOrders) : 0;
  const deliveryRaw = Math.min(100, Math.round(deliveryProblemRatio * 140 + (customer.deliveryDelayedOrdersCount > 0 ? 30 : 0)));

  // 4. Unavailable Products Factor (15% weight):
  const unavailableOrders = customer.unavailableProductOrdersCount || 0;
  const unavailableSearches = customer.searchesForUnavailableCount || 0;
  const unavailableScore = Math.min(100, unavailableOrders * 35 + unavailableSearches * 12);

  // 5. Support & Refund Issues Factor (10% weight):
  const supportTickets = customer.supportTicketsCount || 0;
  const refunds = customer.refundsCount || 0;
  const supportRaw = Math.min(100, supportTickets * 40 + refunds * 30);

  // Weighted Combination
  const weightedScore = (
    inactivityRaw * 0.30 +
    cancellationRaw * 0.25 +
    deliveryRaw * 0.20 +
    unavailableScore * 0.15 +
    supportRaw * 0.10
  );

  const score = Math.round(Math.min(100, Math.max(0, weightedScore)));

  let level: RiskLevel = 'Low';
  if (score >= 70) {
    level = 'High';
  } else if (score >= 40) {
    level = 'Medium';
  } else {
    level = 'Low';
  }

  // Extract Factor Rankings to identify top 3 drivers
  const factors = [
    {
      name: 'Recent Inactivity',
      score: Math.round(inactivityRaw),
      weightedContribution: inactivityRaw * 0.30,
      evidence: `${daysSinceLastOrder} days since last order (${customer.lastOrderDate})`,
    },
    {
      name: 'Order Cancellation History',
      score: Math.round(cancellationRaw),
      weightedContribution: cancellationRaw * 0.25,
      evidence: `${customer.cancelledOrdersCount || 0} cancelled order(s) out of ${customer.totalOrders || 0} total orders (${Math.round(cancellationRatio * 100)}% failure)`,
    },
    {
      name: 'Delivery Delay Encounters',
      score: Math.round(deliveryRaw),
      weightedContribution: deliveryRaw * 0.20,
      evidence: `${customer.deliveryDelayedOrdersCount || 0} delivery delay incident(s) exceeding promised ETA`,
    },
    {
      name: 'Product Availability Issues',
      score: Math.round(unavailableScore),
      weightedContribution: unavailableScore * 0.15,
      evidence: `${unavailableOrders} stockout event(s) and ${unavailableSearches} phantom out-of-stock searches`,
    },
    {
      name: 'Support & Refund Friction',
      score: Math.round(supportRaw),
      weightedContribution: supportRaw * 0.10,
      evidence: `${supportTickets} opened support ticket(s) and ${refunds} refund claim(s)`,
    },
  ];

  // Sort by weighted contribution descending
  factors.sort((a, b) => b.weightedContribution - a.weightedContribution);

  const topDrivers = factors.slice(0, 3).map(f => f.name);
  const evidence = factors.slice(0, 3).map(f => `${f.name}: ${f.evidence}`);

  // Recommendation Logic
  let recommendationType: RiskAnalysis['recommendationType'] = 'Reliability Recovery';
  let recommendedActions: string[] = [];
  let whyRecommended = '';
  let discountJustified = false;
  let discountRationale = '';

  const acquiredViaDiscount = customer.acquisitionChannel === 'Discount Coupon' || (customer.firstOrderDiscountPercent || 0) >= 35;

  if (unavailableScore >= 60 || factors[0].name === 'Product Availability Issues') {
    recommendationType = 'Availability Recovery';
    recommendedActions = [
      'Proactively notify customer of refreshed stock for frequently queried staple items',
      'Route next order exclusively to verified high-accuracy stores with recent inventory updates',
      'Provide 1-click basket restore with alternative brand parity matching',
      'Prioritize fulfillment dispatch without substitutions',
    ];
    whyRecommended = 'Customer churn is primarily driven by catalog stockouts and phantom inventory listings. Offering a discount coupon would not solve underlying product availability and would exacerbate margin erosion.';
    discountJustified = false;
    discountRationale = 'Discounts are withheld: case data indicates that coupon seekers have higher churn, and customer issue is strictly operational availability.';
  } else if (deliveryRaw >= 50 || factors[0].name === 'Delivery Delay Encounters' || (customer.deliveryDelayedOrdersCount || 0) >= 2) {
    recommendationType = 'Reliability Recovery';
    recommendedActions = [
      'Send personalized CX outreach acknowledging recent delivery friction and explaining route optimizations',
      'Assign dedicated priority rider routing on next checkout to guarantee ETA accuracy',
      'Offer real-time GPS tracking guarantee with automatic instant SLA credit if delay exceeds 10 mins',
      'Resolve any pending support ticket within 2 hours',
    ];
    whyRecommended = 'Customer had multiple orders delivered significantly past estimated window. Re-establishing trust in delivery punctuality is 3.2x more effective than promotional markdowns.';
    discountJustified = (customer.refundsCount || 0) > 0 && !acquiredViaDiscount;
    discountRationale = discountJustified
      ? 'A minor ₹50 service assurance credit is approved exclusively to settle open refund friction for an organically acquired customer.'
      : 'No coupon: repeated discounts train users to wait for subsidies without fixing SLA confidence.';
  } else if (cancellationRaw >= 60) {
    recommendationType = 'Store Capacity Intervention';
    recommendedActions = [
      'Flag customer profile for VIP auto-failover to secondary dark-store or partner if primary store rejects',
      'Proactive WhatsApp apology with guaranteed basket availability for evening essentials',
      'Expedite pending refund reversal directly to bank account within 30 minutes',
    ];
    whyRecommended = 'Cancellations destroy customer trust faster than any other friction point. Immediate operational assurance is required.';
    discountJustified = false;
    discountRationale = 'Preserve margins: resolve the cancellation trauma via prompt human touch and instant refund rather than price cuts.';
  } else if ((customer.categoriesUsed?.length || 0) === 1 && customer.totalOrders >= 2) {
    recommendationType = 'Category Diversification';
    recommendedActions = [
      'Recommend high-velocity complementary categories (e.g. Fresh Dairy & Bakery alongside Staples)',
      'Highlight top-rated local neighborhood bakeries and organic produce partners within 2km',
      'Curate multi-category discovery carousel on homepage',
    ];
    whyRecommended = 'Case evidence demonstrates that customers using multiple store categories have 2.4x higher repeat purchase probability. Cross-category adoption acts as a natural churn barrier.';
    discountJustified = false;
    discountRationale = 'Organic discovery nudges are sufficient without subsidizing margins.';
  } else {
    recommendationType = 'Service Assurance';
    recommendedActions = [
      'Maintain standard high-reliability dispatch',
      'Provide curated seasonal assortment updates',
      'Monitor store fulfillment accuracy scores',
    ];
    whyRecommended = 'Customer exhibits healthy repeat behavior. Continuous operational vigilance protects repeat frequency.';
    discountJustified = false;
    discountRationale = 'Customer is satisfied and loyal; promotional discounts are unnecessary and wasteful.';
  }

  return {
    customerId: customer.id,
    customerName: customer.name,
    score,
    level,
    factorBreakdown: {
      inactivityScore: Math.round(inactivityRaw),
      cancellationScore: Math.round(cancellationRaw),
      deliveryScore: Math.round(deliveryRaw),
      availabilityScore: Math.round(unavailableScore),
      supportScore: Math.round(supportRaw),
    },
    topDrivers,
    evidence,
    recommendationType,
    recommendedActions,
    whyRecommended,
    discountJustified,
    discountRationale,
  };
}

/**
 * Explains root cause drivers for customer risk
 */
export function explainCustomerRisk(customer: Customer, referenceDateStr: string = '2026-10-01') {
  const analysis = calculateCustomerRisk(customer, referenceDateStr);
  return {
    customerId: customer.id,
    customerName: customer.name,
    score: analysis.score,
    level: analysis.level,
    primaryDriver: analysis.topDrivers[0] || 'Operational Friction',
    topDrivers: analysis.topDrivers,
    evidence: analysis.evidence,
    impactDescription: `${customer.name} exhibits ${analysis.level.toLowerCase()} churn risk with ${analysis.topDrivers.join(', ')}.`,
  };
}

/**
 * Generates tailored operational intervention recommendations (enforcing non-discount philosophy)
 */
export function recommendCustomerIntervention(customer: Customer, referenceDateStr: string = '2026-10-01') {
  const analysis = calculateCustomerRisk(customer, referenceDateStr);
  return {
    customerId: customer.id,
    customerName: customer.name,
    actionType: analysis.recommendationType,
    recommendedActions: analysis.recommendedActions,
    whyRecommended: analysis.whyRecommended,
    discountJustified: analysis.discountJustified,
    discountRationale: analysis.discountRationale,
  };
}

