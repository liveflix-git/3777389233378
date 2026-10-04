export interface Env {
  APIFY_API_TOKEN?: string;
  YEP_API_KEY?: string;
  ASSETS: Fetcher;
}

export interface RelatedInstagramProfile {
  id?: string;
  username: string;
  fullName?: string;
  isVerified?: boolean;
  isPrivate?: boolean;
  profilePicture?: string;
}

export type RelatedProfileItem = RelatedInstagramProfile & {
  origin?: 'provider';
};

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
  relatedProfiles?: RelatedInstagramProfile[] | null;
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

  // 1. Related Profiles (preserve order, filter target and duplicates, up to 12 items)
  const rawRelated = rawItem.relatedProfiles || rawItem.related_profiles;
  let normalizedRelated: RelatedInstagramProfile[] | null = null;
  const targetUsername = normalizeUsername(rawItem.username);

  if (Array.isArray(rawRelated) && rawRelated.length > 0) {
    const seenUsernames = new Set<string>();
    const validRelated: RelatedInstagramProfile[] = [];

    for (const r of rawRelated) {
      if (!r || typeof r.username !== 'string') continue;
      const u = r.username.trim().replace(/^@/, '');
      const uNorm = normalizeUsername(u);
      if (!uNorm || uNorm === targetUsername || seenUsernames.has(uNorm)) {
        continue;
      }
      seenUsernames.add(uNorm);

      const fn = (r.fullName || r.full_name || '')?.trim();
      const rawPic = r.profilePicUrl || r.profile_pic_url || (typeof r.profilePicUrlHD === 'string' ? r.profilePicUrlHD : null);
      const pic = typeof rawPic === 'string' && rawPic.trim().length > 0 ? rawPic.trim() : null;
      const ver = typeof r.isVerified === 'boolean' ? r.isVerified : typeof r.is_verified === 'boolean' ? r.is_verified : undefined;
      const priv = typeof r.isPrivate === 'boolean' ? r.isPrivate : typeof r.is_private === 'boolean' ? r.is_private : undefined;

      validRelated.push({
        id: r.id ? String(r.id) : undefined,
        username: u,
        fullName: fn || undefined,
        profilePicture: pic
          ? `/api/instagram/profile-image?url=${encodeURIComponent(pic)}`
          : undefined,
        isVerified: ver,
        isPrivate: priv,
      });

      if (validRelated.length >= 12) break;
    }

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

async function handleInstagramProfile(request: Request, env: Env): Promise<Response> {
  const reqUrl = new URL(request.url);
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

  const token = env.APIFY_API_TOKEN?.trim();

  if (!token) {
    console.error('[InstagramProfileWorker] APIFY_API_TOKEN não configurada no ambiente Worker.');
    return new Response(
      JSON.stringify({
        status: 'UNAVAILABLE',
        reason: 'APIFY_TOKEN_NOT_CONFIGURED',
        message: 'Variável de ambiente APIFY_API_TOKEN não foi configurada na Cloudflare.',
      }),
      { status: 500, headers: jsonHeaders }
    );
  }

  console.log(`[InstagramProfile] Request for username: ${requested}`);

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
        includeRelatedProfiles: true,
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
      console.error(`[InstagramProfileWorker] HTTP Error ${res.status}:`, errorText);
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
      console.error(`[InstagramProfileWorker] PROFILE_MISMATCH - requested: ${requested}, returned: ${returned}`);
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

    // If Apify returned < 7 relatedProfiles, query YepAPI for similar profiles
    const apifyRelatedCount = normalizedData.relatedProfiles ? normalizedData.relatedProfiles.length : 0;
    const yepApiKey = (env.YEP_API_KEY || '').trim();
    const yepKeyConfigured = Boolean(yepApiKey.length > 0);

    if (apifyRelatedCount < 7) {
      if (!yepKeyConfigured) {
        console.error('[YEP CONFIG] YEP_API_KEY is not configured');
      } else {
        console.log('[YEP PROD]', {
          username: requested,
          keyConfigured: true,
        });

        try {
          const yepRes = await fetch('https://api.yepapi.com/v1/instagram/user-similar', {
            method: 'POST',
            headers: {
              'x-api-key': yepApiKey,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ username: requested }),
            signal: AbortSignal.timeout(10000),
          });

          if (yepRes.ok) {
            const yepJson = (await yepRes.json()) as any;
            const rawList = Array.isArray(yepJson)
              ? yepJson
              : Array.isArray(yepJson.data)
              ? yepJson.data
              : Array.isArray(yepJson.users)
              ? yepJson.users
              : Array.isArray(yepJson.items)
              ? yepJson.items
              : Array.isArray(yepJson.results)
              ? yepJson.results
              : [];

            console.log('[YEP PROD RESULT]', {
              username: requested,
              status: yepRes.status,
              count: rawList.length,
            });

            if (Array.isArray(rawList) && rawList.length > 0) {
              const seen = new Set<string>([requested]);
              const merged: RelatedInstagramProfile[] = [];

              if (Array.isArray(normalizedData.relatedProfiles)) {
                for (const p of normalizedData.relatedProfiles) {
                  const u = normalizeUsername(p.username);
                  if (u && !seen.has(u)) {
                    seen.add(u);
                    merged.push(p);
                  }
                }
              }

              for (const r of rawList) {
                if (merged.length >= 12) break;
                if (!r || typeof r.username !== 'string') continue;
                const u = normalizeUsername(r.username);
                if (!u || seen.has(u)) continue;
                seen.add(u);

                const pic = r.profile_pic_url_hd || r.profile_pic_url || r.profilePicUrl || '';
                merged.push({
                  id: r.id ? String(r.id) : undefined,
                  username: u,
                  fullName: (r.full_name || r.fullName || '')?.trim() || undefined,
                  profilePicture: pic && pic.startsWith('http')
                    ? `/api/instagram/profile-image?url=${encodeURIComponent(pic)}`
                    : undefined,
                  isPrivate: typeof r.is_private === 'boolean' ? r.is_private : typeof r.isPrivate === 'boolean' ? r.isPrivate : undefined,
                  isVerified: typeof r.is_verified === 'boolean' ? r.is_verified : typeof r.isVerified === 'boolean' ? r.isVerified : undefined,
                });
              }

              if (merged.length > 0) {
                normalizedData.relatedProfiles = merged;
              }
            }
          } else {
            const errText = await yepRes.text().catch(() => '');
            console.warn('[YEP ERROR]', {
              username: requested,
              status: yepRes.status,
              message: errText,
            });
          }
        } catch (yepErr: any) {
          console.warn('[YEP ERROR]', {
            username: requested,
            status: 0,
            message: yepErr?.message || String(yepErr),
          });
        }
      }
    }

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
    console.error('[InstagramProfileWorker] Exception during execution:', err);
    return new Response(
      JSON.stringify({
        status: 'UNAVAILABLE',
        reason: 'SERVER_ERROR',
        message: err.message || 'Erro interno ao consultar o perfil.',
      }),
      { status: 500, headers: jsonHeaders }
    );
  }
}

