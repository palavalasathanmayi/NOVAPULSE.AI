import test from 'node:test';
import assert from 'node:assert';
import {
  calculateStoreHealthScore,
  generateStoreActionPlan,
} from '../src/services/storeIntelligence.ts';
import { Store } from '../src/types/index.ts';

const mockStrugglingStore: Store = {
  id: 'STORE-TEST-01',
  name: 'Krishna Supermarket',
  city: 'Bengaluru',
  category: 'Groceries & Staples',
  address: 'Indiranagar 100ft Rd',
  inventoryAccuracy: 64, // Poor accuracy
  inventoryUpdateFrequency: 'Every 2-3 days',
  lastInventoryUpdate: '2 days ago',
  orderAcceptanceRate: 72,
  cancellationRate: 18.5,
  substitutionRate: 14.0,
  busyPeriodRejectionRate: 36, // 7-9 PM peak rejection
  activeMonthlyOrders: 420,
  partnerSatisfaction: 2.8,
  riskOfLeaving: true,
  healthScore: 0,
  actionPlanStatus: 'Pending',
};

const mockEliteStore: Store = {
  id: 'STORE-TEST-02',
  name: 'Apollo Quick Meds',
  city: 'Bengaluru',
  category: 'Daily Essentials',
  address: 'Koramangala 4th Block',
  inventoryAccuracy: 95,
  inventoryUpdateFrequency: 'Multiple times/day',
  lastInventoryUpdate: '10 mins ago',
  orderAcceptanceRate: 98,
  cancellationRate: 2.1,
  substitutionRate: 1.5,
  busyPeriodRejectionRate: 4,
  activeMonthlyOrders: 890,
  partnerSatisfaction: 4.8,
  riskOfLeaving: false,
  healthScore: 0,
  actionPlanStatus: 'Actioned',
};

test('Store Intelligence: Health Score Calculation Weights Multiple Metrics', () => {
  const strugglingScore = calculateStoreHealthScore(mockStrugglingStore);
  const eliteScore = calculateStoreHealthScore(mockEliteStore);

  assert.ok(strugglingScore >= 0 && strugglingScore <= 100, 'Score must be clamped 0-100');
  assert.ok(eliteScore >= 85, 'Elite store health score must be high (>=85)');
  assert.ok(strugglingScore < 65, 'Struggling store health score must be low (<65)');
  assert.ok(eliteScore > strugglingScore, 'Elite store score must exceed struggling store');
});

test('Store Intelligence: Generates Supportive, Non-Punitive Action Plan', () => {
  const plan = generateStoreActionPlan(mockStrugglingStore);

  assert.strictEqual(plan.storeId, mockStrugglingStore.id);
  assert.ok(plan.actions.length >= 3, 'Must offer at least 3 supportive actions');

  // Verify non-punitive empathy philosophy
  assert.ok(
    plan.partnerSupportOffering.toLowerCase().includes('zero penalty') ||
    plan.partnerSupportOffering.toLowerCase().includes('support') ||
    plan.partnerSupportOffering.toLowerCase().includes('subsidized'),
    'Action plan must be supportive and merchant-empathic'
  );

  // Check specific operational actions
  const actionTitles = plan.actions.map(a => a.title.toLowerCase());
  const hasInventoryOrRushAid = actionTitles.some(t =>
    t.includes('inventory') || t.includes('barcode') || t.includes('rush') || t.includes('throttle')
  );
  assert.ok(hasInventoryOrRushAid, 'Plan must address manual inventory or peak hour rush aid');
});
