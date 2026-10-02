import test from 'node:test';
import assert from 'node:assert';
import {
  BUSINESS_CASE_FACTS,
  CUSTOMER_SURVEY_EVIDENCE_STATS,
  BEHAVIORAL_EVIDENCE,
  OPERATIONAL_EVIDENCE,
  CANCELLATION_REASONS_STATS,
  PARTNER_STORE_EVIDENCE_STATS,
  PILOT_BUDGET_ALLOCATION,
  TARGET_ROADMAP,
} from '../src/data/caseData.ts';

test('Problem Statement Alignment: Authoritative Business Case Metrics', () => {
  assert.strictEqual(BUSINESS_CASE_FACTS.partnerStoresCount, 620, '620 local stores');
  assert.strictEqual(BUSINESS_CASE_FACTS.registeredUsersCurrent, 120000, '120k registered users');
  assert.strictEqual(BUSINESS_CASE_FACTS.registeredUsersPrevious, 82000, '82k previous users');
  assert.strictEqual(BUSINESS_CASE_FACTS.monthlyActiveUsersCurrent, 46000, '46k MAU');
  assert.strictEqual(BUSINESS_CASE_FACTS.monthlyActiveUsersPrevious, 39000, '39k previous MAU');
  assert.strictEqual(BUSINESS_CASE_FACTS.monthlyOrdersCurrent, 38500, '38.5k orders');
  assert.strictEqual(BUSINESS_CASE_FACTS.monthlyOrdersPrevious, 31200, '31.2k previous orders');
  assert.strictEqual(BUSINESS_CASE_FACTS.averageOrderValueCurrent, 486, '₹486 AOV');
  assert.strictEqual(BUSINESS_CASE_FACTS.averageOrderValuePrevious, 452, '₹452 previous AOV');
  assert.strictEqual(BUSINESS_CASE_FACTS.monthlyRevenueLakhsCurrent, 26.1, '₹26.1L current revenue');
  assert.strictEqual(BUSINESS_CASE_FACTS.monthlyRevenueLakhsPrevious, 21.8, '₹21.8L previous revenue');

  // The Critical Health Deterioration
  assert.strictEqual(BUSINESS_CASE_FACTS.repeatPurchaseRateCurrent, 27, 'Repeat purchase collapsed to 27%');
  assert.strictEqual(BUSINESS_CASE_FACTS.repeatPurchaseRatePrevious, 41, 'Repeat purchase was 41%');
  assert.strictEqual(BUSINESS_CASE_FACTS.averageDeliveryMinutesCurrent, 37, 'Delivery time slowed to 37 min');
  assert.strictEqual(BUSINESS_CASE_FACTS.averageDeliveryMinutesPrevious, 29, 'Delivery time was 29 min');
  assert.strictEqual(BUSINESS_CASE_FACTS.cancellationRateCurrent, 11, 'Cancellation rose to 11%');
  assert.strictEqual(BUSINESS_CASE_FACTS.cancellationRatePrevious, 6, 'Cancellation was 6%');
  assert.strictEqual(BUSINESS_CASE_FACTS.supportTicketsMonthlyCurrent, 5900, 'Support tickets surged to 5,900');
  assert.strictEqual(BUSINESS_CASE_FACTS.supportTicketsMonthlyPrevious, 3100, 'Support tickets were 3,100');
  assert.strictEqual(BUSINESS_CASE_FACTS.promotionalSpendLakhsCurrent, 17.0, 'Promotional spend surged to ₹17.0L');
  assert.strictEqual(BUSINESS_CASE_FACTS.promotionalSpendLakhsPrevious, 9.5, 'Promotional spend was ₹9.5L');
});

