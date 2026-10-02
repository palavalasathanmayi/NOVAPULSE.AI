# NOVA PULSE — Retention & Reliability Command Center

> **PromptWars Business Rescue Challenge**  
> *"Turn operational friction into customer retention."*  
> **Target:** NOVA CART Quick-Commerce Operations  
> **Constraint:** ₹25 Lakh Six-Month Capital Budget

---

## 1. Executive Problem Diagnosis: The Growth Paradox

NOVA CART has exhibited strong top-of-funnel customer acquisition across 620 local stores in Bengaluru, Mumbai, and Delhi-NCR, but the business is caught in a critical **Leaking Bucket Trap**:

| Metric | 6 Months Ago | Current Baseline | Trend & Status | Business Reality |
| :--- | :--- | :--- | :--- | :--- |
| **Registered Users** | 82,000 | **120,000** | ↑ +46.3% | Healthy top-of-funnel ad campaigns |
| **MAU** | 39,000 | **46,000** | ↑ +17.9% | Active users lag total signups (54% 1st order → 31% 2nd order) |
| **Monthly Orders** | 31,200 | **38,500** | ↑ +23.4% | Driven by one-off trial coupon codes |
| **AOV** | ₹452 | **₹486** | ↑ +7.5% | Larger basket size makes failed orders costlier |
| **Repeat Purchase** | **41%** | **27%** | **↓ -14% pts (Critical)** | **Customer loyalty collapsed after bad SLA** |
| **Avg Delivery Time** | 29 min | **37 min** | **↑ +8 min (Critical)** | 13% of orders delivered >15 min late |
| **Cancellation Rate** | 6% | **11%** | **↑ Nearly doubled** | 1 in 9 orders fails before arrival |
| **Support Tickets** | 3,100 / mo | **5,900 / mo** | **↑ +90.3%** | Overwhelmed CX, 29% refund inquiries, 9.2h resolution |
| **Promotional Spend** | ₹9.5 Lakhs | **₹17.0 Lakhs** | **↑ +78.9% (Caution)** | 58% spent on acquisition; 44% coupons never redeemed |
| **Net Revenue** | ₹21.8 Lakhs | **₹26.1 Lakhs** | ↑ +19.7% | Topline masks margin compression |

### Critical Behavioral & Operational Evidence
1. **61% of churned customers previously rated NOVA CART 4★+**: High-intent buyers are leaving due to fulfillment trauma, not price sensitivity.
2. **The Magic 3-Order Threshold**: Customers completing 3 orders have a **72% probability** of ordering next month. Protecting orders #2 and #3 is the primary retention battleground.
3. **Product Availability (35% of cancellations)**: Partner stores update inventory every 1–3 days. Walk-in shoppers deplete physical shelf stock, while the app continues selling phantom items.
4. **Delivery SLA Breaches (27% of cancellations)**: Store prep delays (searching backrooms for missing stock) add 15–20 minutes before rider pickup.
5. **Store Rush Rejections (18% of cancellations)**: 23% of partner stores reject online orders during peak walk-in rush hours (7:00 PM – 9:30 PM).
6. **Management's +30% Budget Dilemma**: Management is considering expanding marketing spend by 30% (+₹5.1L to ₹22.1L/mo). Without fixing reliability, this accelerates churn and erodes unit margins.

---

## 2. Core Business Hypothesis & The 6-Stage Workflow

NOVA CART's central challenge is not acquiring customers; it is an operational reliability defect spanning **CUSTOMER + ORDER + STORE + INVENTORY + DELIVERY + SUPPORT**.

NOVA PULSE connects these signals across NOVA CART's **8 existing systems** (Customer App, Web Portal, Partner Terminal, Order DB, Customer DB, Delivery GPS, Payment Gateway, Promotions Engine) and converts them into an automated closed-loop operating system:

```
DETECT   → Rule-Based Risk Engine (30% Inactivity, 25% Cancels, 20% Delays, 15% Stockouts, 10% CX)
   ↓
EXPLAIN  → 8-Node Causal Graph (Customer → Order → Product → Store → Stale Inventory → Retention Risk)
   ↓
RECOMMEND→ Targeted Non-Discount Reliability Recovery (SLA Guarantee, Multi-Category, No Blanket Coupons)
   ↓
ACT      → Partner Store Rapid Barcode Sync (90-sec audit) & Peak-Hour Dynamic Auto-Throttling
   ↓
RESOLVE  → Real-Time Operations Interception (Resolve, Escalate, Contact Store, Notify Customer)
   ↓
MEASURE  → 30-Day Cohort Repeat Purchase & Financial Payback on ₹25 Lakh Six-Month Constraint (~6.5 Mo)
```

---

## 3. The 7 Core Application Pages

