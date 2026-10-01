interface Env {
  APIFY_API_TOKEN?: string;
}

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

export function normalizeUsername(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]
    .toLowerCase();
}

export function normalizeApifyProfile(rawItem: any): InstagramProfileData {
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

        return {
          origin: 'provider' as const,
          username: u,
          fullName: fn || null,
          profilePicture: pic
            ? `/api/instagram/profile-image?url=${encodeURIComponent(pic)}`
            : null,
          isVerified: ver,
          isPrivate: priv,
        };
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
        const rawLoc = p.locationName || p.location_name || p.location?.name || null;
        const rawOwner = p.ownerUsername || p.owner_username || p.owner?.username || rawItem.username;
        return {
          origin: 'provider' as const,
          id: p.id ? String(p.id) : undefined,
          type: p.type || null,
          displayUrl: dispUrl
            ? `/api/instagram/profile-image?url=${encodeURIComponent(dispUrl)}`
            : null,
          caption: p.caption ? String(p.caption) : null,
          timestamp: p.timestamp ? String(p.timestamp) : null,
          likesCount: typeof p.likesCount === 'number' ? p.likesCount : null,
          commentsCount: typeof p.commentsCount === 'number' ? p.commentsCount : null,
          locationName: typeof rawLoc === 'string' && rawLoc.trim().length > 0 ? rawLoc.trim() : null,
          ownerUsername: typeof rawOwner === 'string' && rawOwner.trim().length > 0 ? rawOwner.trim() : rawItem.username,
        };
      })
      .filter((p) => Boolean(p.displayUrl));

    if (validPosts.length > 0) {
      normalizedPosts = validPosts;
    }
  }

  const rawProfilePic = rawItem.profilePicUrlHD || rawItem.profilePicUrl || null;

  return {
    username: rawItem.username,
    fullName: rawFullName ? rawFullName : null,
    biography: rawBio,
    profilePicture: rawProfilePic
      ? `/api/instagram/profile-image?url=${encodeURIComponent(rawProfilePic)}`
      : null,
    followers: typeof rawItem.followersCount === 'number' ? rawItem.followersCount : null,
    following: typeof rawItem.followsCount === 'number' ? rawItem.followsCount : null,
    posts: typeof rawItem.postsCount === 'number' ? rawItem.postsCount : null,
    isPrivate: typeof rawItem.private === 'boolean' ? rawItem.private : null,
    isVerified: typeof rawItem.verified === 'boolean' ? rawItem.verified : null,
    relatedProfiles: normalizedRelated,
    latestPosts: normalizedPosts,
  };
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const reqUrl = new URL(context.request.url);
  const rawUsername = reqUrl.searchParams.get('username') || '';
  const requested = normalizeUsername(rawUsername);

  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (!requested || requested.length < 2) {
    return new Response(
      JSON.stringify({
        status: 'UNAVAILABLE',
        reason: 'INVALID_USERNAME',
        message: 'Digite um nome de usuário válido.',
      }),
      { status: 400, headers: jsonHeaders }
    );
  }

  // Access APIFY_API_TOKEN from Cloudflare Pages Environment / Secrets
  const token = context.env.APIFY_API_TOKEN?.trim();

  if (!token) {
    console.error('[CloudflarePagesFunction:instagram-profile] APIFY_API_TOKEN não configurada no ambiente.');
    return new Response(
      JSON.stringify({
        status: 'UNAVAILABLE',
        reason: 'APIFY_TOKEN_NOT_CONFIGURED',
        message: 'Variável de ambiente APIFY_API_TOKEN não foi configurada na Cloudflare.',
      }),
      { status: 500, headers: jsonHeaders }
    );
  }

  const actorId = 'apify~instagram-profile-scraper';
  const endpoint = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        usernames: [requested],
      }),
    });

    if (res.status === 401 || res.status === 403) {
      return new Response(
        JSON.stringify({
          status: 'UNAVAILABLE',
          reason: 'APIFY_AUTHENTICATION_FAILED',
          message: 'Token do Apify inválido ou não autorizado.',
        }),
        { status: 401, headers: jsonHeaders }
      );
    }

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      console.error(`[CloudflarePagesFunction:instagram-profile] HTTP Error ${res.status}:`, errorText);
      return new Response(
        JSON.stringify({
          status: 'UNAVAILABLE',
          reason: `APIFY_HTTP_ERROR_${res.status}`,
          message: 'Falha ao consultar provedor de dados Apify.',
        }),
        { status: res.status, headers: jsonHeaders }
      );
    }

    const items: any = await res.json();

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({
          status: 'NOT_FOUND',
          message: 'Não foi possível localizar esse perfil. Confira o @ e tente novamente.',
        }),
        { status: 404, headers: jsonHeaders }
      );
    }

    const item = items[0];

    if (item.error === 'user_not_found' || item.error === 'not_found' || !item.username) {
      return new Response(
        JSON.stringify({
          status: 'NOT_FOUND',
          message: 'Não foi possível localizar esse perfil. Confira o @ e tente novamente.',
        }),
        { status: 404, headers: jsonHeaders }
      );
    }

    const returned = normalizeUsername(item.username);
    if (requested !== returned) {
      console.error(`[CloudflarePagesFunction:instagram-profile] PROFILE_MISMATCH - requested: ${requested}, returned: ${returned}`);
      return new Response(
        JSON.stringify({
          status: 'UNAVAILABLE',
          reason: 'PROFILE_MISMATCH',
          message: 'Divergência entre o nome de usuário solicitado e o retornado.',
        }),
        { status: 422, headers: jsonHeaders }
      );
    }

    const normalizedData = normalizeApifyProfile(item);

    return new Response(
      JSON.stringify({
        status: 'SUCCESS',
        data: normalizedData,
      }),
      {
        status: 200,
        headers: {
          ...jsonHeaders,
          'Cache-Control': 'public, max-age=900',
        },
      }
    );
  } catch (err: any) {
    console.error('[CloudflarePagesFunction:instagram-profile] Exception during execution:', err);
    return new Response(
      JSON.stringify({
        status: 'UNAVAILABLE',
        reason: 'SERVER_ERROR',
        message: err.message || 'Erro interno ao consultar o perfil.',
      }),
      { status: 500, headers: jsonHeaders }
    );
  }
};
