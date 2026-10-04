import { 
  ApifyInstagramProvider, 
  normalizeUsername,
  normalizeApifyProfile,
  type InstagramProfileData, 
  type InstagramProfileResult, 
  type InstagramProfileProvider,
  type RelatedProfileItem,
  type RelatedInstagramProfile,
  type LatestPostItem,
  type DataOrigin
} from './providers/apifyInstagramProvider.js';
import { 
  yepSimilarProfilesProvider,
  type PublicPreviewMediaResult 
} from './providers/yepSimilarProfilesProvider.js';
import { relationCache } from './relationCache.js';

export { 
  normalizeUsername,
  normalizeApifyProfile,
  type InstagramProfileData, 
  type InstagramProfileResult, 
  type InstagramProfileProvider,
  type RelatedProfileItem,
  type RelatedInstagramProfile,
  type LatestPostItem,
  type DataOrigin,
  type PublicPreviewMediaResult
};

export const normalizeInstagramUsername = normalizeUsername;

export interface CachedImage {
  buffer: Buffer;
  contentType: string;
  timestamp: number;
}

// In-memory cache strictly under instagram_profile:{normalizedUsername}
// TTL: 15 minutes
const PROFILE_CACHE_TTL = 15 * 60 * 1000;
const IMAGE_CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours

const profileCache = new Map<string, { data: InstagramProfileData; timestamp: number }>();
const imageCache = new Map<string, CachedImage>();

// Primary Provider: apify/instagram-profile-scraper
const apifyProvider: InstagramProfileProvider = new ApifyInstagramProvider();

/**
 * Merges and prioritizes related profiles:
 * 1. Real relatedProfiles from Apify (confidence: 1.0)
 * 2. Real similar profiles from YepAPI (confidence: 0.9)
 * Strictly deduplicated, excludes target username, and limited to 12.
 */
export function mergeRelatedProfiles(
  targetUsername: string,
  apifyList: RelatedInstagramProfile[] = [],
  yepList: RelatedInstagramProfile[] = []
): RelatedInstagramProfile[] {
  const normTarget = normalizeUsername(targetUsername);
  const seen = new Set<string>();
  if (normTarget) seen.add(normTarget);

  const merged: RelatedInstagramProfile[] = [];

  // Priority 1: Real Apify direct related profiles
  for (const p of apifyList) {
    if (!p || !p.username) continue;
    const u = normalizeUsername(p.username);
    if (!u || seen.has(u)) continue;
    seen.add(u);
    merged.push(p);
    if (merged.length >= 12) return merged;
  }

  // Priority 2: Real YepAPI similar profiles
  for (const p of yepList) {
    if (!p || !p.username) continue;
    const u = normalizeUsername(p.username);
    if (!u || seen.has(u)) continue;
    seen.add(u);
    merged.push(p);
    if (merged.length >= 12) return merged;
  }

  return merged;
}

export const mergeRelatedCandidates = mergeRelatedProfiles;

/**
 * Downloads and caches the real profile picture bytes from Instagram / CDN
 */
export async function fetchAndCacheProfileImage(username: string, remoteUrl: string): Promise<CachedImage | null> {
  const normUser = normalizeUsername(username);
  const cacheKey = `instagram_profile_image:${normUser}`;

  const cached = imageCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < IMAGE_CACHE_TTL) {
    return cached;
  }

  if (!remoteUrl || !remoteUrl.startsWith('http')) {
    return null;
  }

  try {
    const res = await fetch(remoteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://www.instagram.com/',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.error(`[ProfileImageProxy] Erro ao baixar foto remota (${res.status}) para @${normUser}`);
      return null;
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const arrayBuf = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    const imageEntry: CachedImage = {
      buffer,
      contentType,
      timestamp: Date.now(),
    };

    imageCache.set(cacheKey, imageEntry);
    return imageEntry;
  } catch (err) {
    console.error(`[ProfileImageProxy] Falha de conexão ao baixar imagem para @${normUser}:`, err);
    return null;
  }
}

export function getCachedImage(username: string): CachedImage | null {
  const normUser = normalizeUsername(username);
  const cacheKey = `instagram_profile_image:${normUser}`;
  const cached = imageCache.get(cacheKey);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > IMAGE_CACHE_TTL) {
    imageCache.delete(cacheKey);
    return null;
  }
  return cached;
}

export function getCachedProfile(username: string): InstagramProfileData | null {
  const normUser = normalizeUsername(username);
  const cacheKey = `instagram_profile:${normUser}`;
  const cached = profileCache.get(cacheKey);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > PROFILE_CACHE_TTL) {
    profileCache.delete(cacheKey);
    return null;
  }
  return cached.data;
}

/**
 * Main resolution function:
 * 1. Checks cache instagram_profile:{normalizedUsername}
 * 2. Consults Apify provider (primary profile data)
 * 3. Enforces strict exact username match
 * 4. If relatedProfiles.length < 7, calls YepAPI dynamically with current requested username
 * 5. Merges Apify + YepAPI (max 12), saves strictly isolated cache
 * 6. Proxies image if available
 */