async function handleInstagramProfileImage(request: Request): Promise<Response> {
  const reqUrl = new URL(request.url);
  const remoteUrl = reqUrl.searchParams.get('url') || '';

  if (!remoteUrl || !remoteUrl.startsWith('http')) {
    return new Response('URL da imagem é obrigatória e deve iniciar com http/https.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const res = await fetch(remoteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://www.instagram.com/',
      },
    });

    if (!res.ok) {
      return new Response('Não foi possível carregar a imagem do provedor remoto.', {
        status: res.status,
        headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const headers = new Headers();
    headers.set('Content-Type', res.headers.get('content-type') || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=86400');
    headers.set('Access-Control-Allow-Origin', '*');

    return new Response(res.body, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error('[InstagramProfileImageWorker] Proxy error:', err);
    return new Response('Erro no gateway ao buscar a imagem.', {
      status: 502,
      headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

async function handleAccelerate(request: Request): Promise<Response> {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
      },
    });
  }

  const ACCELERATE_COST = 45;

  try {
    const body = (await request.json().catch(() => ({}))) as any;
    const service = body?.service || 'instagram';
    const currentCredits = typeof body?.currentCredits === 'number' ? body.currentCredits : undefined;

    if (typeof currentCredits === 'number' && currentCredits < ACCELERATE_COST) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'INSUFFICIENT_CREDITS',
          cost: ACCELERATE_COST,
          credits: currentCredits,
          message: 'Créditos insuficientes para acelerar (necessário 45 créditos).',
        }),
        { status: 400, headers: jsonHeaders }
      );
    }

    const newBalance = typeof currentCredits === 'number' ? currentCredits - ACCELERATE_COST : undefined;

    return new Response(
      JSON.stringify({
        success: true,
        cost: ACCELERATE_COST,
        credits: newBalance,
        analysis: {
          service,
          status: 'ACCELERATED',
          accelerated: true,
          updatedAt: new Date().toISOString(),
        },
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'ACCELERATION_FAILED',
        message: err.message || 'Erro ao processar aceleração.',
      }),
      { status: 500, headers: jsonHeaders }
    );
  }
}

