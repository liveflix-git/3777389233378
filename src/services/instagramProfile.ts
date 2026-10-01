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

export function normalizeUsername(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]
    .toLowerCase();
}

export const normalizeInstagramUsername = normalizeUsername;

export async function fetchInstagramProfile(rawInput: string): Promise<InstagramProfileData> {
  const requested = normalizeUsername(rawInput);

  if (!requested || requested.length < 2) {
    throw new Error('Digite um nome de usuário válido.');
  }

  const endpoint = `/api/instagram/profile?username=${encodeURIComponent(requested)}`;

  try {
    const res = await fetch(endpoint);
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const result = (await res.json()) as any;

      if (res.status === 404 || result.status === 'NOT_FOUND') {
        throw new Error('Não foi possível localizar esse perfil. Confira o @ e tente novamente.');
      }

      if (result.status === 'UNAVAILABLE') {
        if (result.reason === 'APIFY_TOKEN_NOT_CONFIGURED') {
          throw new Error('É necessário configurar a variável APIFY_API_TOKEN na Cloudflare.');
        }
        throw new Error(result.message || result.reason || 'Serviço de consulta indisponível no momento.');
      }

      if (res.ok && result.status === 'SUCCESS' && result.data) {
        const data: InstagramProfileData = result.data;

        // Strict validation: requestedUsername === returnedUsername
        const returned = normalizeUsername(data.username);
        if (requested !== returned) {
          console.error(`[InstagramLookup] PROFILE_MISMATCH - requested: ${requested}, returned: ${returned}`);
          throw new Error('PROFILE_MISMATCH');
        }

        return data;
      }
    }

    throw new Error('Não foi possível carregar os dados deste perfil no momento.');
  } catch (err: any) {
    if (
      err instanceof Error &&
      (err.message.includes('Não foi possível') ||
        err.message === 'PROFILE_MISMATCH' ||
        err.message.includes('APIFY_API_TOKEN'))
    ) {
      throw err;
    }
    throw new Error(err.message || 'Erro ao conectar com o serviço de busca.');
  }
}
