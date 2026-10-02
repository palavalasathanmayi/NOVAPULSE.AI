import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Customer, Store, Order, Product, InventoryRecord, SupportTicket, DeliveryEvent, Intervention, City, RiskAnalysis, StoreActionPlan } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_STORES, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_INVENTORY, INITIAL_SUPPORT_TICKETS, INITIAL_DELIVERY_EVENTS, INITIAL_INTERVENTIONS } from '../data/seedData';
import { calculateCustomerRisk } from '../services/riskEngine';
import { calculateStoreHealthScore, generateStoreActionPlan } from '../services/storeIntelligence';

export type AppPage = 'command_center' | 'customer_rescue' | 'root_causes' | 'store_intelligence' | 'operations' | 'ai_insights' | 'scenario_simulator';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface AppContextType {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  selectedCity: City | 'All';
  setSelectedCity: (city: City | 'All') => void;
  customers: Customer[];
  stores: Store[];
  products: Product[];
  orders: Order[];
  inventory: InventoryRecord[];
  tickets: SupportTicket[];
  deliveries: DeliveryEvent[];
  interventions: Intervention[];

  // Selected entities for drawers / modals
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  selectedCustomer: Customer | undefined;
  activeCustomerAnalysis: RiskAnalysis | null;
  setActiveCustomerAnalysis: (analysis: RiskAnalysis | null) => void;

  selectedStoreId: string | null;
  setSelectedStoreId: (id: string | null) => void;
  selectedStore: Store | undefined;
  activeStorePlan: StoreActionPlan | null;
  setActiveStorePlan: (plan: StoreActionPlan | null) => void;

  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedOrder: Order | undefined;

  // Actions
  resolveOrder: (orderId: string, notes?: string) => void;
  escalateOrder: (orderId: string, reason?: string) => void;
  contactStoreForOrder: (orderId: string) => void;
  notifyCustomerForOrder: (orderId: string, message?: string) => void;
  markStoreActionPlanDone: (storeId: string) => void;
  applyCustomerIntervention: (customerId: string, interventionType: Intervention['type'], description: string) => void;
  runCustomerAnalysis: (customerId: string) => RiskAnalysis;

  // Guided Demo Tour
  tourStep: number | null; // null if inactive, 1 to 7
  startJudgeTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endJudgeTour: () => void;

  // Business Impact Modal
  isBusinessImpactModalOpen: boolean;
  setIsBusinessImpactModalOpen: (open: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<AppPage>('command_center');
  const [selectedCity, setSelectedCity] = useState<City | 'All'>('All');

  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inventory] = useState<InventoryRecord[]>(INITIAL_INVENTORY);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [deliveries] = useState<DeliveryEvent[]>(INITIAL_DELIVERY_EVENTS);
  const [interventions, setInterventions] = useState<Intervention[]>(INITIAL_INTERVENTIONS);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>('CUST-1001'); // Priya Sharma default
  const [activeCustomerAnalysis, setActiveCustomerAnalysis] = useState<RiskAnalysis | null>(null);

  const [selectedStoreId, setSelectedStoreId] = useState<string | null>('STORE-201'); // Local Mart Indiranagar
  const [activeStorePlan, setActiveStorePlan] = useState<StoreActionPlan | null>(null);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('NC10482'); // Primary demo order

  const [tourStep, setTourStep] = useState<number | null>(null);
  const [isBusinessImpactModalOpen, setIsBusinessImpactModalOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || customers[0];
  }, [customers, selectedCustomerId]);

  const selectedStore = useMemo(() => {
    return stores.find(s => s.id === selectedStoreId) || stores[0];
  }, [stores, selectedStoreId]);

  const selectedOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || orders[0];
  }, [orders, selectedOrderId]);

  // Real stateful action: Resolve Order
  const resolveOrder = (orderId: string, notes: string = 'Order resolved via priority replacement allocation and customer compensation.') => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Resolved',
          resolutionStatus: 'Resolved',
          resolutionNotes: notes,
        };
      }
      return o;
    }));

    // Also resolve associated ticket if any
    setTickets(prev => prev.map(t => {
      if (t.orderId === orderId) {
        return { ...t, status: 'Resolved' };
      }
      return t;
    }));

    addToast({
      type: 'success',
      title: `Order ${orderId} Marked as Resolved`,
      description: 'Customer notification dispatched and ticket closed.',
    });
  };

  // Real stateful action: Escalate Order
  const escalateOrder = (orderId: string, reason: string = 'Escalated to Area Operations Lead for partner inventory audit.') => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Escalated',
          resolutionStatus: 'Escalated',
          resolutionNotes: reason,
        };
      }
      return o;
    }));

    addToast({
      type: 'warning',
      title: `Order ${orderId} Escalated`,
      description: 'Assigned to City Operations Commander.',
    });
  };

  const contactStoreForOrder = (orderId: string) => {
    const ord = orders.find(o => o.id === orderId);
    addToast({
      type: 'info',
      title: `Contacting ${ord ? ord.storeName : 'Partner Store'}`,
      description: 'Automated live IVR prompt sent to store manager terminal.',
    });
  };

  const notifyCustomerForOrder = (orderId: string, message: string = 'We have priority rerouted your basket from a verified in-stock partner.') => {
    const ord = orders.find(o => o.id === orderId);
    addToast({
      type: 'success',
      title: `Notification Sent to ${ord ? ord.customerName : 'Customer'}`,
      description: message,
    });
  };

  // Real stateful action: Mark Store Action Plan Actioned
  const markStoreActionPlanDone = (storeId: string) => {
    setStores(prev => prev.map(s => {
      if (s.id === storeId) {
        const updatedHealth = Math.min(95, s.healthScore + 12);
        return {
          ...s,
          actionPlanStatus: 'Actioned',
          healthScore: updatedHealth,
          inventoryAccuracy: Math.min(96, s.inventoryAccuracy + 15),
          inventoryUpdateFrequency: 'Multiple times/day',
          lastInventoryUpdate: 'Just now (Synced)',
        };
      }
      return s;
    }));

    if (activeStorePlan && activeStorePlan.storeId === storeId) {
      setActiveStorePlan({
        ...activeStorePlan,
        status: 'Actioned',
      });
    }

    const st = stores.find(s => s.id === storeId);
    addToast({
      type: 'success',
      title: `Action Plan Applied for ${st ? st.name : 'Store'}`,
      description: 'Rapid-sync enabled; store health score improved by +12 pts.',
    });
  };

  // Real stateful action: Apply Customer Intervention
  const applyCustomerIntervention = (customerId: string, interventionType: Intervention['type'], description: string) => {
    const cust = customers.find(c => c.id === customerId);
    const newIntervention: Intervention = {
      id: `INT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId,
      customerName: cust ? cust.name : 'Customer',
      type: interventionType,
      description,
      recommendedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Executed',
      executedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      feedbackImpact: 'Intervention active. SLA protection applied.',
    };

    setInterventions(prev => [newIntervention, ...prev]);

    // Update customer risk slightly downward as proactive action has been taken
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const updatedScore = Math.max(15, c.riskScore - 18);
        return {
          ...c,
          riskScore: updatedScore,
          riskLevel: updatedScore >= 70 ? 'High' : updatedScore >= 40 ? 'Medium' : 'Low',
          recentNotes: `Intervention [${interventionType}] executed on ${new Date().toLocaleDateString()}. Proactive recovery initiated.`,
        };
      }
      return c;
    }));

    addToast({
      type: 'success',
      title: `Intervention Executed for ${cust ? cust.name : 'Customer'}`,
      description: `"${interventionType}" applied. Risk score reduced.`,
    });
  };

  const runCustomerAnalysis = (customerId: string): RiskAnalysis => {
    const cust = customers.find(c => c.id === customerId) || customers[0];
    const analysis = calculateCustomerRisk(cust);
    setActiveCustomerAnalysis(analysis);
    return analysis;
  };

  // Guided Judge Tour controls
  const startJudgeTour = () => {
    setTourStep(1);
    setActivePage('command_center');
    addToast({
      type: 'info',
      title: 'Judge Demonstration Flow Started',
      description: 'Step 1 of 7: Reviewing NOVA CART deteriorating growth paradox.',
    });
  };

  const nextTourStep = () => {
    if (tourStep === null) return;
    const next = tourStep + 1;
    if (next > 7) {
      endJudgeTour();
      return;
    }
    setTourStep(next);

    switch (next) {
      case 2:
        setActivePage('root_causes');
        break;
      case 3:
        setActivePage('customer_rescue');
        setSelectedCustomerId('CUST-1001'); // Priya Sharma
        runCustomerAnalysis('CUST-1001');
        break;
      case 4:
        setActivePage('store_intelligence');
        setSelectedStoreId('STORE-201'); // Local Mart Indiranagar
        if (selectedStore) {
          setActiveStorePlan(generateStoreActionPlan(selectedStore));
        }
        break;
      case 5:
        setActivePage('operations');
        setSelectedOrderId('NC10482');
        break;
      case 6:
        setActivePage('scenario_simulator');
        break;
      case 7:
        setIsBusinessImpactModalOpen(true);
        break;
    }
  };

  const prevTourStep = () => {
    if (tourStep === null || tourStep <= 1) return;
    const prev = tourStep - 1;
    setTourStep(prev);
    switch (prev) {
      case 1:
        setActivePage('command_center');
        break;
      case 2:
        setActivePage('root_causes');
        break;
      case 3:
        setActivePage('customer_rescue');
        break;
      case 4:
        setActivePage('store_intelligence');
        break;
      case 5:
        setActivePage('operations');
        break;
      case 6:
        setActivePage('scenario_simulator');
        break;
    }
  };

  const endJudgeTour = () => {
    setTourStep(null);
    addToast({
      type: 'info',
      title: 'Judge Walkthrough Complete',
      description: 'You can now explore all pages freely.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedCity,
        setSelectedCity,
        customers,
        stores,
        products,
        orders,
        inventory,
        tickets,
        deliveries,
        interventions,

        selectedCustomerId,
        setSelectedCustomerId,
        selectedCustomer,
        activeCustomerAnalysis,
        setActiveCustomerAnalysis,

        selectedStoreId,
        setSelectedStoreId,
        selectedStore,
        activeStorePlan,
        setActiveStorePlan,

        selectedOrderId,
        setSelectedOrderId,
        selectedOrder,

        resolveOrder,
        escalateOrder,
        contactStoreForOrder,
        notifyCustomerForOrder,
        markStoreActionPlanDone,
        applyCustomerIntervention,
        runCustomerAnalysis,

        tourStep,
        startJudgeTour,
        nextTourStep,
        prevTourStep,
        endJudgeTour,

        isBusinessImpactModalOpen,
        setIsBusinessImpactModalOpen,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