async function handleSpendCredits(request: Request): Promise<Response> {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const SERVICE_COSTS: Record<string, number> = {
    instagram: 0,
    whatsapp: 40,
    facebook: 45,
    location: 60,
    sms: 30,
    calls: 25,
    camera: 55,
    otherNetworks: 70,
    '2fa_bypass': 80,
    acceleration: 45,
  };

  try {
    const body = (await request.json().catch(() => ({}))) as any;
    const service = String(body?.service || '');
    const currentCredits = typeof body?.currentCredits === 'number' ? body.currentCredits : undefined;
    const cost = SERVICE_COSTS[service] ?? 45;

    if (typeof currentCredits === 'number' && currentCredits < cost) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'INSUFFICIENT_CREDITS',
          cost,
          credits: currentCredits,
        }),
        { status: 400, headers: jsonHeaders }
      );
    }

    const newBalance = typeof currentCredits === 'number' ? currentCredits - cost : undefined;

    return new Response(
      JSON.stringify({
        success: true,
        cost,
        credits: newBalance,
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'SPEND_FAILED',
        message: err.message || 'Erro ao debitar créditos.',
      }),
      { status: 500, headers: jsonHeaders }
    );
  }
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. API route: Image Proxy
    if (url.pathname === '/api/instagram/profile-image' || url.pathname.startsWith('/api/instagram/profile-image')) {
      return handleInstagramProfileImage(request);
    }

    // 2. API route: Instagram Profile Lookup
    if (url.pathname === '/api/instagram/profile' || url.pathname.startsWith('/api/instagram/profile')) {
      return handleInstagramProfile(request, env);
    }

    // 3. API route: Accelerate Analysis
    if (url.pathname === '/api/analysis/accelerate' || url.pathname.startsWith('/api/analysis/accelerate')) {
      return handleAccelerate(request);
    }

    // 4. API route: User Spend Credits
    if (url.pathname === '/api/user/spend' || url.pathname.startsWith('/api/user/spend')) {
      return handleSpendCredits(request);
    }

    // 5. Fallback for unmatched /api/* routes: MUST return JSON error, never index.html!
    if (url.pathname.startsWith('/api/')) {
      return new Response(
        JSON.stringify({
          status: 'ERROR',
          error: 'NOT_FOUND',
          message: 'Rota de API não encontrada.',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 6. Serve Static Assets with Internal SPA Fallback
    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);

      const isRedirect = assetResponse.status >= 300 && assetResponse.status < 400;
      if (assetResponse.status !== 404 && !isRedirect) {
        return assetResponse;
      }

      const indexRequest = new Request(new URL('/index.html', request.url), request);
      const indexResponse = await env.ASSETS.fetch(indexRequest);

      if (indexResponse.status === 200) {
        return indexResponse;
      }

      if (indexResponse.body) {
        const headers = new Headers(indexResponse.headers);
        headers.set('Content-Type', 'text/html; charset=utf-8');
        headers.set('Cache-Control', 'no-cache');
        headers.delete('Location');
        return new Response(indexResponse.body, {
          status: 200,
          headers,
        });
      }

      return assetResponse;
    }

    return new Response('Asset not found', { status: 404 });
  },
};
