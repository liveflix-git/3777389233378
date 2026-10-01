import { 
  ApifyInstagramProvider, 
  normalizeUsername,
  normalizeApifyProfile,
  type InstagramProfileData, 
  type InstagramProfileResult, 
  type InstagramProfileProvider,
  type RelatedProfileItem,
  type LatestPostItem,
  type DataOrigin
} from './providers/apifyInstagramProvider.js';

export { 
  normalizeUsername,
  normalizeApifyProfile,
  type InstagramProfileData, 
  type InstagramProfileResult, 
  type InstagramProfileProvider,
  type RelatedProfileItem,
  type LatestPostItem,
  type DataOrigin
};

export const normalizeInstagramUsername = normalizeUsername;

export interface CachedImage {
  buffer: Buffer;
  contentType: string;
  timestamp: number;
}

// In-memory cache strictly under:
// instagram_profile:{normalizedUsername}
// TTL: 15 minutes
const PROFILE_CACHE_TTL = 15 * 60 * 1000;
const IMAGE_CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours

const profileCache = new Map<string, { data: InstagramProfileData; timestamp: number }>();
const imageCache = new Map<string, CachedImage>();

// Primary Provider: danek/instagram-profiles-scraper-ppr via Apify
const apifyProvider: InstagramProfileProvider = new ApifyInstagramProvider();

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
 * 2. Consults Apify actor danek/instagram-profiles-scraper-ppr
 * 3. Enforces strict exact username match
 * 4. Proxies image if available
 */
export async function resolveInstagramProfile(input: string): Promise<InstagramProfileResult> {
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
    return {
      status: 'SUCCESS',
      data: cached.data,
    };
  }

  // Real Apify provider execution
  const result = await apifyProvider.getProfile(requested);

  if (result.status === 'SUCCESS') {
    const data = result.data;
    const returned = normalizeUsername(data.username);

    // VALIDAÇÃO ABSOLUTA
    if (requested !== returned) {
      console.error(`[InstagramLookup] PROFILE_MISMATCH - requested: ${requested}, returned: ${returned}`);
      throw new Error('PROFILE_MISMATCH');
    }

    // Se houver URL da foto real, pré-carrega no cache para disponibilizar na rota /api/instagram/profile-image
    if (data.profilePicture) {
      // Async pre-fetch into memory buffer
      fetchAndCacheProfileImage(requested, data.profilePicture).catch(() => {});
    }

    // Salva no cache com chave estrita instagram_profile:{normalizedUsername}
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
