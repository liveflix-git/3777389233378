import fs from 'fs';
import path from 'path';
import { spendCreditsAmount } from './userStore.js';

export interface AnalysisRecord {
  id: string;
  userId: string;
  username: string;
  service: string; // 'instagram'
  status: 'PENDING' | 'ACCELERATED' | 'COMPLETED' | 'CANCELLED';
  currentStage: number; // 2..6. Stage 1 is completed. Total 6 stages.
  totalStages: number; // 6
  progress: number;
  accelerated: boolean; // true if ever accelerated at least once
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisStoreData {
  analyses: Record<string, AnalysisRecord>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_FILE = path.resolve(DATA_DIR, 'analysis_store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readStore(): AnalysisStoreData {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        analyses: parsed.analyses || {},
      };
    }
  } catch (err) {
    console.error('[AnalysisStore] Error reading store file:', err);
  }
  return { analyses: {} };
}

function writeStore(data: AnalysisStoreData): void {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[AnalysisStore] Error writing store file:', err);
  }
}

/**
 * Gets active (non-cancelled) analysis for user and service.
 */
export function getActiveAnalysis(userId: string, service = 'instagram'): AnalysisRecord | null {
  const store = readStore();
  const allUserAnalyses = Object.values(store.analyses).filter(
    (a) => a.userId === userId && a.service === service && a.status !== 'CANCELLED'
  );

  if (allUserAnalyses.length === 0) return null;

  // Sort by createdAt descending
  allUserAnalyses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const active = allUserAnalyses[0];

  // Ensure default currentStage and totalStages
  if (!active.currentStage) active.currentStage = 2;
  if (!active.totalStages) active.totalStages = 6;

  return active;
}

/**
 * Starts a new analysis if none is currently active for the user.
 */
export function startAnalysis(
  userId: string,
  username: string,
  service = 'instagram'
): { success: boolean; analysis?: AnalysisRecord; error?: string } {
  const existing = getActiveAnalysis(userId, service);
  if (existing) {
    return {
      success: false,
      analysis: existing,
      error: 'ALREADY_RUNNING',
    };
  }

  const store = readStore();
  const now = new Date().toISOString();
  const id = `an_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const newAnalysis: AnalysisRecord = {
    id,
    userId,
    username: username.trim().toLowerCase().replace(/^@/, ''),
    service,
    status: 'PENDING',
    currentStage: 2, // Stage 1 (Perfil localizado) completed immediately. Stage 2 is loading.
    totalStages: 6,
    progress: 3,
    accelerated: false,
    createdAt: now,
    updatedAt: now,
  };

  store.analyses[id] = newAnalysis;
  writeStore(store);

  return { success: true, analysis: newAnalysis };
}

/**
 * Accelerates an active analysis stage for 30 credits.
 * Concludes current active stage and moves to next stage.
 */
export function accelerateAnalysis(
  userId: string,
  service = 'instagram'
): { success: boolean; analysis?: AnalysisRecord; newBalance?: number; error?: string } {
  const active = getActiveAnalysis(userId, service);
  if (!active) {
    return { success: false, error: 'NO_ACTIVE_ANALYSIS' };
  }

  const store = readStore();
  const record = store.analyses[active.id];

  if (!record) {
    return { success: false, error: 'ANALYSIS_NOT_FOUND' };
  }

  // Ensure defaults
  const currentStage = record.currentStage || 2;
  const totalStages = record.totalStages || 6;

  if (record.status === 'COMPLETED' || currentStage > totalStages) {
    return {
      success: false,
      analysis: record,
      error: 'ANALYSIS_ALREADY_COMPLETED',
    };
  }

  // Atomically debit 30 credits from user
  const spendResult = spendCreditsAmount(userId, 30, 'instagram_acceleration');
  if (!spendResult.success) {
    return {
      success: false,
      error: spendResult.error || 'INSUFFICIENT_CREDITS',
      newBalance: spendResult.newBalance,
    };
  }

  const now = new Date().toISOString();
  const nextStage = currentStage + 1;
  record.accelerated = true;
  record.currentStage = nextStage;
  record.updatedAt = now;

  // Calculate new progress milestone based on next stage
  if (nextStage === 3) {
    record.progress = Math.max(record.progress, 22);
    record.status = 'ACCELERATED';
  } else if (nextStage === 4) {
    record.progress = Math.max(record.progress, 42);
    record.status = 'ACCELERATED';
  } else if (nextStage === 5) {
    record.progress = Math.max(record.progress, 62);
    record.status = 'ACCELERATED';
  } else if (nextStage === 6) {
    record.progress = Math.max(record.progress, 82);
    record.status = 'ACCELERATED';
  } else {
    // Stage > 6 -> All stages completed!
    record.progress = 100;
    record.status = 'COMPLETED';
  }

  writeStore(store);

  return {
    success: true,
    analysis: record,
    newBalance: spendResult.newBalance,
  };
}

/**
 * Cancels active analysis.
 */
export function cancelAnalysis(userId: string, service = 'instagram'): { success: boolean } {
  const store = readStore();
  const active = getActiveAnalysis(userId, service);
  if (active && store.analyses[active.id]) {
    store.analyses[active.id].status = 'CANCELLED';
    store.analyses[active.id].updatedAt = new Date().toISOString();
    writeStore(store);
  }
  return { success: true };
}

/**
 * Updates progress % for an active analysis.
 */
export function updateAnalysisProgress(
  userId: string,
  service = 'instagram',
  progress: number
): AnalysisRecord | null {
  const store = readStore();
  const active = getActiveAnalysis(userId, service);
  if (active && store.analyses[active.id]) {
    store.analyses[active.id].progress = Math.max(store.analyses[active.id].progress, progress);
    store.analyses[active.id].updatedAt = new Date().toISOString();
    writeStore(store);
    return store.analyses[active.id];
  }
  return null;
}
