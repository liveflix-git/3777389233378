import fs from 'node:fs';
import path from 'node:path';
import { normalizeUsername, type RelatedInstagramProfile } from './providers/apifyInstagramProvider.js';

export type RelationSourceType = 'apify' | 'yep-similar';

export interface RelationCacheEntry {
  seed_username: string;
  related_username: string;
  related_full_name?: string;
  profile_picture?: string;
  is_verified?: boolean;
  is_private?: boolean;
  source: RelationSourceType;
  confidence: number;
  first_seen_at: number;
  last_seen_at: number;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const CACHE_FILE = path.join(DATA_DIR, 'instagram_relations.json');

class RelationCacheStore {
  private relations: Map<string, RelationCacheEntry[]> = new Map();
  private isLoaded = false;

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    if (this.isLoaded) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(CACHE_FILE)) {
        const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            this.addEntryToMap(item);
          }
        }
      }
    } catch (err) {
      console.warn('[RelationCacheStore] Failed to load cache from disk:', err);
    }
    this.isLoaded = true;
  }

  private saveToDisk(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const allEntries: RelationCacheEntry[] = [];
      for (const entries of this.relations.values()) {
        allEntries.push(...entries);
      }
      const trimmed = allEntries.slice(-5000);
      fs.writeFileSync(CACHE_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[RelationCacheStore] Failed to save cache to disk:', err);
    }
  }

  private addEntryToMap(entry: RelationCacheEntry): void {
    const normSeed = normalizeUsername(entry.seed_username);
    const normRel = normalizeUsername(entry.related_username);
    if (!normSeed || !normRel || normSeed === normRel) return;

    const list = this.relations.get(normSeed) || [];
    const idx = list.findIndex(e => normalizeUsername(e.related_username) === normRel);
    if (idx >= 0) {
      const existing = list[idx];
      existing.last_seen_at = Date.now();
      if (entry.confidence >= existing.confidence) {
        existing.confidence = entry.confidence;
        existing.source = entry.source;
      }
      if (entry.profile_picture && !existing.profile_picture) {
        existing.profile_picture = entry.profile_picture;
      }
      if (entry.related_full_name && !existing.related_full_name) {
        existing.related_full_name = entry.related_full_name;
      }
      if (typeof entry.is_verified === 'boolean') {
        existing.is_verified = entry.is_verified;
      }
      if (typeof entry.is_private === 'boolean') {
        existing.is_private = entry.is_private;
      }
    } else {
      list.push({
        ...entry,
        seed_username: normSeed,
        related_username: normRel,
      });
      this.relations.set(normSeed, list);
    }
  }

  public recordApifyRelations(seedUser: string, relatedList: RelatedInstagramProfile[]): void {
    const normSeed = normalizeUsername(seedUser);
    if (!normSeed || !Array.isArray(relatedList) || relatedList.length === 0) return;

    const now = Date.now();

    for (const rel of relatedList) {
      if (!rel || !rel.username) continue;
      const normRel = normalizeUsername(rel.username);
      if (!normRel || normRel === normSeed) continue;

      this.addEntryToMap({
        seed_username: normSeed,
        related_username: normRel,
        related_full_name: rel.fullName,
        profile_picture: rel.profilePicture,
        is_verified: rel.isVerified,
        is_private: rel.isPrivate,
        source: 'apify',
        confidence: 1.0,
        first_seen_at: now,
        last_seen_at: now,
      });
    }

    this.saveToDisk();
  }

  public recordYepRelations(seedUser: string, relatedList: RelatedInstagramProfile[]): void {
    const normSeed = normalizeUsername(seedUser);
    if (!normSeed || !Array.isArray(relatedList) || relatedList.length === 0) return;

    const now = Date.now();

    for (const rel of relatedList) {
      if (!rel || !rel.username) continue;
      const normRel = normalizeUsername(rel.username);
      if (!normRel || normRel === normSeed) continue;

      this.addEntryToMap({
        seed_username: normSeed,
        related_username: normRel,
        related_full_name: rel.fullName,
        profile_picture: rel.profilePicture,
        is_verified: rel.isVerified,
        is_private: rel.isPrivate,
        source: 'yep-similar',
        confidence: 0.90,
        first_seen_at: now,
        last_seen_at: now,
      });
    }

    this.saveToDisk();
  }

  public getDirectRelations(seedUser: string): RelationCacheEntry[] {
    const normSeed = normalizeUsername(seedUser);
    if (!normSeed) return [];
    return [...(this.relations.get(normSeed) || [])];
  }

  /**
   * Strictly returns relations associated with the specified username ONLY.
   */
  public getRelationsForUser(seedUser: string): RelatedInstagramProfile[] {
    const direct = this.getDirectRelations(seedUser);
    return direct.map(e => ({
      username: e.related_username,
      fullName: e.related_full_name,
      profilePicture: e.profile_picture,
      isVerified: e.is_verified,
      isPrivate: e.is_private,
    }));
  }
}

export const relationCache = new RelationCacheStore();
