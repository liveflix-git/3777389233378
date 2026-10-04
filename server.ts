// @ts-nocheck
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
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
  // GET /api/instagram/profile-image?username=USERNAME or ?url=URL
  app.get('/api/instagram/profile-image', async (req, res) => {
    const rawUrl = (req.query.url as string) || '';
    if (rawUrl && rawUrl.startsWith('http')) {
      try {
        const imageRes = await fetch(rawUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Referer': 'https://www.instagram.com/',
          },
        });

        if (imageRes.ok) {
          const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
          const arrayBuffer = await imageRes.arrayBuffer();
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.send(Buffer.from(arrayBuffer));
        }
      } catch (err) {
        console.error('[ProfileImageProxy] URL fetch error:', err);
      }
    }

    const rawUsername = (req.query.username as string) || '';
    const username = normalizeUsername(rawUsername);

    if (!username) {
      return res.status(400).send('Username or URL is required');
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
  app.get('/api/instagram/proxy-image', async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl || !targetUrl.startsWith('http')) {
      return res.status(400).send('Valid image url is required');
    }

    try {
      const imageRes = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Referer': 'https://www.instagram.com/',
        },
      });

      if (!imageRes.ok) {
        return res.status(imageRes.status).send('Failed to fetch upstream image');
      }

      const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
      const arrayBuffer = await imageRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
      return res.send(buffer);
    } catch (err) {
      console.error('[ImageProxy] Error proxying image:', err);
      return res.status(500).send('Proxy error');
    }
  });

  // 2. Profile resolution endpoint (Apify -> Cache -> Fallback)
  // GET /api/instagram/profile?username=USERNAME
  app.get('/api/instagram/profile', async (req, res) => {
    const rawUsername = (req.query.username as string) || '';
    const username = normalizeUsername(rawUsername);

    if (!username) {
      return res.status(400).json({
        status: 'ERROR',
        error: 'INVALID_USERNAME',
        message: 'Por favor, informe um nome de usuário válido.',
      });
    }

    try {
      const result = await resolveInstagramProfile(username);
      return res.json(result);
    } catch (err: any) {
      console.error(`[API] Erro ao resolver perfil @${username}:`, err);
      return res.status(500).json({
        status: 'ERROR',
        error: 'INTERNAL_ERROR',
        message: 'Ocorreu um erro ao processar a solicitação.',
      });
    }
  });

  // User resolution helper for dashboard session
  function resolveUserId(req: express.Request): string {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7).trim();
    }
    const sessionCookie = req.headers['x-user-id'];
    if (typeof sessionCookie === 'string' && sessionCookie.trim()) {
      return sessionCookie.trim();
    }
    return 'demo_investigator';
  }

  // POST /api/auth/login - Simple demo/dashboard sign in
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        status: 'ERROR',
        error: 'INVALID_EMAIL',
        message: 'Informe um email válido.',
      });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({
        status: 'ERROR',
        error: 'INVALID_PASSWORD',
        message: 'A senha deve ter no mínimo 4 caracteres.',
      });
    }

    const userId = `usr_${Buffer.from(email.toLowerCase().trim()).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
    const user = getOrCreateUser(userId, email.toLowerCase().trim());

    return res.json({
      status: 'SUCCESS',
      token: userId,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        vipUnlocked: user.vipUnlocked,
      },
    });
  });

  // POST /api/auth/register - Register account with starting credits
  app.post('/api/auth/register', (req, res) => {
    const { email, name, password } = req.body as { email?: string; name?: string; password?: string };

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        status: 'ERROR',
        error: 'INVALID_EMAIL',
        message: 'Informe um email válido.',
      });
    }

    const userId = `usr_${Buffer.from(email.toLowerCase().trim()).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
    const user = getOrCreateUser(userId, email.toLowerCase().trim(), name);

    return res.json({
      status: 'SUCCESS',
      token: userId,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        vipUnlocked: user.vipUnlocked,
      },
    });
  });

  // GET /api/me - Retrieve current user profile and balance
  app.get('/api/me', (req, res) => {
    const userId = resolveUserId(req);
    const user = getUser(userId) || getOrCreateUser(userId);
    const transactions = getUserTransactions(userId);

    return res.json({
      status: 'SUCCESS',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        vipUnlocked: user.vipUnlocked,
      },
      transactions,
    });
  });

  // POST /api/user/spend - Spend credits for an in-app service
  app.post('/api/user/spend', (req, res) => {
    const userId = resolveUserId(req);
    const { amount, service, target } = req.body as {
      amount?: number;
      service?: string;
      target?: string;
    };

    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 'ERROR',
        error: 'INVALID_AMOUNT',
        message: 'Quantidade de créditos inválida.',
      });
    }

    const result = spendCredits(userId, amount, service || 'Serviço Investigativo', target);
    if (!result.success) {
      return res.status(402).json({
        status: 'ERROR',
        error: 'INSUFFICIENT_CREDITS',
        message: result.error || 'Saldo insuficiente.',
        currentBalance: result.currentBalance,
      });
    }

    return res.json({
      status: 'SUCCESS',
      newBalance: result.newBalance,
    });
  });

  // GET /api/analysis/active - Get current state for a service
  app.get('/api/analysis/active', (req, res) => {
    const userId = resolveUserId(req);
    const service = (req.query.service as string) || 'instagram';

    const analysis = getActiveAnalysis(userId, service);
    return res.json({
      status: 'SUCCESS',
      analysis,
    });
  });

  // POST /api/analysis/start - Start or resume persistent investigation
  app.post('/api/analysis/start', (req, res) => {
    const userId = resolveUserId(req);
    const { service, target, targetName, durationHours } = req.body as {
      service?: ServiceName;
      target?: string;
      targetName?: string;
      durationHours?: number;
    };

    if (!service || !target) {
      return res.status(400).json({
        status: 'ERROR',
        error: 'MISSING_PARAMS',
        message: 'Serviço e alvo são obrigatórios.',
      });
    }

    // Deduct entry fee if starting fresh
    const active = getActiveAnalysis(userId, service);
    if (!active) {
      const spend = spendCredits(userId, 50, `Início de Análise: ${service.toUpperCase()}`, target);
      if (!spend.success) {
        return res.status(402).json({
          status: 'ERROR',
          error: 'INSUFFICIENT_CREDITS',
          message: 'Créditos insuficientes para iniciar a análise (50 necessários).',
          currentBalance: spend.currentBalance,
        });
      }
    }

    const analysis = startAnalysis(userId, service, target, targetName, durationHours || 24);

    return res.json({
      status: 'SUCCESS',
      analysis,
    });
  });

  // POST /api/analysis/accelerate - Use credits to fast-forward analysis
  app.post('/api/analysis/accelerate', (req, res) => {
    const userId = resolveUserId(req);
    const { service = 'instagram', cost = 30 } = req.body as { service?: string; cost?: number };

    const active = getActiveAnalysis(userId, service);
    if (!active || active.status !== 'IN_PROGRESS') {
      return res.status(400).json({
        status: 'ERROR',
        error: 'NO_ACTIVE_ANALYSIS',
        message: 'Nenhuma análise em andamento para acelerar.',
      });
    }

    const result = spendCredits(userId, cost, 'Aceleração Turbo de Análise', active.target);
    if (!result.success) {
      return res.status(402).json({
        status: 'ERROR',
        error: 'INSUFFICIENT_CREDITS',
        message: result.error || 'Saldo insuficiente para aceleração.',
        currentBalance: result.currentBalance,
      });
    }

    const accelerated = accelerateAnalysis(userId, service, 4); // Fast forward 4 hours

    return res.json({
      status: 'SUCCESS',
      analysis: accelerated,
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

  // 404 for unmatched /api routes
  app.all('/api/*', (_req, res) => {
    res.status(404).json({
      status: 'ERROR',
      error: 'NOT_FOUND',
      message: 'Rota de API não encontrada.',
    });
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

    // Explicit fallback for dev server to guarantee SPA route delivery
    app.use('*', async (req, res, next) => {
      // Don't intercept API routes
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const templatePath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
