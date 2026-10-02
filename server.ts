import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// ==========================================
// PERSISTENT USER DATABASE (data/users.json)
// ==========================================
const DATA_DIR = path.resolve(__dirname, 'data');
const USERS_FILE = path.resolve(DATA_DIR, 'users.json');

export interface StoredUser {
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

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadUsersFromDb(): StoredUser[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    // Seed initial users into database including the current user email
    const initialUsers: StoredUser[] = [
      {
        id: 'usr_owner_01',
        name: 'Thanmayi P',
        email: 'p.thanmayi09@gmail.com',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        role: 'Executive Admin',
        createdAt: '2026-09-01T08:00:00.000Z',
        lastLoginAt: new Date().toISOString(),
        loginCount: 5,
        provider: 'google',
      },
      {
        id: 'usr_ops_02',
        name: 'Aravind Subramanian',
        email: 'aravind.s@novacart.internal',
        picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        role: 'Area Operations Commander',
        createdAt: '2026-09-05T09:30:00.000Z',
        lastLoginAt: '2026-10-01T18:45:00.000Z',
        loginCount: 14,
        provider: 'google',
      },
      {
        id: 'usr_merchant_03',
        name: 'Ritu Nambiar',
        email: 'ritu.n@novacart.internal',
        picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        role: 'Merchant Success Lead',
        createdAt: '2026-09-10T11:15:00.000Z',
        lastLoginAt: '2026-10-01T16:20:00.000Z',
        loginCount: 9,
        provider: 'google',
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8');
    return initialUsers;
  }

  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading users database:', err);
    return [];
  }
}

function saveUsersToDb(users: StoredUser[]): void {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// Helper to decode Google JWT if supplied
function decodeGoogleJwt(token: string): { email?: string; name?: string; picture?: string; sub?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

// ==========================================
// AUTHENTICATION & USER DATABASE ENDPOINTS
// ==========================================

// Endpoint: Get All Remembered Users in Database
app.get('/api/auth/users', (req, res) => {
  const users = loadUsersFromDb();
  res.json({
    success: true,
    count: users.length,
    users,
    databaseFile: 'data/users.json',
  });
});

// Endpoint: Google Login & Sign In (Remember every user in database)
app.post('/api/auth/google', (req, res) => {
  const { credential, profile } = req.body;

  let email = '';
  let name = '';
  let picture = '';
  let googleId = '';

  if (credential) {
    const decoded = decodeGoogleJwt(credential);
    if (decoded && decoded.email) {
      email = decoded.email;
      name = decoded.name || email.split('@')[0];
      picture = decoded.picture || '';
      googleId = decoded.sub || '';
    }
  }

  if (!email && profile) {
    email = profile.email;
    name = profile.name || email.split('@')[0];
    picture = profile.picture || '';
    googleId = profile.googleId || profile.sub || '';
  }

  if (!email) {
    return res.status(400).json({ success: false, error: 'Valid Google email is required' });
  }

  const users = loadUsersFromDb();
  const normalizedEmail = email.toLowerCase().trim();
  let existingIndex = users.findIndex(u => u.email.toLowerCase().trim() === normalizedEmail);

  let targetUser: StoredUser;

  if (existingIndex !== -1) {
    // User already in database -> Update login telemetry and profile details
    users[existingIndex].lastLoginAt = new Date().toISOString();
    users[existingIndex].loginCount = (users[existingIndex].loginCount || 1) + 1;
    if (name) users[existingIndex].name = name;
    if (picture) users[existingIndex].picture = picture;
    if (googleId) users[existingIndex].googleId = googleId;
    targetUser = users[existingIndex];
  } else {
    // New user -> Persist in database
    targetUser = {
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: name || email.split('@')[0],
      email: normalizedEmail,
      picture: picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      role: normalizedEmail.includes('admin') || normalizedEmail.includes('thanmayi') ? 'Executive Admin' : 'Retention Analyst',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      loginCount: 1,
      googleId: googleId || undefined,
      provider: 'google',
    };
    users.unshift(targetUser);
  }

  saveUsersToDb(users);

  res.json({
    success: true,
    message: 'User authenticated and saved to database',
    user: targetUser,
    totalRegisteredUsers: users.length,
    databaseFile: 'data/users.json',
  });
});

// Endpoint: Manual/Direct Sign In
app.post('/api/auth/manual', (req, res) => {
  const { email, name, role } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email required' });
  }

  const users = loadUsersFromDb();
  const normalizedEmail = email.toLowerCase().trim();
  let existingIndex = users.findIndex(u => u.email.toLowerCase().trim() === normalizedEmail);

  let targetUser: StoredUser;

  if (existingIndex !== -1) {
    users[existingIndex].lastLoginAt = new Date().toISOString();
    users[existingIndex].loginCount = (users[existingIndex].loginCount || 1) + 1;
    if (name) users[existingIndex].name = name;
    if (role) users[existingIndex].role = role;
    targetUser = users[existingIndex];
  } else {
    targetUser = {
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: name || email.split('@')[0],
      email: normalizedEmail,
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      role: role || 'Retention Analyst',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      loginCount: 1,
      provider: 'email',
    };
    users.unshift(targetUser);
  }

  saveUsersToDb(users);

  res.json({
    success: true,
    message: 'User remembered in database',
    user: targetUser,
    totalRegisteredUsers: users.length,
  });
});

// Endpoint: Delete a user (for database management)
app.delete('/api/auth/users/:id', (req, res) => {
  const { id } = req.params;
  let users = loadUsersFromDb();
  const initialLen = users.length;
  users = users.filter(u => u.id !== id);
  if (users.length === initialLen) {
    return res.status(404).json({ success: false, error: 'User not found in database' });
  }
  saveUsersToDb(users);
  res.json({ success: true, message: 'User removed from database', remaining: users.length });
});

// ==========================================
// GEMINI AI & BUSINESS LOGIC ENDPOINTS
// ==========================================

const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  } catch (e) {
    console.warn('Could not initialize GoogleGenAI client:', e);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const users = loadUsersFromDb();
  res.json({
    status: 'ok',
    product: 'NOVA PULSE',
    aiEnabled: Boolean(aiClient),
    usersInDatabase: users.length,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: AI Customer Risk Analysis
app.post('/api/ai/analyze-customer', async (req, res) => {
  const { customer } = req.body;
  if (!customer) {
    return res.status(400).json({ error: 'Customer data required' });
  }

  if (aiClient) {
    try {
      const prompt = `You are the lead retention operations analyst for NOVA CART.
Analyze this at-risk customer profile:
Customer: ${customer.name} (${customer.city})
Total Orders: ${customer.totalOrders}, Lifetime Value: ₹${customer.lifetimeValue}
Acquisition Channel: ${customer.acquisitionChannel} (First order discount: ${customer.firstOrderDiscountPercent}%)
Cancelled Orders: ${customer.cancelledOrdersCount}
Delivery Delays: ${customer.deliveryDelayedOrdersCount}
Unavailable Product Encounters: ${customer.unavailableProductOrdersCount}
Support Tickets: ${customer.supportTicketsCount}, Refunds: ${customer.refundsCount}
Last Order: ${customer.lastOrderDate}

Context Rule: Case evidence shows large first-order discounts do not produce long-term retention. Do NOT recommend blanket discount vouchers. Focus on Reliability Recovery, product availability assurances, or SLA punctuality.

Return strict JSON only:
{
  "score": <number 0-100>,
  "level": <"High"|"Medium"|"Low">,
  "topDrivers": [<3 short strings>],
  "evidence": [<3 evidence strings>],
  "recommendationType": <"Reliability Recovery"|"Availability Recovery"|"Store Capacity Intervention">,
  "recommendedActions": [<3-4 actionable steps>],
  "whyRecommended": <string explaining why this non-discount approach works>,
  "discountJustified": false,
  "discountRationale": <string explaining why discounts are withheld>
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ data: parsed, modelUsed: 'Gemini 2.5 Flash' });
      }
    } catch (err) {
      console.error('Gemini error during customer analysis, falling back to deterministic engine:', err);
    }
  }

  // Graceful fallback to deterministic response
  return res.json({ data: null, fallback: true });
});

// Endpoint: AI Store Action Plan
app.post('/api/ai/generate-store-plan', async (req, res) => {
  const { store } = req.body;
  if (!store) {
    return res.status(400).json({ error: 'Store data required' });
  }

  if (aiClient) {
    try {
      const prompt = `You are a merchant operations consultant for NOVA CART.
Generate a supportive, non-punitive action plan for this local partner store:
Store: ${store.name} (${store.city})
Category: ${store.category}
Health Score: ${store.healthScore}/100
Inventory Accuracy: ${store.inventoryAccuracy}%
Inventory Update Frequency: ${store.inventoryUpdateFrequency} (Last: ${store.lastInventoryUpdate})
Order Acceptance Rate: ${store.orderAcceptanceRate}%
Cancellation Rate: ${store.cancellationRate}%
Substitution Rate: ${store.substitutionRate}%
Busy Period Rejection Rate: ${store.busyPeriodRejectionRate}%

Guideline: Partner stores struggle because inventory maintenance is manual and queues are packed during walk-in rush hours (7-9 PM). Help stores instead of blaming them. Recommend rapid barcode scanning, auto-throttling during rushes, and demand forecasting.

Return strict JSON:
{
  "actions": [
    { "title": <string>, "description": <string>, "impact": <string> }
  ],
  "partnerSupportOffering": <string explaining NOVA CART on-ground support and zero merchant penalty>
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ data: parsed, modelUsed: 'Gemini 2.5 Flash' });
      }
    } catch (err) {
      console.error('Gemini error during store plan generation, falling back:', err);
    }
  }

  return res.json({ data: null, fallback: true });
});

// Endpoint: AI Strategic Insights Copilot
app.post('/api/ai/ask-insights', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question required' });
  }

  if (aiClient) {
    try {
      const prompt = `You are the executive strategic analyst for NOVA CART's NOVA PULSE platform.
Respond concisely and authoritatively to this leadership inquiry:
Question: "${question}"

Core Case Facts:
- 620 local stores, 120k registered users (up from 82k), 46k MAU, 38.5k orders/mo, ₹486 AOV, ₹26.1L revenue.
- Repeat purchase rate collapsed from 41% to 27%.
- Average delivery time stretched from 29 to 37 minutes.
- Order cancellations jumped from 6% to 11% (35% due to unavailable stock, 27% delivery delay, 18% store rejection).
- Monthly support tickets increased from 3,100 to 5,900.
- Monthly promotional spend surged from ₹9.5L to ₹17.0L (44% of coupons unredeemed).
- Pilot budget constraint: ₹25 Lakhs across 6 months.

Tone: Executive, analytical, data-grounded, zero buzzwords. Provide clear root cause analysis and operational recommendations.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text;
      if (text) {
        return res.json({
          answer: text,
          modelUsed: 'Gemini 2.5 Flash',
          sources: ['NOVA CART Verified Telemetry', 'Merchant Operations Audit', 'Customer Survey Data'],
        });
      }
    } catch (err) {
      console.error('Gemini query error, using deterministic fallback:', err);
    }
  }

  return res.json({ answer: null, fallback: true });
});

// ==========================================
// VITE SPA & STATIC ASSETS HANDLER
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Mount Vite middlewares AFTER API routes so /api/* is handled by Express
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NOVA PULSE running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
