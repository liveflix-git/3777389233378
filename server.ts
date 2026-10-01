import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { 
  resolveInstagramProfile, 
  getCachedImage, 
  getCachedProfile,
  fetchAndCacheProfileImage,
  normalizeUsername 
} from './services/instagramProfile.js';
import {
  getOrCreateUser,
  getUser,
  spendCredits,
  getUserTransactions,
  type ServiceName,
} from './services/userStore.js';
import {
  getActiveAnalysis,
  startAnalysis,
  accelerateAnalysis,
  cancelAnalysis,
  updateAnalysisProgress,
} from './services/analysisStore.js';

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());

  // 1. Image proxy / local cache endpoint for authentic profile pictures
  // GET /api/instagram/profile-image?username=USERNAME
  app.get('/api/instagram/profile-image', async (req, res) => {
    const rawUsername = (req.query.username as string) || '';
    const username = normalizeUsername(rawUsername);

    if (!username) {
      return res.status(400).send('Username is required');
    }

    let cached = getCachedImage(username);

    // If not in image cache, try fetching using cached profile's remote URL
    if (!cached) {
      const profile = getCachedProfile(username);
      if (profile?.profilePicture && profile.profilePicture.startsWith('http')) {
        cached = await fetchAndCacheProfileImage(username, profile.profilePicture);
      }
    }

    if (cached) {
      res.setHeader('Content-Type', cached.contentType);
      res.setHeader('Cache-Control', 'public, max-age=14400'); // 4 hours cache
      return res.send(cached.buffer);
    }

    return res.status(404).send('Image not found');
  });

  // Approximate Visitor Location endpoint (IP-based, strictly privacy-compliant)
  // GET /api/location/approximate
  app.get('/api/location/approximate', async (req, res) => {
    try {
      const xForwardedFor = req.headers['x-forwarded-for'];
      const rawIp = typeof xForwardedFor === 'string'
        ? xForwardedFor.split(',')[0].trim()
        : req.socket.remoteAddress || '';

      const isLocal = !rawIp || rawIp === '127.0.0.1' || rawIp === '::1' || rawIp.startsWith('10.') || rawIp.startsWith('192.168.');

      // If local or proxied internal IP, query server's public ip via ip-api
      const targetUrl = isLocal
        ? 'http://ip-api.com/json/?fields=status,country,countryCode,region,regionName,city'
        : `http://ip-api.com/json/${encodeURIComponent(rawIp)}?fields=status,country,countryCode,region,regionName,city`;

      const geoRes = await fetch(targetUrl, {
        signal: AbortSignal.timeout(4000),
      });

      if (geoRes.ok) {
        const geoJson = (await geoRes.json()) as any;
        if (geoJson.status === 'success') {
          return res.json({
            city: geoJson.city || null,
            region: geoJson.regionName || null,
            country: geoJson.countryCode || null,
          });
        }
      }

      return res.json({ city: null, region: null, country: null });
    } catch (err) {
      console.warn('[LocationEndpoint] Could not resolve visitor location:', err);
      return res.json({ city: null, region: null, country: null });
    }
  });

  // Generic secure image proxy for related profiles / post thumbnails
  // GET /api/instagram/proxy-image?url=ENCODED_URL
  // GET /api/instagram/related-profile-image?imageUrl=ENCODED_URL&username=...
  app.get(['/api/instagram/proxy-image', '/api/instagram/related-profile-image'], async (req, res) => {
    const remoteUrl = ((req.query.url || req.query.imageUrl) as string) || '';
    if (!remoteUrl || !remoteUrl.startsWith('http')) {
      return res.status(400).send('Invalid url');
    }

    try {
      const upstreamRes = await fetch(remoteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Referer': 'https://www.instagram.com/',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!upstreamRes.ok) {
        return res.status(upstreamRes.status).send('Failed to fetch upstream image');
      }

      const contentType = upstreamRes.headers.get('content-type') || 'image/jpeg';
      const arrayBuf = await upstreamRes.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(Buffer.from(arrayBuf));
    } catch (err) {
      console.error('[GenericProxyImage] Error:', err);
      return res.status(502).send('Gateway error');
    }
  });

  // 2. Exact resolution endpoint: GET /api/instagram/profile?username=...
  app.get('/api/instagram/profile', async (req, res) => {
    const rawUsername = (req.query.username as string) || '';
    const username = normalizeUsername(rawUsername);

    if (!username) {
      return res.status(400).json({
        status: 'UNAVAILABLE',
        reason: 'INVALID_USERNAME',
        message: 'Digite um nome de usuário válido.',
      });
    }

    try {
      const result = await resolveInstagramProfile(username);

      if (result.status === 'NOT_FOUND') {
        return res.status(404).json({
          status: 'NOT_FOUND',
          error: 'not_found',
          message: 'Não foi possível localizar esse perfil. Confira o @ e tente novamente.',
        });
      }

      if (result.status === 'UNAVAILABLE') {
        return res.status(503).json(result);
      }

      // Exact match sanity check
      if (normalizeUsername(result.data.username) !== username) {
        return res.status(422).json({
          status: 'UNAVAILABLE',
          reason: 'PROFILE_MISMATCH',
          message: 'Divergência entre o username requisitado e o retornado.',
        });
      }

      // Return standardized SUCCESS response
      // ProfilePicture in frontend will point to the proxy endpoint if available
      const responseData = {
        ...result.data,
        profilePicture: result.data.profilePicture
          ? `/api/instagram/profile-image?username=${encodeURIComponent(result.data.username)}`
          : null,
        relatedProfiles: result.data.relatedProfiles?.map((r) => ({
          ...r,
          profilePicture: r.profilePicture
            ? `/api/instagram/proxy-image?url=${encodeURIComponent(r.profilePicture)}`
            : null,
        })) || null,
        latestPosts: result.data.latestPosts?.map((p) => ({
          ...p,
          displayUrl: p.displayUrl
            ? `/api/instagram/proxy-image?url=${encodeURIComponent(p.displayUrl)}`
            : null,
        })) || null,
      };

      return res.json({
        status: 'SUCCESS',
        data: responseData,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : '';
      if (errMsg === 'PROFILE_MISMATCH') {
        return res.status(422).json({
          status: 'UNAVAILABLE',
          reason: 'PROFILE_MISMATCH',
          message: 'Divergência entre o username requisitado e o retornado.',
        });
      }

      return res.status(500).json({
        status: 'UNAVAILABLE',
        reason: 'SERVER_ERROR',
        message: 'Não foi possível carregar os dados deste perfil no momento.',
      });
    }
  });

  // -------------------------------------------------------------
  // USER AUTH & CREDITS SYSTEM API
  // -------------------------------------------------------------

  // Helper to extract clean userId from headers or query
  const resolveUserId = (req: express.Request): string => {
    const headerId = req.headers['x-user-id'];
    if (typeof headerId === 'string' && headerId.trim().length > 0) {
      return headerId.trim();
    }
    const queryId = req.query.userId;
    if (typeof queryId === 'string' && queryId.trim().length > 0) {
      return queryId.trim();
    }
    return 'user_default';
  };

  // POST /api/auth/login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Digite seu e-mail ou nome de usuário.' });
    }

    if (cleanEmail === 'admin@admin.com' || cleanEmail === 'admin') {
      if (password && password.trim() !== 'admin') {
        return res.status(401).json({ success: false, message: 'Senha incorreta para a conta administrador.' });
      }
      const { user } = getOrCreateUser('admin@admin.com', 'Administrador', 'admin');
      return res.json({
        success: true,
        user: {
          id: user.id,
          displayName: 'Administrador',
          username: 'admin',
          credits: 99999,
          xp: 9999,
          level: 99,
        },
      });
    }

    const { user } = getOrCreateUser(cleanEmail, cleanEmail.split('@')[0], cleanEmail.split('@')[0]);
    return res.json({
      success: true,
      user: {
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        credits: user.credits,
        xp: user.xp,
        level: user.level,
      },
    });
  });

  // POST /api/auth/register
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Digite um e-mail válido para cadastro.' });
    }

    if (cleanEmail === 'admin@admin.com') {
      const { user } = getOrCreateUser('admin@admin.com', 'Administrador', 'admin');
      return res.json({
        success: true,
        user: {
          id: user.id,
          displayName: 'Administrador',
          username: 'admin',
          credits: 99999,
          xp: 9999,
          level: 99,
        },
      });
    }

    const displayName = (name || '').trim() || cleanEmail.split('@')[0];
    const username = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_.]/g, '');

    const { user } = getOrCreateUser(cleanEmail, displayName, username);
    return res.json({
      success: true,
      user: {
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        credits: user.credits,
        xp: user.xp,
        level: user.level,
      },
    });
  });

  // GET /api/me - Get or initialize authenticated user profile and credit balance
  app.get('/api/me', (req, res) => {
    const userId = resolveUserId(req);
    const displayName = (req.query.displayName as string) || 'Felipe';
    const username = (req.query.username as string) || 'felipe';

    const { user, isNew } = getOrCreateUser(userId, displayName, username);

    return res.json({
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      credits: user.credits,
      xp: user.xp,
      level: user.level,
      isNewUser: isNew,
    });
  });

  // POST /api/user/spend - Atomically debit credits for a service
  app.post('/api/user/spend', (req, res) => {
    const userId = resolveUserId(req);
    const { service } = req.body as { service?: ServiceName };

    if (!service) {
      return res.status(400).json({ success: false, error: 'INVALID_SERVICE' });
    }

    const result = spendCredits(userId, service);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'SPEND_FAILED',
        credits: result.newBalance,
      });
    }

    return res.json({
      success: true,
      credits: result.newBalance,
      cost: result.cost,
    });
  });

  // GET /api/user/transactions - Get transaction log for user
  app.get('/api/user/transactions', (req, res) => {
    const userId = resolveUserId(req);
    const transactions = getUserTransactions(userId);
    return res.json({ transactions });
  });

  // -------------------------------------------------------------
  // INVESTIGATION ANALYSIS ENDPOINTS
  // -------------------------------------------------------------

  // GET /api/analysis/active - Get current active analysis for user
  app.get('/api/analysis/active', (req, res) => {
    const userId = resolveUserId(req);
    const service = (req.query.service as string) || 'instagram';
    const analysis = getActiveAnalysis(userId, service);
    return res.json({ analysis });
  });

  // POST /api/analysis/start - Start a new investigation analysis
  app.post('/api/analysis/start', (req, res) => {
    const userId = resolveUserId(req);
    const { username, service = 'instagram' } = req.body as { username?: string; service?: string };

    const cleanUsername = (username || '').trim().replace(/^@/, '');

    // Validation: non-empty, max 30 chars, allowed chars letters, numbers, dot, underscore
    if (!cleanUsername || cleanUsername.length > 30 || !/^[a-zA-Z0-9_.]+$/.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_USERNAME',
        message: 'Username inválido. Use apenas letras, números, ponto e underline (máx. 30 caracteres).',
      });
    }

    const result = startAnalysis(userId, cleanUsername, service);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        analysis: result.analysis,
        message: 'Você já possui uma análise em andamento.',
      });
    }

    return res.json({
      success: true,
      analysis: result.analysis,
    });
  });

  // POST /api/analysis/accelerate - Accelerate analysis for 30 credits
  app.post('/api/analysis/accelerate', (req, res) => {
    const userId = resolveUserId(req);
    const { service = 'instagram' } = req.body as { service?: string };

    const result = accelerateAnalysis(userId, service);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        credits: result.newBalance,
        message:
          result.error === 'INSUFFICIENT_CREDITS'
            ? 'Créditos insuficientes para acelerar esta análise.'
            : 'Não foi possível acelerar esta análise.',
      });
    }

    return res.json({
      success: true,
      analysis: result.analysis,
      credits: result.newBalance,
    });
  });

  // POST /api/analysis/cancel - Cancel current analysis
  app.post('/api/analysis/cancel', (req, res) => {
    const userId = resolveUserId(req);
    const { service = 'instagram' } = req.body as { service?: string };

    cancelAnalysis(userId, service);
    return res.json({ success: true });
  });

  // POST /api/analysis/progress - Sync progress % to server
  app.post('/api/analysis/progress', (req, res) => {
    const userId = resolveUserId(req);
    const { service = 'instagram', progress } = req.body as { service?: string; progress?: number };

    if (typeof progress === 'number') {
      const updated = updateAnalysisProgress(userId, service, progress);
      return res.json({ success: true, analysis: updated });
    }

    return res.status(400).json({ success: false, error: 'INVALID_PROGRESS' });
  });

  // Vite development middlewares / static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
