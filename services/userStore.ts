import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  username: string;
  displayName: string;
  credits: number;
  xp: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'BONUS' | 'DEBIT' | 'REFUND' | 'PURCHASE';
  amount: number;
  service: string;
  createdAt: string;
}

export interface StoreData {
  users: Record<string, UserRecord>;
  transactions: CreditTransaction[];
}

export const SERVICE_COSTS = {
  instagram: 0,
  whatsapp: 40,
  facebook: 45,
  location: 60,
  sms: 30,
  calls: 25,
  camera: 55,
  otherNetworks: 70,
} as const;

export type ServiceName = keyof typeof SERVICE_COSTS;

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_FILE = path.resolve(DATA_DIR, 'users_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read store from file safely
function readStore(): StoreData {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        users: parsed.users || {},
        transactions: parsed.transactions || [],
      };
    }
  } catch (err) {
    console.error('[UserStore] Error reading store file:', err);
  }

  return { users: {}, transactions: [] };
}

// Helper to write store to file atomically
function writeStore(data: StoreData): void {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[UserStore] Error writing store file:', err);
  }
}

/**
 * Gets an existing user by ID or creates a brand new user with 200 initial credits ONCE.
 * Guarantees that subsequent calls or relogins for an existing userId WILL NOT overwrite or add credits.
 */
export function getOrCreateUser(
  userId: string,
  displayName = 'Felipe',
  username = 'felipe'
): { user: UserRecord; isNew: boolean } {
  const store = readStore();
  const cleanId = userId?.trim().toLowerCase() || 'default_user';

  // Check if admin user
  if (cleanId === 'admin@admin.com' || cleanId === 'admin_user' || cleanId === 'admin') {
    const adminUser: UserRecord = {
      id: 'admin@admin.com',
      username: 'admin',
      displayName: 'Administrador',
      credits: 99999,
      xp: 9999,
      level: 99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.users['admin@admin.com'] = adminUser;
    writeStore(store);
    return { user: adminUser, isNew: false };
  }

  if (store.users[cleanId]) {
    return { user: store.users[cleanId], isNew: false };
  }

  // Create new user record with 200 initial credits
  const now = new Date().toISOString();
  const newUser: UserRecord = {
    id: cleanId,
    username: username || cleanId,
    displayName: displayName || 'Felipe',
    credits: 200,
    xp: 0,
    level: 1,
    createdAt: now,
    updatedAt: now,
  };

  // Record initial welcome bonus transaction
  const initialTransaction: CreditTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: cleanId,
    type: 'BONUS',
    amount: 200,
    service: 'WELCOME_BONUS',
    createdAt: now,
  };

  store.users[cleanId] = newUser;
  store.transactions.push(initialTransaction);

  writeStore(store);

  return { user: newUser, isNew: true };
}

/**
 * Retrieves a user record by ID.
 */
export function getUser(userId: string): UserRecord | null {
  const store = readStore();
  return store.users[userId] || null;
}

/**
 * Atomically deducts credits for a requested service if user has sufficient balance.
 */
export function spendCredits(
  userId: string,
  service: ServiceName
): { success: boolean; newBalance?: number; cost?: number; error?: string } {
  const store = readStore();
  const user = store.users[userId];

  if (!user) {
    return { success: false, error: 'USER_NOT_FOUND' };
  }

  const cost = SERVICE_COSTS[service] ?? 0;

  if (cost === 0) {
    return { success: true, newBalance: user.credits, cost: 0 };
  }

  if (user.credits < cost) {
    return {
      success: false,
      newBalance: user.credits,
      cost,
      error: 'INSUFFICIENT_CREDITS',
    };
  }

  // Deduct credits and update record
  const now = new Date().toISOString();
  user.credits -= cost;
  user.updatedAt = now;

  const debitTransaction: CreditTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    type: 'DEBIT',
    amount: cost,
    service,
    createdAt: now,
  };

  store.transactions.push(debitTransaction);
  writeStore(store);

  return { success: true, newBalance: user.credits, cost };
}

/**
 * Atomically deducts a custom amount of credits for an action (e.g. analysis acceleration).
 */
export function spendCreditsAmount(
  userId: string,
  amount: number,
  serviceLabel: string
): { success: boolean; newBalance?: number; cost?: number; error?: string } {
  const store = readStore();
  const user = store.users[userId];

  if (!user) {
    return { success: false, error: 'USER_NOT_FOUND' };
  }

  if (amount <= 0) {
    return { success: true, newBalance: user.credits, cost: 0 };
  }

  if (user.credits < amount) {
    return {
      success: false,
      newBalance: user.credits,
      cost: amount,
      error: 'INSUFFICIENT_CREDITS',
    };
  }

  const now = new Date().toISOString();
  user.credits -= amount;
  user.updatedAt = now;

  const debitTransaction: CreditTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    type: 'DEBIT',
    amount,
    service: serviceLabel,
    createdAt: now,
  };

  store.transactions.push(debitTransaction);
  writeStore(store);

  return { success: true, newBalance: user.credits, cost: amount };
}

/**
 * Retrieves transaction history for a user.
 */
export function getUserTransactions(userId: string): CreditTransaction[] {
  const store = readStore();
  return store.transactions.filter((tx) => tx.userId === userId);
}
