/**
 * Authoritative Case Evidence & Core Metrics for NOVA CART
 * Provided by the PromptWars Business Rescue Challenge
 */

export interface CaseMetric {
  id: string;
  label: string;
  currentValue: string;
  previousValue: string;
  unit?: string;
  change: string;
  direction: 'up' | 'down';
  isPositive: boolean;
  status: 'Critical' | 'Needs attention' | 'Warning' | 'Healthy' | 'Caution';
  meaning: string;
}

export const CASE_KPIS: CaseMetric[] = [
  {
    id: 'repeat_purchase',
    label: 'Repeat Purchase Rate',
    currentValue: '27%',
    previousValue: '41%',
    change: '↓ 14% pts',
    direction: 'down',
    isPositive: false,
    status: 'Critical',
    meaning: 'Customer loyalty collapsed despite heavy marketing; 61% of churned buyers had previously rated NOVA CART 4★+.',
  },
  {
    id: 'cancellation_rate',
    label: 'Order Cancellation Rate',
    currentValue: '11%',
    previousValue: '6%',
    change: '↑ 5% pts (nearly doubled)',
    direction: 'up',
    isPositive: false,
    status: 'Critical',
    meaning: '1 in 9 orders fails before completion, predominantly caused by inventory stockouts (35%) and delivery delays (27%).',
  },
  {
    id: 'avg_delivery_time',
    label: 'Avg Delivery Time',
    currentValue: '37 min',
    previousValue: '29 min',
    change: '↑ 8 min longer',
    direction: 'up',
    isPositive: false,
    status: 'Needs attention',
    meaning: 'Breaching consumer quick-commerce SLA expectations; 13% of orders are delivered >15 min past estimate.',
  },
  {
    id: 'support_tickets',
    label: 'Monthly Support Tickets',
    currentValue: '5,900',
    previousValue: '3,100',
    change: '↑ 90.3% increase',
    direction: 'up',
    isPositive: false,
    status: 'Critical',
    meaning: 'Avg resolution takes 9.2 hours; 29% are refund-status inquiries and 24% are delayed-delivery complaints.',
  },
  {
    id: 'promo_spend',
    label: 'Monthly Promo Spend',
    currentValue: '₹17.0L',
    previousValue: '₹9.5L',
    change: '↑ ₹7.5L (+78.9%)',
    direction: 'up',
    isPositive: false,
    status: 'Caution',
    meaning: '58% of budget (₹9.86L) spent on new user acquisition, yet 44% of coupons are never redeemed and discount cohorts churn rapidly.',
  },
  {
    id: 'revenue',
    label: 'Monthly Net Revenue',
    currentValue: '₹26.1L',
    previousValue: '₹21.8L',
    change: '↑ ₹4.3L (+19.7%)',
    direction: 'up',
    isPositive: true,
    status: 'Needs attention',
    meaning: 'Topline is growing at 19.7%, but promotional burn jumped 79%—eroding real unit economics and margins.',
  },
  {
    id: 'registered_users',
    label: 'Registered Users',
    currentValue: '120,000',
    previousValue: '82,000',
    change: '↑ 38,000 (+46.3%)',
    direction: 'up',
    isPositive: true,
    status: 'Healthy',
    meaning: 'Top-of-funnel customer acquisition remains strong, driven by city ad campaigns and merchant footprint across 620 stores.',
  },
  {
    id: 'mau',
    label: 'Monthly Active Users (MAU)',
    currentValue: '46,000',
    previousValue: '39,000',
    change: '↑ 7,000 (+17.9%)',
    direction: 'up',
    isPositive: true,
    status: 'Healthy',
    meaning: 'Active engagement is lagging total registrations as 54% complete order #1 but only 31% order again in 30 days.',
  },
  {
    id: 'monthly_orders',
    label: 'Monthly Orders',
    currentValue: '38,500',
    previousValue: '31,200',
    change: '↑ 7,300 (+23.4%)',
    direction: 'up',
    isPositive: true,
    status: 'Needs attention',
    meaning: 'Order growth is driven by one-off promotional trials rather than high-frequency repeat basket purchases.',
  },
  {
    id: 'aov',
    label: 'Average Order Value (AOV)',
    currentValue: '₹486',
    previousValue: '₹452',
    change: '↑ ₹34 (+7.5%)',
    direction: 'up',
    isPositive: true,
    status: 'Healthy',
    meaning: 'Baskets are larger, making order cancellations and substitutions financially more damaging per incident.',
  },
];