test('Problem Statement Alignment: Customer Survey & Behavioral Evidence', () => {
  // Survey percentages
  assert.strictEqual(CUSTOMER_SURVEY_EVIDENCE_STATS.pricesOrFeesHigherThanExpected, 38);
  assert.strictEqual(CUSTOMER_SURVEY_EVIDENCE_STATS.deliveryTooSlow, 34);
  assert.strictEqual(CUSTOMER_SURVEY_EVIDENCE_STATS.productsUnavailableAfterOrdering, 29);
  assert.strictEqual(CUSTOMER_SURVEY_EVIDENCE_STATS.discountsConfusing, 24);
  assert.strictEqual(CUSTOMER_SURVEY_EVIDENCE_STATS.preferNearbyStoresDirectly, 21);
  assert.strictEqual(CUSTOMER_SURVEY_EVIDENCE_STATS.difficultToDiscoverLocalProducts, 18);
  assert.strictEqual(CUSTOMER_SURVEY_EVIDENCE_STATS.refundProblems, 16);
  assert.strictEqual(CUSTOMER_SURVEY_EVIDENCE_STATS.appCluttered, 14);
  assert.strictEqual(CUSTOMER_SURVEY_EVIDENCE_STATS.trackingInaccurate, 11);

  // Behavioral evidence
  assert.strictEqual(BEHAVIORAL_EVIDENCE.churnedUsersWithHighRatingPercent, 61, '61% of churned users previously rated 4★+');
  assert.strictEqual(BEHAVIORAL_EVIDENCE.newUserFirstOrderCompletionPercent, 54, '54% first order completion');
  assert.strictEqual(BEHAVIORAL_EVIDENCE.secondOrderWithin30DaysPercent, 31, '31% second order retention');
  assert.strictEqual(BEHAVIORAL_EVIDENCE.threeOrdersRepeatProbabilityPercent, 72, '72% retention at 3 orders');
  assert.strictEqual(BEHAVIORAL_EVIDENCE.couponsUnredeemedPercent, 44, '44% coupons never redeemed');
  assert.strictEqual(BEHAVIORAL_EVIDENCE.repeatedlySearchUnavailablePercent, 19, '19% repeatedly search unavailable');
});

test('Problem Statement Alignment: Operational Failure Root Cause Breakdown', () => {
  assert.strictEqual(OPERATIONAL_EVIDENCE.ordersCancelledPercent, 11);
  assert.strictEqual(OPERATIONAL_EVIDENCE.ordersArriveLateMoreThan15MinPercent, 13);
  assert.strictEqual(OPERATIONAL_EVIDENCE.ordersWithSubstitutionsPercent, 8);
  assert.strictEqual(OPERATIONAL_EVIDENCE.ordersWithRefundsOrTicketsPercent, 6);

  // Specific Cancellation Breakdown (sums to 92% specified in case facts)
  assert.strictEqual(CANCELLATION_REASONS_STATS.unavailableProductsPercent, 35, '35% due to unavailable products');
  assert.strictEqual(CANCELLATION_REASONS_STATS.deliveryDelaysPercent, 27, '27% due to delivery delays');
  assert.strictEqual(CANCELLATION_REASONS_STATS.storeRejectionPercent, 18, '18% due to store rejection');
  assert.strictEqual(CANCELLATION_REASONS_STATS.unavailableDeliveryPartnersPercent, 12, '12% due to unavailable riders');

  // Partner Store Evidence
  assert.strictEqual(PARTNER_STORE_EVIDENCE_STATS.valueNovaCartCustomersPercent, 46);
  assert.strictEqual(PARTNER_STORE_EVIDENCE_STATS.inventoryMaintenanceTooMuchEffortPercent, 39);
  assert.strictEqual(PARTNER_STORE_EVIDENCE_STATS.promotionsReduceMarginsPercent, 31);
  assert.strictEqual(PARTNER_STORE_EVIDENCE_STATS.struggleWithDemandPredictionPercent, 28);
  assert.strictEqual(PARTNER_STORE_EVIDENCE_STATS.rejectOrdersWhenBusyPercent, 23);
  assert.strictEqual(PARTNER_STORE_EVIDENCE_STATS.consideringLeavingWithinYearPercent, 18);
});

test('Problem Statement Alignment: ₹25 Lakhs Pilot Budget Allocation & Target Roadmap', () => {
  const totalBudget = PILOT_BUDGET_ALLOCATION.reduce((sum, item) => sum + item.amountLakhs, 0);
  assert.strictEqual(totalBudget, 25.0, 'Pilot budget must sum exactly to ₹25.0 Lakhs');

  // Verify key recovery targets
  assert.strictEqual(TARGET_ROADMAP.repeatPurchaseTargetPercent, 36.0, 'Repeat purchase target is 36%');
  assert.strictEqual(TARGET_ROADMAP.cancellationRateTargetPercent, 6.5, 'Cancellation target is 6.5%');
  assert.strictEqual(TARGET_ROADMAP.averageDeliveryMinutesTarget, 28, 'Delivery SLA target is 28 minutes');
});
