export type DataOrigin = 'provider' | 'placeholder' | 'ui-preview';

export interface RelatedProfileItem {
  origin: 'provider';
  username: string;
  fullName: string | null;
  profilePicture: string | null;
  isVerified: boolean | null;
  isPrivate: boolean | null;
}

export interface LatestPostItem {
  origin: 'provider';
  id?: string;
  type?: string | null;
  displayUrl: string | null;
  caption?: string | null;
  timestamp?: string | null;
  likesCount?: number | null;
  commentsCount?: number | null;
  locationName?: string | null;
  ownerUsername?: string | null;
}

export interface InstagramProfileData {
  username: string;
  fullName: string | null;
  biography: string | null;
  profilePicture: string | null;
  followers: number | null;
  following: number | null;
  posts: number | null;
  isPrivate: boolean | null;
  isVerified: boolean | null;
  relatedProfiles?: RelatedProfileItem[] | null;
  latestPosts?: LatestPostItem[] | null;
}

export type InstagramProfileResult =
  | {
      status: 'SUCCESS';
      data: InstagramProfileData;
    }
  | {
      status: 'NOT_FOUND';
    }
  | {
      status: 'UNAVAILABLE';
      reason: string;
    };

export interface InstagramProfileProvider {
  name: string;
  getProfile(username: string): Promise<InstagramProfileResult>;
}

/**
 * Raw Item Schema returned by apify/instagram-profile-scraper
 */
export interface RawApifyInstagramProfileItem {
  id?: string;
  username: string;
  url?: string;
  fullName?: string | null;
  biography?: string | null;
  followersCount?: number | null;
  followsCount?: number | null;
  postsCount?: number | null;
  private?: boolean | null;
  verified?: boolean | null;
  profilePicUrl?: string | null;
  profilePicUrlHD?: string | null;
  relatedProfiles?: Array<{
    id?: string;
    username?: string;
    fullName?: string | null;
    full_name?: string | null;
    profilePicUrl?: string | null;
    profile_pic_url?: string | null;
    isVerified?: boolean | null;
    is_verified?: boolean | null;
    isPrivate?: boolean | null;
    is_private?: boolean | null;
    [key: string]: unknown;
  }> | null;
  related_profiles?: Array<{
    id?: string;
    username?: string;
    fullName?: string | null;
    full_name?: string | null;
    profilePicUrl?: string | null;
    profile_pic_url?: string | null;
    isVerified?: boolean | null;
    is_verified?: boolean | null;
    isPrivate?: boolean | null;
    is_private?: boolean | null;
    [key: string]: unknown;
  }> | null;
  latestPosts?: Array<{
    id?: string;
    type?: string | null;
    displayUrl?: string | null;
    display_url?: string | null;
    url?: string | null;
    thumbnail?: string | null;
    caption?: string | null;
    timestamp?: string | null;
    likesCount?: number | null;
    commentsCount?: number | null;
    [key: string]: unknown;
  }> | null;
  latest_posts?: Array<{
    id?: string;
    type?: string | null;
    displayUrl?: string | null;
    display_url?: string | null;
    url?: string | null;
    thumbnail?: string | null;
    caption?: string | null;
    timestamp?: string | null;
    likesCount?: number | null;
    commentsCount?: number | null;
    [key: string]: unknown;
  }> | null;
  error?: string | null;
  [key: string]: unknown;
}

export function normalizeUsername(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]
    .toLowerCase();
}

/**
 * Pure, strict normalizer that maps the real raw Apify item into standard domain models
 * NEVER fills missing data with mocks or fake information.
 */
