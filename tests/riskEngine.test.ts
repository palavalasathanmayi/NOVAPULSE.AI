import test from 'node:test';
import assert from 'node:assert';
import {
  calculateCustomerRisk,
  explainCustomerRisk,
  recommendCustomerIntervention,
} from '../src/services/riskEngine.ts';
import { Customer } from '../src/types/index.ts';

const mockAtRiskCustomer: Customer = {
  id: 'CUST-TEST-01',
  name: 'Ananya Deshmukh',
  email: 'ananya.d@example.in',
  phone: '+91 98450 99881',
  city: 'Bengaluru',
  firstOrderDate: '2026-05-10',
  lastOrderDate: '2026-08-28', // 34+ days inactive
  totalOrders: 6,
  lifetimeValue: 3120,
  acquisitionChannel: 'Discount Coupon',
  firstOrderDiscountPercent: 50,
  categoriesUsed: ['Groceries & Staples'],
  cancelledOrdersCount: 2,
  deliveryDelayedOrdersCount: 2,
  unavailableProductOrdersCount: 3,
  supportTicketsCount: 2,
  refundsCount: 1,
  unredeemedCouponsCount: 3,
  searchesForUnavailableCount: 5,
  riskScore: 0,
  riskLevel: 'Low',
  previousRating: 4.8,
};

const mockHealthyCustomer: Customer = {
  id: 'CUST-TEST-02',
  name: 'Vikram Joshi',
  email: 'vikram.j@example.in',
  phone: '+91 98450 99882',
  city: 'Mumbai',
  firstOrderDate: '2026-04-01',
  lastOrderDate: '2026-10-01', // active within 1 day
  totalOrders: 14,
  lifetimeValue: 7420,
  acquisitionChannel: 'Organic Search',
  firstOrderDiscountPercent: 0,
  categoriesUsed: ['Groceries & Staples', 'Fresh Produce & Fruits', 'Dairy & Bakery'],
  cancelledOrdersCount: 0,
  deliveryDelayedOrdersCount: 0,
  unavailableProductOrdersCount: 0,
  supportTicketsCount: 0,
  refundsCount: 0,
  unredeemedCouponsCount: 0,
  searchesForUnavailableCount: 0,
  riskScore: 0,
  riskLevel: 'Low',
  previousRating: 5.0,
};

test('Risk Engine: Transparent 30/25/20/15/10 Weighting Logic', () => {
  const analysis = calculateCustomerRisk(mockAtRiskCustomer);

  assert.ok(analysis.score >= 0 && analysis.score <= 100, 'Score must be clamped between 0 and 100');
  assert.strictEqual(analysis.level, 'High', 'Customer with multiple delays and stockouts should be High Risk');
  assert.ok(analysis.score >= 65, 'High risk score must be >= 65');

  // Verify breakdown components exist
  const b = analysis.factorBreakdown;
  assert.ok(typeof b.inactivityScore === 'number');
  assert.ok(typeof b.cancellationScore === 'number');
  assert.ok(typeof b.deliveryScore === 'number');
  assert.ok(typeof b.availabilityScore === 'number');
  assert.ok(typeof b.supportScore === 'number');
});

test('Risk Engine: Healthy Customer yields Low Risk', () => {
  const analysis = calculateCustomerRisk(mockHealthyCustomer);
  assert.strictEqual(analysis.level, 'Low', 'Active customer with 0 failures should be Low Risk');
  assert.ok(analysis.score < 35, 'Low risk score must be < 35');
});

test('Risk Engine: Non-Discount Retention Philosophy Enforced', () => {
  const intervention = recommendCustomerIntervention(mockAtRiskCustomer);

  assert.strictEqual(intervention.discountJustified, false, 'Discounts must be explicitly withheld for operational churn');
  assert.ok(
    intervention.actionType === 'Reliability Recovery' || intervention.actionType === 'Availability Recovery',
    'Intervention must be operational recovery, not price subsidization'
  );
  assert.ok(intervention.recommendedActions.length >= 3, 'Must provide at least 3 concrete operational actions');
});

test('Risk Engine: Root Cause Explanation Generates Auditable Evidence', () => {
  const explanation = explainCustomerRisk(mockAtRiskCustomer);
  assert.ok(explanation.primaryDriver.length > 0, 'Must identify primary driver');
  assert.ok(explanation.evidence.length >= 2, 'Must provide at least 2 pieces of verified evidence');
  assert.ok(explanation.impactDescription.length > 10, 'Must provide detailed impact description');
});