export async function resolveInstagramProfile(
  input: string,
  yepApiKeyOverride?: string
): Promise<InstagramProfileResult> {
  const requested = normalizeUsername(input);

  if (!requested || requested.length < 2) {
    return {
      status: 'UNAVAILABLE',
      reason: 'INVALID_USERNAME',
    };
  }

  const cacheKey = `instagram_profile:${requested}`;
  const cached = profileCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < PROFILE_CACHE_TTL) {
    console.log(`[InstagramLookup] Cache hit para: instagram_profile:${requested}`);
    const data = { ...cached.data };
    if (data.profilePicture && data.profilePicture.startsWith('http')) {
      data.profilePicture = `/api/instagram/profile-image?url=${encodeURIComponent(data.profilePicture)}`;
    }
    return {
      status: 'SUCCESS',
      data,
    };
  }

  // 1. Apify primary lookup
  const result = await apifyProvider.getProfile(requested);

  if (result.status === 'SUCCESS') {
    const data = result.data;
    const returned = normalizeUsername(data.username);

    // Strict validation
    if (requested !== returned) {
      console.error(`[InstagramLookup] PROFILE_MISMATCH - requested: ${requested}, returned: ${returned}`);
      throw new Error('PROFILE_MISMATCH');
    }

    const apifyRelated = Array.isArray(data.relatedProfiles) ? data.relatedProfiles : [];

    // Save Apify related profiles in cache strictly for this seed_username
    if (apifyRelated.length > 0) {
      relationCache.recordApifyRelations(requested, apifyRelated);
    }

    let resolvedRelated: RelatedInstagramProfile[] = apifyRelated;
    let yepCount = 0;
    let yepRequestUsername: string | null = null;

    // 2. If Apify relatedProfiles < 7, call YepAPI dynamically with current username
    if (apifyRelated.length < 7) {
      yepRequestUsername = requested;
      try {
        const yepSimilar = await yepSimilarProfilesProvider.fetchYepSimilarProfiles(requested, yepApiKeyOverride);
        yepCount = yepSimilar.length;
        if (yepSimilar.length > 0) {
          relationCache.recordYepRelations(requested, yepSimilar);
          resolvedRelated = mergeRelatedProfiles(requested, apifyRelated, yepSimilar);
        } else {
          // Fallback to cache strictly for this seed_username
          const cachedForUser = relationCache.getRelationsForUser(requested);
          resolvedRelated = mergeRelatedProfiles(requested, apifyRelated, cachedForUser);
        }
      } catch (yepErr) {
        console.warn(`[YepAPI] Error querying YepAPI for @${requested}:`, yepErr);
        const cachedForUser = relationCache.getRelationsForUser(requested);
        resolvedRelated = mergeRelatedProfiles(requested, apifyRelated, cachedForUser);
      }
    } else {
      resolvedRelated = mergeRelatedProfiles(requested, apifyRelated, []);
    }

    data.relatedProfiles = resolvedRelated;

    // Structured logging for debugging
    console.log(`[RELATED DEBUG]
searchedUsername: ${requested}
apifyCount: ${apifyRelated.length}
yepRequestUsername: ${yepRequestUsername ?? 'NOT_CALLED (Apify >= 7)'}
yepCount: ${yepCount}
mergedCount: ${resolvedRelated.length}
firstFiveUsernames: ${JSON.stringify(resolvedRelated.slice(0, 5).map(p => p.username))}`);

    // Optional: Fetch up to 2 public preview media images from public related profiles (MAX_PUBLIC_MEDIA_LOOKUPS = 2)
    const publicRelated = resolvedRelated.filter(p => !p.isPrivate);
    const mediaLookups = publicRelated.slice(0, 2);
    if (mediaLookups.length > 0) {
      try {
        const mediaPromises = mediaLookups.map(p =>
          yepSimilarProfilesProvider.fetchPublicPreviewMedia(p.username, yepApiKeyOverride)
        );
        const mediaResults = (await Promise.allSettled(mediaPromises))
          .filter((r): r is PromiseFulfilledResult<PublicPreviewMediaResult | null> => r.status === 'fulfilled' && Boolean(r.value))
          .map(r => r.value!);

        if (mediaResults.length > 0) {
          (data as any).publicPreviewMedia = mediaResults;
        }
      } catch {
        // Non-blocking
      }
    }

    // Pre-cache profile picture if available
    if (data.profilePicture) {
      const remoteUrl = data.profilePicture.startsWith('/api/instagram/') 
        ? null 
        : data.profilePicture;
      if (remoteUrl) {
        fetchAndCacheProfileImage(requested, remoteUrl).catch(() => {});
        data.profilePicture = `/api/instagram/profile-image?url=${encodeURIComponent(remoteUrl)}`;
      }
    }

    // Save strictly under instagram_profile:{normalizedUsername}
    profileCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return {
      status: 'SUCCESS',
      data,
    };
  }

  return result;
}

export const getInstagramProfile = resolveInstagramProfile;
