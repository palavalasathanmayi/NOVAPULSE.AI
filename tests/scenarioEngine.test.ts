import test from 'node:test';
import assert from 'node:assert';
import {
  runScenarioSimulation,
  BASELINE_SCENARIO,
} from '../src/services/scenarioEngine.ts';

test('Scenario Engine: Baseline Scenario Matches Authoritative Case Facts', () => {
  const result = runScenarioSimulation(BASELINE_SCENARIO);

  assert.strictEqual(BASELINE_SCENARIO.promotionalSpendLakhs, 17.0, 'Baseline promo spend is ₹17L');
  assert.strictEqual(BASELINE_SCENARIO.averageDeliveryMinutes, 37, 'Baseline delivery is 37 min');
  assert.strictEqual(BASELINE_SCENARIO.cancellationRatePercent, 11.0, 'Baseline cancellation is 11%');
  assert.strictEqual(BASELINE_SCENARIO.inventoryAccuracyPercent, 70.0, 'Baseline inventory accuracy is 70%');

  // At baseline, projected values match baseline
  assert.strictEqual(result.projectedRepeatRate, 27.0, 'Baseline repeat rate is 27%');
  assert.strictEqual(result.operationalSavingsLakhs, 0, 'No delta savings at exact baseline');
});

test('Scenario Engine: Optimizing Operations Increases Repeat Rate & Saves Revenue', () => {
  const optimizedInput = {
    promotionalSpendLakhs: 12.0, // Reallocated ₹5L
    averageDeliveryMinutes: 28,  // Improved from 37 to 28 min
    cancellationRatePercent: 6.5,// Reduced from 11% to 6.5%
    inventoryAccuracyPercent: 88,// Improved from 70% to 88%
    repeatPurchaseRatePercent: 27.0,
  };

  const result = runScenarioSimulation(optimizedInput);

  assert.ok(result.projectedRepeatRate > 27.0, 'Repeat rate must improve beyond baseline 27%');
  assert.ok(result.projectedRepeatRate >= 34.0, 'Target repeat rate should reach 34-36%');
  assert.ok(result.operationalSavingsLakhs > 0, 'Must produce monthly operational savings');
  assert.ok(result.projectedNetMarginLakhs > 2.02, 'Projected margin must exceed current 2.02L baseline');
  assert.ok(result.sixMonthPaybackOn25L <= 12, 'Pilot payback must be under 12 months');
});

test('Scenario Engine: Worst Case Degradation Yields Sound Financial Warning', () => {
  const degradedInput = {
    promotionalSpendLakhs: 22.0, // Blind spend increase (+30%)
    averageDeliveryMinutes: 45,  // Slower
    cancellationRatePercent: 16.0,// Worse
    inventoryAccuracyPercent: 60,
    repeatPurchaseRatePercent: 27.0,
  };

  const result = runScenarioSimulation(degradedInput);
  assert.ok(result.projectedRepeatRate < 27.0, 'Repeat purchase must decline with operational breakdown');
  assert.ok(result.churnReductionPercent === 0, 'Zero churn reduction under operational collapse');
});