1. **Command Center (`/`)**: Executive KPI dashboard, historical trend divergence charts (Recharts), and "Why This Matters" diagnosis banner.
2. **Customer Rescue (`/customer-rescue`)**: Registry of at-risk customers, transparent rule-based risk score (0–100), top 3 drivers, evidence, and non-discount Reliability Recovery plans.
3. **Root Cause Explorer (`/root-causes`)**: Interactive 8-node causal pipeline showing failure propagation from physical kirana stockout to brand churn.
4. **Store Intelligence (`/store-intelligence`)**: Store health scorecard, 90-second rapid barcode audit tool, and merchant empathy enablement (supporting stores, not blaming them).
5. **Operations Command (`/operations`)**: Real-time at-risk order triage table, item breakdowns, and working operational buttons (*Resolve*, *Escalate*, *Contact Store*, *Notify Customer*).
6. **AI Strategic Insights (`/ai-insights`)**: Curated executive insights structured as `INSIGHT → EVIDENCE → IMPLICATION → ACTION`, with an interactive Gemini-powered query copilot.
7. **Scenario Simulator (`/scenario-simulator`)**: Interactive "What If?" sliders modeling delivery time, cancellations, inventory accuracy, and promotional spend reallocation.

---

## 4. The 7-Step Judge Demonstration Script

Click **"Judge Demo Tour"** in the top navigation bar to launch the guided walkthrough:

1. **Step 1: Command Center**  
   *Say:* "NOVA CART is growing, but the quality of growth is deteriorating."  
   *Point to:* Repeat purchase (41% → 27%), Delivery time (29 → 37 min), Cancellations (6% → 11%), Support tickets (3,100 → 5,900).
2. **Step 2: Root Causes**  
   *Show:* Availability (35%) + Delivery delays (27%) + Store operations (18%) driving 80% of lost orders.
3. **Step 3: Customer Rescue**  
   *Select:* **Priya Sharma**. Click **Analyze Customer**. Show **82/100 risk**, top drivers, and **Reliability Recovery** recommendation. Emphasize why discounts are withheld.
4. **Step 4: Store Intelligence**  
   *Select:* **Local Mart Indiranagar** (Health: 61/100, inventory 2 days stale). Click **Generate Action Plan**, then click **Mark Actioned** to observe real state change (+12 pts).
5. **Step 5: Operations Command**  
   *Select:* Order **#NC10482** (Priya Sharma at Local Mart, ₹684). Click **Resolve**; observe status change to *Resolved*, dashboard ticket closure, and toast confirmation.
6. **Step 6: Scenario Simulator**  
   *Demonstrate:* "What happens if we improve reliability instead of simply increasing promotions?"  
   *Adjust:* Delivery (37 → 30m), Cancel (11% → 7%), Inventory (70% → 90%), Promo (₹17L → ₹12L). Show Repeat Purchase recovering to ~34% and net margins turning positive.
7. **Step 7: Business Impact & Budget**  
   *Review:* 8 baseline vs target KPIs, and the ₹25 Lakh budget allocation across 4 phases.

---

## 5. Business Impact & ₹25 Lakh Budget Allocation

Strictly bounded within the **₹25 Lakh six-month capital constraint**:

- **Phase 1 (Month 1-2) — Data Integration & Command Center (₹7.5 Lakhs)**: POS/tally sync across 100 pilot stores; telemetry dashboards.
- **Phase 2 (Month 2-3) — Customer Risk & Root Cause Engine (₹6.5 Lakhs)**: Transparent 5-factor risk scoring; automated recovery dispatches.
- **Phase 3 (Month 3-4) — Store Intelligence & Operations Workflows (₹5.5 Lakhs)**: Merchant mobile app with 90-sec stock audit; peak-hour auto-throttling.
- **Phase 4 (Month 5-6) — Pilot Rollout & KPI Measurement (₹5.5 Lakhs)**: Expansion across 250 stores in Bengaluru, Mumbai, and Delhi-NCR; cohort retention audit.

**Payback Horizon:**  
Avoided order cancellation salvage + support refund reduction + ₹5.5L/mo savings from trimmed coupon subsidies recover the ₹25 Lakh investment in **~6.5 months**.

---

## 6. Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Motion.
- **Backend / API**: Express fullstack server with Vite middleware mode in development (`server.ts`).
- **AI Layer**: Google GenAI SDK (`@google/genai`) with Gemini 2.5 Flash, backed by an instant deterministic business logic engine when offline or unkeyed.
- **Data Layer**: Clean in-memory interconnected relational model (Customers, Stores, Products, Inventory, Orders, Deliveries, Tickets, Interventions).
- **Deployment**: Vercel and Google Cloud Run ready (`npm run build`, `npm run start`).

---

## 7. Setup & Run Instructions

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional - system falls back deterministically if no key is provided)
cp .env.example .env
# Set GEMINI_API_KEY="your_api_key"

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Start production server
npm run start
```
