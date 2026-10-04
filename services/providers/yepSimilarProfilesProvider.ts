import { normalizeUsername, type RelatedInstagramProfile } from './apifyInstagramProvider.js';

export interface YepRawUser {
  id?: string | number;
  username: string;
  full_name?: string;
  fullName?: string;
  profile_pic_url?: string;
  profilePicUrl?: string;
  profile_pic_url_hd?: string;
  is_private?: boolean;
  isPrivate?: boolean;
  is_verified?: boolean;
  isVerified?: boolean;
}

export interface YepSimilarResponse {
  data?: YepRawUser[];
  users?: YepRawUser[];
  items?: YepRawUser[];
  results?: YepRawUser[];
  status?: string;
}

export interface PublicPreviewMediaResult {
  imageUrl?: string;
  sourceUsername: string;
}

export class YepSimilarProfilesProvider {
  private endpoint = 'https://api.yepapi.com/v1/instagram/user-similar';

  /**
   * Fetches real similar / related profiles for a given username using YepAPI.
   * Safe with timeouts, never throws breaking exceptions.
   */
  async fetchYepSimilarProfiles(
    username: string,
    apiKeyOverride?: string
  ): Promise<RelatedInstagramProfile[]> {
    const target = normalizeUsername(username);
    if (!target) return [];

    const apiKey = (apiKeyOverride || process.env.YEP_API_KEY || 'yep_sk_638cce8f4ad8efbde2b42a3a1389c6ea2b8c5e1d238eeee3').trim();
    if (!apiKey) {
      console.warn('[YepAPI] YEP_API_KEY não configurada no ambiente.');
      return [];
    }

    console.log(`[YepAPI] Requesting similar profiles for target username: @${target}`);

    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username: target }),
        signal: AbortSignal.timeout(12000), // 12s timeout
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.warn(`[YepAPI] HTTP error ${res.status} for @${target}:`, errText);
        return [];
      }

      const json = (await res.json()) as any;
      const rawList: YepRawUser[] = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : Array.isArray(json.users)
        ? json.users
        : Array.isArray(json.items)
        ? json.items
        : Array.isArray(json.results)
        ? json.results
        : [];

      if (!Array.isArray(rawList) || rawList.length === 0) {
        console.log(`[YepAPI] No similar profiles returned for @${target}.`);
        return [];
      }

      const seen = new Set<string>([target]);
      const normalizedList: RelatedInstagramProfile[] = [];

      for (const raw of rawList) {
        if (!raw || typeof raw.username !== 'string') continue;
        const normUser = normalizeUsername(raw.username);
        if (!normUser || seen.has(normUser)) continue;
        seen.add(normUser);

        const pic = raw.profile_pic_url_hd || raw.profile_pic_url || raw.profilePicUrl || '';
        const proxiedPic = pic && pic.startsWith('http')
          ? `/api/instagram/profile-image?url=${encodeURIComponent(pic)}`
          : (pic || undefined);

        normalizedList.push({
          id: raw.id ? String(raw.id) : undefined,
          username: normUser,
          fullName: (raw.full_name || raw.fullName || '')?.trim() || undefined,
          profilePicture: proxiedPic,
          isPrivate: Boolean(raw.is_private ?? raw.isPrivate),
          isVerified: Boolean(raw.is_verified ?? raw.isVerified),
        });

        if (normalizedList.length >= 12) break;
      }

      console.log(`[YepAPI] Success: normalized ${normalizedList.length} profiles for @${target}`);
      return normalizedList;
    } catch (err: any) {
      console.warn(`[YepAPI] Connection or timeout error for @${target}:`, err.message || err);
      return [];
    }
  }

  /**
   * Fetches ONE real public media image for a public related profile.
   * Strictly limited to public profiles without touching private content.
   */
  async fetchPublicPreviewMedia(
    username: string,
    apiKeyOverride?: string
  ): Promise<PublicPreviewMediaResult | null> {
    const target = normalizeUsername(username);
    if (!target) return null;

    const apiKey = (apiKeyOverride || process.env.YEP_API_KEY || 'yep_sk_638cce8f4ad8efbde2b42a3a1389c6ea2b8c5e1d238eeee3').trim();
    if (!apiKey) return null;

    try {
      const res = await fetch('https://api.yepapi.com/v1/instagram/user-posts', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username: target, count: 1 }),
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        const posts = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : Array.isArray(data.posts) ? data.posts : [];
        if (posts.length > 0 && posts[0]) {
          const p = posts[0];
          const rawMedia = p.display_url || p.displayUrl || p.thumbnail_url || p.image_url || p.url;
          if (typeof rawMedia === 'string' && rawMedia.startsWith('http')) {
            return {
              imageUrl: `/api/instagram/proxy-image?url=${encodeURIComponent(rawMedia)}`,
              sourceUsername: target,
            };
          }
        }
      }
    } catch {
      // Non-blocking
    }

    return null;
  }
}

export const yepSimilarProfilesProvider = new YepSimilarProfilesProvider();
