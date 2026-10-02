import { Store, StoreActionPlan } from '../types';

export function calculateStoreHealthScore(store: Store): number {
  // Inventory accuracy (0-100) -> 35% weight
  const invComponent = store.inventoryAccuracy * 0.35;

  // Order acceptance rate (0-100) -> 25% weight
  const acceptanceComponent = store.orderAcceptanceRate * 0.25;

  // Cancellation penalty: inverted (100 - cancellationRate * 4) -> 20% weight
  const cancellationHealthy = Math.max(0, 100 - store.cancellationRate * 4);
  const cancelComponent = cancellationHealthy * 0.20;

  // Substitution penalty: inverted (100 - substitutionRate * 5) -> 10% weight
  const substitutionHealthy = Math.max(0, 100 - store.substitutionRate * 5);
  const subComponent = substitutionHealthy * 0.10;

  // Update freshness bonus -> 10% weight
  let freshnessComponent = 5;
  if (store.inventoryUpdateFrequency === 'Multiple times/day') freshnessComponent = 10;
  else if (store.inventoryUpdateFrequency === 'Once daily') freshnessComponent = 8;
  else if (store.inventoryUpdateFrequency === 'Every 1-2 days') freshnessComponent = 5;
  else freshnessComponent = 2;

  const total = Math.round(invComponent + acceptanceComponent + cancelComponent + subComponent + freshnessComponent);
  return Math.max(10, Math.min(99, total));
}

export function generateStoreActionPlan(store: Store): StoreActionPlan {
  const issues: string[] = [];
  const actions: StoreActionPlan['actions'] = [];

  if (store.inventoryUpdateFrequency.includes('days') || store.inventoryAccuracy < 80) {
    issues.push(`Inventory updates are infrequent (${store.inventoryUpdateFrequency}), leading to ${100 - store.inventoryAccuracy}% mismatch in physical vs listed stock.`);
    actions.push({
      title: '1. Enable Smart Rapid-Sync Inventory Assistant',
      description: 'Provide store manager with a 90-second 1-tap mobile stock audit checklist before morning and evening rush hours.',
      impact: 'Reduces phantom out-of-stock orders by an estimated 65%.',
    });
  }

  if (store.busyPeriodRejectionRate >= 15 || store.cancellationRate >= 10) {
    issues.push(`Store rejects ${store.busyPeriodRejectionRate}% of incoming orders during peak in-store walk-in hours (7:00 PM – 9:30 PM).`);
    actions.push({
      title: '2. Deploy Dynamic Peak-Rush Auto-Throttling',
      description: 'Automatically cap incoming online order queues when walk-in counters exceed capacity, instead of forcing store staff into disruptive manual cancellations.',
      impact: 'Eliminates sudden customer-facing order rejections and preserves merchant satisfaction.',
    });
  }

  if (store.substitutionRate >= 8) {
    issues.push(`High substitution rate (${store.substitutionRate}%), frequently leading to customer refund requests and support friction.`);
    actions.push({
      title: '3. Pre-Approved Equivalent SKU Mapping',
      description: 'Configure automated merchant substitution guardrails so only pre-verified equivalent brands (at equal or lower price) are suggested, with instant customer opt-in.',
      impact: 'Cuts item-level customer dissatisfaction and refund disputes by 48%.',
    });
  }

  actions.push({
    title: '4. Predictive Local Demand Spike Forecasting',
    description: 'Provide store owner with 48-hour local neighborhood demand forecasts for top-moving staples (Atta, Dairy, Oil) based on historical weekend patterns.',
    impact: 'Helps store optimize bulk procurement from distributors without tying up excess working capital.',
  });

  return {
    storeId: store.id,
    storeName: store.name,
    generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: store.actionPlanStatus === 'Actioned' ? 'Actioned' : 'Pending',
    keyIssues: issues.length > 0 ? issues : ['Routine operational monitoring required to maintain high compliance.'],
    actions,
    partnerSupportOffering: 'NOVA CART Merchant Success Team will assign an on-ground partner specialist to support initial inventory barcode mapping, with ₹0 merchant fee deduction during the 30-day pilot.',
  };
}
