export interface AppUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: 'Executive Admin' | 'Area Operations Commander' | 'Merchant Success Lead' | 'Retention Analyst';
  createdAt: string;
  lastLoginAt: string;
  loginCount: number;
  googleId?: string;
  provider: 'google' | 'email';
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type OrderStatus = 'Delivered' | 'In Transit' | 'Delayed' | 'Cancelled' | 'Store Rejected' | 'Resolved' | 'Escalated';

export type City = 'Bengaluru' | 'Mumbai' | 'Delhi-NCR';

export type StoreCategory = 'Groceries & Staples' | 'Fresh Produce & Fruits' | 'Dairy & Bakery' | 'Daily Essentials' | 'Organic & Gourmet';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: City;
  firstOrderDate: string;
  lastOrderDate: string;
  totalOrders: number;
  lifetimeValue: number;
  acquisitionChannel: 'Discount Coupon' | 'Organic Search' | 'Referral' | 'Social Ad';
  firstOrderDiscountPercent: number;
  categoriesUsed: string[];
  cancelledOrdersCount: number;
  deliveryDelayedOrdersCount: number;
  unavailableProductOrdersCount: number;
  supportTicketsCount: number;
  refundsCount: number;
  unredeemedCouponsCount: number;
  searchesForUnavailableCount: number;
  riskScore: number;
  riskLevel: RiskLevel;
  previousRating?: number; // e.g. 4.8 - reflects the "61% of churned customers previously rated 4★+" evidence
  analyzedAt?: string;
  recentNotes?: string;
}

export interface Store {
  id: string;
  name: string;
  city: City;
  category: StoreCategory;
  address: string;
  healthScore: number; // 0 - 100
  inventoryAccuracy: number; // percentage, e.g. 74
  inventoryUpdateFrequency: 'Multiple times/day' | 'Once daily' | 'Every 1-2 days' | 'Every 2-3 days';
  lastInventoryUpdate: string;
  orderAcceptanceRate: number; // percentage, e.g. 84
  cancellationRate: number; // percentage, e.g. 14
  substitutionRate: number; // percentage, e.g. 9
  busyPeriodRejectionRate: number; // percentage
  activeMonthlyOrders: number;
  partnerSatisfaction: number; // 1 - 5
  riskOfLeaving: boolean;
  actionPlanStatus?: 'Pending' | 'Actioned' | 'In Progress';
  actionPlanNotes?: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  isHighDemand: boolean;
  stockAccuracy: number; // percentage
  avgSubstitutionsMonthly: number;
}

export interface InventoryRecord {
  id: string;
  storeId: string;
  productId: string;
  productName: string;
  systemStock: number;
  actualPhysicalStock: number;
  lastUpdated: string;
  accuracyRate: number;
  status: 'In Stock' | 'Mismatched' | 'Out of Stock' | 'Critical Stale';
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  status: 'Available' | 'Unavailable' | 'Substituted';
  substitutedWith?: string;
}

export interface Order {
  id: string; // e.g. "NC10482"
  customerId: string;
  customerName: string;
  storeId: string;
  storeName: string;
  city: City;
  orderDate: string;
  orderValue: number;
  items: OrderItem[];
  estimatedMinutes: number;
  actualMinutes?: number;
  status: OrderStatus;
  isDelayed: boolean;
  hasUnavailableItem: boolean;
  hasSubstitution: boolean;
  cancellationReason?: 'Product Unavailable' | 'Delivery Delay' | 'Store Rejected' | 'Delivery Partner Unavailable' | 'Customer Cancelled' | 'Other';
  rootCause?: string;
  riskSeverity: 'LOW' | 'MEDIUM' | 'HIGH';
  resolutionStatus: 'Active' | 'Resolved' | 'Escalated';
  resolutionNotes?: string;
}

export interface DeliveryEvent {
  id: string;
  orderId: string;
  riderName: string;
  assignedTime: string;
  pickupTime?: string;
  deliveredTime?: string;
  delayMinutes: number;
  delayReason?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  orderId: string;
  issueType: 'Product Unavailable' | 'Excessive Delivery Delay' | 'Incorrect Substitution' | 'Refund Pending' | 'Store Rejection' | 'Price Discrepancy';
  status: 'Open' | 'Investigating' | 'Resolved';
  createdAt: string;
  description: string;
  refundAmount?: number;
}

export type InterventionType = 'Reliability Recovery' | 'Availability Recovery' | 'Store Capacity Intervention' | 'Category Diversification' | 'Service Assurance' | 'Multi-Category Engagement' | 'Proactive Communication';

export interface Intervention {
  id: string;
  customerId: string;
  customerName: string;
  orderId?: string;
  storeId?: string;
  type: InterventionType;
  description: string;
  recommendedAt: string;
  status: 'Recommended' | 'Executed' | 'Dismissed';
  executedAt?: string;
  feedbackImpact?: string;
}

export interface RiskAnalysis {
  customerId: string;
  customerName: string;
  score: number; // 0 - 100
  level: RiskLevel;
  factorBreakdown: {
    inactivityScore: number; // 30% weight
    cancellationScore: number; // 25% weight
    deliveryScore: number; // 20% weight
    availabilityScore: number; // 15% weight
    supportScore: number; // 10% weight
  };
  topDrivers: string[];
  evidence: string[];
  recommendationType: 'Reliability Recovery' | 'Availability Recovery' | 'Store Capacity Intervention' | 'Category Diversification' | 'Service Assurance';
  recommendedActions: string[];
  whyRecommended: string;
  discountJustified: boolean;
  discountRationale: string;
}

export interface StoreActionPlan {
  storeId: string;
  storeName: string;
  generatedAt: string;
  status: 'Pending' | 'Actioned';
  keyIssues: string[];
  actions: {
    title: string;
    description: string;
    impact: string;
  }[];
  partnerSupportOffering: string;
}

export interface SimulationInputs {
  promotionalSpendLakhs: number; // e.g. 17
  averageDeliveryMinutes: number; // e.g. 37
  cancellationRatePercent: number; // e.g. 11
  inventoryAccuracyPercent: number; // e.g. 70
  repeatPurchaseRatePercent: number; // e.g. 27
}

export interface SimulationResults {
  projectedRepeatRate: number;
  projectedOrders: number;
  projectedRevenueLakhs: number;
  projectedNetMarginLakhs: number;
  churnReductionPercent: number;
  supportTicketReduction: number;
  customerRetentionGain: number;
  monthlyPromoEfficiency: number;
  operationalSavingsLakhs: number;
  sixMonthPaybackOn25L: number; // in months
  operationalImplications: string[];
  customerImplications: string[];
  businessImplications: string[];
}