export const HISTORICAL_TRENDS = [
  { month: 'Month -5', registeredUsers: 82000, mau: 39000, orders: 31200, repeatRate: 41.0, avgDeliveryMin: 29.0, cancellationRate: 6.0, tickets: 3100, promoSpendLakhs: 9.5, revenueLakhs: 21.8 },
  { month: 'Month -4', registeredUsers: 89000, mau: 40200, orders: 32400, repeatRate: 38.5, avgDeliveryMin: 30.5, cancellationRate: 6.8, tickets: 3500, promoSpendLakhs: 11.0, revenueLakhs: 22.6 },
  { month: 'Month -3', registeredUsers: 97000, mau: 41800, orders: 34100, repeatRate: 35.0, avgDeliveryMin: 32.0, cancellationRate: 7.9, tickets: 4100, promoSpendLakhs: 12.8, revenueLakhs: 23.5 },
  { month: 'Month -2', registeredUsers: 105000, mau: 43200, orders: 35600, repeatRate: 31.8, avgDeliveryMin: 33.8, cancellationRate: 9.1, tickets: 4700, promoSpendLakhs: 14.5, revenueLakhs: 24.4 },
  { month: 'Month -1', registeredUsers: 113000, mau: 44800, orders: 37200, repeatRate: 29.2, avgDeliveryMin: 35.5, cancellationRate: 10.2, tickets: 5350, promoSpendLakhs: 15.9, revenueLakhs: 25.3 },
  { month: 'Current', registeredUsers: 120000, mau: 46000, orders: 38500, repeatRate: 27.0, avgDeliveryMin: 37.0, cancellationRate: 11.0, tickets: 5900, promoSpendLakhs: 17.0, revenueLakhs: 26.1 },
];

export const CUSTOMER_SURVEY_EVIDENCE = [
  { reason: 'Prices/fees higher than expected', percent: 38, category: 'Pricing & Value' },
  { reason: 'Delivery too slow', percent: 34, category: 'Logistics SLA' },
  { reason: 'Products become unavailable after ordering', percent: 29, category: 'Inventory Freshness' },
  { reason: 'Discounts confusing or non-applicable', percent: 24, category: 'Promotions' },
  { reason: 'Prefer walking to nearby stores directly', percent: 21, category: 'Channel Friction' },
  { reason: 'Difficult to discover relevant local products', percent: 18, category: 'Catalog Discovery' },
  { reason: 'Refund problems / delayed credit', percent: 16, category: 'Customer Experience' },
  { reason: 'App cluttered / confusing UX', percent: 14, category: 'Mobile Experience' },
  { reason: 'Rider tracking inaccurate / frozen map', percent: 11, category: 'Logistics SLA' },
];

export const CANCELLATION_REASONS = [
  { reason: 'Product Unavailable in Store', percent: 35, count: 1482, color: '#f43f5e' },
  { reason: 'Excessive Delivery Delay', percent: 27, count: 1143, color: '#fb923c' },
  { reason: 'Store Rejected Order (Busy/Capacity)', percent: 18, count: 762, color: '#facc15' },
  { reason: 'Delivery Partner Unavailable', percent: 12, count: 508, color: '#38bdf8' },
  { reason: 'Other (Customer mind change / duplicate)', percent: 8, count: 339, color: '#94a3b8' },
];

export const SUPPORT_TICKETS_BREAKDOWN = [
  { category: 'Refund Status / Delay', percent: 29, count: 1711, color: '#f43f5e', avgHours: 11.4 },
  { category: 'Delayed Delivery (>15m)', percent: 24, count: 1416, color: '#fb923c', avgHours: 7.2 },
  { category: 'Missing / Unavailable Product', percent: 19, count: 1121, color: '#facc15', avgHours: 9.8 },
  { category: 'Coupon / Discount Issues', percent: 13, count: 767, color: '#38bdf8', avgHours: 6.5 },
  { category: 'Incorrect Order / Substitution', percent: 9, count: 531, color: '#a855f7', avgHours: 12.1 },
  { category: 'Other Inquiries', percent: 6, count: 354, color: '#94a3b8', avgHours: 8.0 },
];