export function normalizeApifyProfile(rawItem: RawApifyInstagramProfileItem): InstagramProfileData {
  const rawFullName = rawItem.fullName?.trim();
  const rawBio = rawItem.biography !== undefined && rawItem.biography !== null ? rawItem.biography : null;

  // 1. Related Profiles (max 5)
  const rawRelated = rawItem.relatedProfiles || rawItem.related_profiles;
  let normalizedRelated: RelatedProfileItem[] | null = null;

  if (Array.isArray(rawRelated) && rawRelated.length > 0) {
    const validRelated = rawRelated
      .filter((r) => r && typeof r.username === 'string' && r.username.trim().length > 0)
      .slice(0, 5)
      .map((r) => {
        const u = r.username!.trim().replace(/^@/, '');
        const fn = (r.fullName || r.full_name || '')?.trim();
        const rawPic = r.profilePicUrl || r.profile_pic_url || (typeof r.profilePicUrlHD === 'string' ? r.profilePicUrlHD : null);
        const pic = typeof rawPic === 'string' && rawPic.trim().length > 0 ? rawPic.trim() : null;
        const ver = typeof r.isVerified === 'boolean' ? r.isVerified : typeof r.is_verified === 'boolean' ? r.is_verified : null;
        const priv = typeof r.isPrivate === 'boolean' ? r.isPrivate : typeof r.is_private === 'boolean' ? r.is_private : null;

        const item: RelatedProfileItem = {
          origin: 'provider',
          username: u,
          fullName: fn || null,
          profilePicture: pic,
          isVerified: ver,
          isPrivate: priv,
        };
        return item;
      });

    if (validRelated.length > 0) {
      normalizedRelated = validRelated;
    }
  }

  // 2. Latest Posts (max 3)
  const rawPosts = rawItem.latestPosts || rawItem.latest_posts;
  let normalizedPosts: LatestPostItem[] | null = null;

  if (Array.isArray(rawPosts) && rawPosts.length > 0 && !rawItem.private) {
    const validPosts = rawPosts
      .slice(0, 3)
      .map((p) => {
        const dispUrl = p.displayUrl || p.display_url || p.url || p.thumbnail || null;
        const rawLoc = (p as any).locationName || (p as any).location_name || (p as any).location?.name || null;
        const rawOwner = (p as any).ownerUsername || (p as any).owner_username || (p as any).owner?.username || rawItem.username;
        const item: LatestPostItem = {
          origin: 'provider',
          id: p.id ? String(p.id) : undefined,
          type: p.type || null,
          displayUrl: dispUrl,
          caption: p.caption ? String(p.caption) : null,
          timestamp: p.timestamp ? String(p.timestamp) : null,
          likesCount: typeof p.likesCount === 'number' ? p.likesCount : null,
          commentsCount: typeof p.commentsCount === 'number' ? p.commentsCount : null,
          locationName: typeof rawLoc === 'string' && rawLoc.trim().length > 0 ? rawLoc.trim() : null,
          ownerUsername: typeof rawOwner === 'string' && rawOwner.trim().length > 0 ? rawOwner.trim() : rawItem.username,
        };
        return item;
      })
      .filter((p) => Boolean(p.displayUrl));

    if (validPosts.length > 0) {
      normalizedPosts = validPosts;
    }
  }

  return {
    username: rawItem.username,
    fullName: rawFullName ? rawFullName : null,
    biography: rawBio,
    profilePicture: rawItem.profilePicUrlHD || rawItem.profilePicUrl || null,
    followers: typeof rawItem.followersCount === 'number' ? rawItem.followersCount : null,
    following: typeof rawItem.followsCount === 'number' ? rawItem.followsCount : null,
    posts: typeof rawItem.postsCount === 'number' ? rawItem.postsCount : null,
    isPrivate: typeof rawItem.private === 'boolean' ? rawItem.private : null,
    isVerified: typeof rawItem.verified === 'boolean' ? rawItem.verified : null,
    relatedProfiles: normalizedRelated,
    latestPosts: normalizedPosts,
  };
}

export class ApifyInstagramProvider implements InstagramProfileProvider {
  name = 'apify/instagram-profile-scraper';

  async getProfile(inputUsername: string): Promise<InstagramProfileResult> {
    const token = process.env.APIFY_API_TOKEN?.trim();

    if (!token) {
      console.warn('[ApifyInstagramProvider] APIFY_API_TOKEN não configurado no ambiente.');
      return {
        status: 'UNAVAILABLE',
        reason: 'APIFY_TOKEN_NOT_CONFIGURED',
      };
    }

    const requested = normalizeUsername(inputUsername);
    if (!requested) {
      return {
        status: 'UNAVAILABLE',
        reason: 'INVALID_USERNAME',
      };
    }

    // Actor: apify/instagram-profile-scraper
    const actorId = 'apify~instagram-profile-scraper';
    const endpoint = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;

    try {
      console.log(`[ApifyInstagramProvider] Executando actor ${actorId} para @${requested}...`);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          usernames: [requested],
        }),
        signal: AbortSignal.timeout(60000),
      });

      if (res.status === 401 || res.status === 403) {
        return {
          status: 'UNAVAILABLE',
          reason: 'APIFY_AUTHENTICATION_FAILED',
        };
      }

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        console.error(`[ApifyInstagramProvider] Erro HTTP do Apify: ${res.status}`, errorText);
        return {
          status: 'UNAVAILABLE',
          reason: `APIFY_HTTP_ERROR_${res.status}`,
        };
      }

      const items: RawApifyInstagramProfileItem[] = await res.json();

      if (!Array.isArray(items) || items.length === 0) {
        return {
          status: 'NOT_FOUND',
        };
      }

      const item = items[0];

      if (item.error === 'user_not_found' || item.error === 'not_found' || !item.username) {
        return {
          status: 'NOT_FOUND',
        };
      }

      // IMPRIMIR RAW APIFY PROFILE COMPLETO
      console.log('RAW APIFY PROFILE', item);

      console.log('PROFILE:\n', item.username);
      console.log('RELATED PROFILES:\n', JSON.stringify(item.relatedProfiles || item.related_profiles || [], null, 2));
      console.log('LATEST POSTS:\n', JSON.stringify(item.latestPosts || item.latest_posts || [], null, 2));

      // VALIDAÇÃO ABSOLUTA: requested === returned
      const returned = normalizeUsername(item.username);
      if (requested !== returned) {
        console.error(`[ApifyInstagramProvider] PROFILE_MISMATCH - requested: "${requested}", returned: "${returned}"`);
        throw new Error('PROFILE_MISMATCH');
      }

      // NORMALIZAÇÃO ESTRITA: Campo ausente é null, sem inventar dados
      const normalized: InstagramProfileData = normalizeApifyProfile(item);

      // IMPRIMIR NORMALIZED PROFILE
      console.log('NORMALIZED PROFILE:\n', JSON.stringify(normalized, null, 2));

      return {
        status: 'SUCCESS',
        data: normalized,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'PROFILE_MISMATCH') {
        throw err;
      }
      console.error('[ApifyInstagramProvider] Exceção durante requisição ao Apify:', err);
      return {
        status: 'UNAVAILABLE',
        reason: err instanceof Error ? err.message : 'APIFY_REQUEST_FAILED',
      };
    }
  }
}
