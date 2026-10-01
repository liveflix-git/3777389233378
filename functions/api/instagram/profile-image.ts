export const onRequestGet: PagesFunction = async (context) => {
  const reqUrl = new URL(context.request.url);
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
    console.error('[CloudflarePagesFunction:instagram-profile-image] Proxy error:', err);
    return new Response('Erro no gateway ao buscar a imagem.', {
      status: 502,
      headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' },
    });
  }
};