export const MARKETING_SPEND_BREAKDOWN = {
  totalMonthlySpendLakhs: 17.0,
  newUserAcquisitionLakhs: 9.86, // 58%
  existingUserRetentionLakhs: 7.14, // 42%
  unredeemedCouponsPercent: 44,
  managementProposalIncreasePercent: 30, // Management considering +30% budget
  managementProposedSpendLakhs: 22.1,
};

export const BEHAVIORAL_INSIGHTS = [
  { metric: '61%', label: 'High-Intent Churners', detail: 'Customers who stopped ordering had previously rated NOVA CART 4★+' },
  { metric: '54%', label: 'First-Order Conversion', detail: 'New registered users who complete order #1' },
  { metric: '31%', label: 'Second-Order Retention', detail: 'Only 31% place a second order within 30 days' },
  { metric: '72%', label: 'Magic 3-Order Threshold', detail: 'Customers completing 3 orders have a 72% probability of ordering next month' },
  { metric: '44%', label: 'Unredeemed Promo Coupons', detail: 'Heavy marketing waste on untargeted broadcast vouchers' },
  { metric: '19%', label: 'Phantom Searches', detail: 'Users repeatedly querying catalog items that are out-of-stock' },
  { metric: '2.4x', label: 'Multi-Category Retention Lift', detail: 'Customers shopping across >1 store category repeat 2.4x more' },
];

export const PARTNER_STORE_EVIDENCE = [
  { insight: 'Valuable customer channel', percent: 46, sentiment: 'positive', description: 'See NOVA CART as a meaningful source of new neighborhood footfall' },
  { insight: 'Inventory maintenance requires too much effort', percent: 39, sentiment: 'negative', description: 'Manual physical inventory counting conflicts with busy in-store peak hours' },
  { insight: 'Platform promotions erode gross margins', percent: 31, sentiment: 'negative', description: 'Aggressive platform discounts squeeze thin retailer margins' },
  { insight: 'Struggle to predict online daily demand spikes', percent: 28, sentiment: 'warning', description: 'Cannot forecast platform order influx vs walk-in demand' },
  { insight: 'Occasionally reject orders during peak rushes', percent: 23, sentiment: 'negative', description: 'Reject digital orders when counter is packed with walk-ins' },
  { insight: 'Actively considering leaving platform in 1 year', percent: 18, sentiment: 'critical', description: 'Merchant churn risk threatens local network density' },
];

export const CONNECTED_SYSTEMS = [
  { name: 'Customer Mobile App', status: 'Connected', signal: 'Basket abandonments, phantom queries & rating logs' },
  { name: 'Web Ordering Portal', status: 'Connected', signal: 'Real-time cart initiation & checkout timestamps' },
  { name: 'Partner Kirana Terminal', status: 'Connected', signal: 'Store stock sync, acceptance delays & rush throttling' },
  { name: 'Central Order Database', status: 'Connected', signal: '38,500 monthly transactions across 620 merchants' },
  { name: 'Customer Master CRM', status: 'Connected', signal: '120k registered profiles & 30-day cohort retention' },
  { name: 'Delivery GPS Telemetry', status: 'Connected', signal: 'Rider dispatch, pickup wait & delay pings' },
  { name: 'Payment & Refund Gateway', status: 'Connected', signal: 'Instant UPI reversal status & settlement queues' },
  { name: 'Promotions Engine', status: 'Connected', signal: '₹17L coupon issuance & 44% unredeemed telemetry' },
];

export const OPERATIONAL_METRICS_BREAKDOWN = {
  totalStores: 620,
  monthlyOrders: 38500,
  cancelledOrdersTotal: 4235, // 11% of 38,500
  lateDeliveryOrdersTotal: 5005, // 13% of 38,500
  substitutedOrdersTotal: 3080, // 8% of 38,500
  supportRefundOrdersTotal: 2310, // 6% of 38,500
  avgSupportResolutionHours: 9.2,
};
