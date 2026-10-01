export interface ApproximateVisitorLocation {
  city: string | null;
  region: string | null;
  country: string | null;
}

export type LocationOrigin = 'provider' | 'regional-ui-preview' | 'none';

const STORAGE_KEY = 'espia_approx_region';

/**
 * Fetches the approximate visitor location from backend once per session and caches in sessionStorage
 */
export async function fetchApproximateVisitorLocation(): Promise<ApproximateVisitorLocation> {
  try {
    // 1. Check sessionStorage cache first
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached) as ApproximateVisitorLocation;
    }

    // 2. Query backend approximate IP endpoint
    const res = await fetch('/api/location/approximate', {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: ApproximateVisitorLocation = await res.json();
    const result: ApproximateVisitorLocation = {
      city: data.city || null,
      region: data.region || null,
      country: data.country || null,
    };

    // Cache in sessionStorage for current session
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    return result;
  } catch (err) {
    console.warn('[VisitorLocation] Could not retrieve approximate location:', err);
    return { city: null, region: null, country: null };
  }
}

/**
 * Mapping of known metropolitan areas and state hubs to nearby regional municipalities
 */
const REGIONAL_CITY_CLUSTERS: Record<string, string[]> = {
  // Rio de Janeiro
  'nova friburgo': ['Nova Friburgo', 'Cachoeiras de Macacu', 'Teresópolis', 'Bom Jardim'],
  'rio de janeiro': ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Duque de Caxias'],
  'teresópolis': ['Teresópolis', 'Nova Friburgo', 'Guapimirim', 'Petrópolis'],
  'niteroi': ['Niterói', 'São Gonçalo', 'Maricá', 'Rio de Janeiro'],
  'macaé': ['Macaé', 'Rio das Ostras', 'Campos dos Goytacazes', 'Casimiro de Abreu'],

  // São Paulo
  'guarulhos': ['Guarulhos', 'Arujá', 'Mairiporã', 'São Paulo'],
  'são paulo': ['São Paulo', 'Santo André', 'São Bernardo do Campo', 'Osasco'],
  'sao paulo': ['São Paulo', 'Santo André', 'São Bernardo do Campo', 'Osasco'],
  'campinas': ['Campinas', 'Sumaré', 'Hortolândia', 'Valinhos'],
  'santos': ['Santos', 'São Vicente', 'Guarujá', 'Praia Grande'],
  'sorocaba': ['Sorocaba', 'Votorantim', 'Itu', 'Salto'],
  'são josé dos campos': ['São José dos Campos', 'Jacareí', 'Taubaté', 'Caçapava'],

  // Minas Gerais
  'belo horizonte': ['Belo Horizonte', 'Nova Lima', 'Contagem', 'Betim'],
  'juiz de fora': ['Juiz de Fora', 'Matias Barbosa', 'Lima Duarte', 'Santos Dumont'],
  'uberlândia': ['Uberlândia', 'Araguari', 'Tupaciguara', 'Uberaba'],

  // Paraná
  'curitiba': ['Curitiba', 'São José dos Pinhais', 'Pinhais', 'Araucária'],
  'londrina': ['Londrina', 'Cambé', 'Rolândia', 'Ibiporã'],
  'maringá': ['Maringá', 'Sarandi', 'Paiçandu', 'Mandaguari'],

  // Rio Grande do Sul
  'porto alegre': ['Porto Alegre', 'Canoas', 'Viamão', 'Gravataí'],
  'caxias do sul': ['Caxias do Sul', 'Farroupilha', 'Bento Gonçalves', 'Flores da Cunha'],

  // Santa Catarina
  'florianópolis': ['Florianópolis', 'São José', 'Palhoça', 'Biguaçu'],
  'joinville': ['Joinville', 'Jaraguá do Sul', 'Araquari', 'São Francisco do Sul'],

  // Bahia
  'salvador': ['Salvador', 'Lauro de Freitas', 'Camaçari', 'Simões Filho'],
  'feira de santana': ['Feira de Santana', 'Amélia Rodrigues', 'São Gonçalo dos Campos'],

  // Pernambuco
  'recife': ['Recife', 'Olinda', 'Jaboatão dos Guararapes', 'Paulista'],

  // Ceará
  'fortaleza': ['Fortaleza', 'Caucaia', 'Eusébio', 'Maracanaú'],

  // Distrito Federal / Goiás
  'brasília': ['Brasília', 'Taguatinga', 'Águas Claras', 'Ceilândia'],
  'goiânia': ['Goiânia', 'Aparecida de Goiânia', 'Senador Canedo', 'Trindade'],
};

/**
 * Generates an array of 3 regional preview location names derived from visitor approximate location.
 * Returns empty array if city/region is missing.
 */
export function getRegionalPreviewLocations(
  location: ApproximateVisitorLocation | null
): string[] {
  if (!location || !location.city) {
    return [];
  }

  const rawCity = location.city.trim();
  const lowerCity = rawCity.toLowerCase();

  // 1. Direct cluster match
  if (REGIONAL_CITY_CLUSTERS[lowerCity]) {
    return REGIONAL_CITY_CLUSTERS[lowerCity].slice(0, 3);
  }

  // 2. Partial cluster match
  for (const [key, list] of Object.entries(REGIONAL_CITY_CLUSTERS)) {
    if (lowerCity.includes(key) || key.includes(lowerCity)) {
      return list.slice(0, 3);
    }
  }

  // 3. Dynamic regional fallback using visitor city and state/region
  const regionName = location.region ? location.region.trim() : '';

  if (regionName) {
    return [
      `${rawCity}`,
      `Região de ${rawCity}`,
      `${regionName}`,
    ];
  }

  return [rawCity];
}
