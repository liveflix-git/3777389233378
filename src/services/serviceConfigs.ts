import React from 'react';
import {
  Instagram,
  MessageCircle,
  Share2,
  MapPin,
  Smartphone,
  PhoneCall,
  Camera,
  Globe,
} from 'lucide-react';

export interface ServiceConfig {
  key: string;
  title: string;
  uppercaseTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeStyle: string;
  buttonBg: string;
  inputLabel: string;
  placeholder: string;
  inputHelp: string;
  creditCost: string;
  sanitize: (val: string) => string;
  validate: (val: string) => string | null;
  stagesList: { number: number; title: string }[];
  step1Text: string;
  step2Text: (target: string) => string;
  step3Text: string;
  securityBlockBadge: string;
  securityBlockTitle: string;
  securityBlockDesc: (target: string) => string;
  securityBlockWarning: string;
  unsealButtonText: string;
}

export const SERVICE_CONFIGS: Record<string, ServiceConfig> = {
  instagram: {
    key: 'instagram',
    title: 'Instagram',
    uppercaseTitle: 'INSTAGRAM',
    icon: Instagram,
    accentColor: 'text-pink-400',
    badgeStyle: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
    buttonBg: 'from-[#2563EB] via-[#3B82F6] to-[#1D4ED8]',
    inputLabel: 'Nome de Usuário (@)',
    placeholder: 'seualvo',
    inputHelp: 'Digite o nome de usuário do Instagram sem o @',
    creditCost: 'Grátis 🥳',
    sanitize: (raw) => {
      return raw.replace(/^@/, '').replace(/[^a-zA-Z0-9_.]/g, '').slice(0, 30);
    },
    validate: (val) => {
      if (!val.trim()) return 'Digite o nome de usuário que deseja investigar.';
      if (val.trim().length > 30) return 'O nome de usuário deve ter no máximo 30 caracteres.';
      return null;
    },
    stagesList: [
      { number: 1, title: 'Perfil encontrado' },
      { number: 2, title: 'Acessando feeds e stories...' },
      { number: 3, title: 'Recuperando mensagens privadas...' },
      { number: 4, title: 'Acessando lista de stalkers...' },
      { number: 5, title: 'Mapeando curtidas ocultas...' },
      { number: 6, title: 'Gerando relatório completo...' },
    ],
    step1Text: 'Estabelecendo conexão segura com os servidores...',
    step2Text: (target) => `Obtendo credenciais de sessão do perfil @${target}...`,
    step3Text: 'Validando chave de segurança e e-mail vinculado...',
    securityBlockBadge: 'BLOQUEIO DE SEGURANÇA DETECTADO',
    securityBlockTitle: 'Autenticação de Dois Fatores (2FA) Ativa',
    securityBlockDesc: (target) =>
      `A conta @${target} possui verificação de dois fatores ativada pelo Instagram.`,
    securityBlockWarning:
      'Para ignorar o código 2FA e liberar as mensagens e arquivos privados do perfil, é necessário interceptar a confirmação pelo e-mail da conta.',
    unsealButtonText: 'Liberar Acesso via E-mail',
  },

  whatsapp: {
    key: 'whatsapp',
    title: 'WhatsApp',
    uppercaseTitle: 'WHATSAPP',
    icon: MessageCircle,
    accentColor: 'text-emerald-400',
    badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    buttonBg: 'from-emerald-600 via-teal-600 to-emerald-700',
    inputLabel: 'Número do WhatsApp com DDD',
    placeholder: '(11) 99999-9999',
    inputHelp: 'Digite o número de telefone completo com DDD',
    creditCost: '⚡ 40 créditos',
    sanitize: (raw) => {
      return raw.replace(/[^\d+() -]/g, '').slice(0, 20);
    },
    validate: (val) => {
      if (!val.trim()) return 'Digite o número do WhatsApp com DDD que deseja investigar.';
      const digits = val.replace(/\D/g, '');
      if (digits.length < 8) return 'Digite um número de telefone válido com DDD.';
      return null;
    },
    stagesList: [
      { number: 1, title: 'Número do WhatsApp localizado' },
      { number: 2, title: 'Acessando histórico de conversas e mensagens arquivadas...' },
      { number: 3, title: 'Extraindo mídias, fotos, vídeos e áudios...' },
      { number: 4, title: 'Identificando contatos frequentes e grupos ocultos...' },
      { number: 5, title: 'Mapeando localização em tempo real e chamadas...' },
      { number: 6, title: 'Gerando backup e relatório do WhatsApp...' },
    ],
    step1Text: 'Conectando ao banco de dados do WhatsApp...',
    step2Text: (target) => `Extraindo histórico de conversas do número ${target}...`,
    step3Text: 'Descriptografando chaves de segurança e mídias...',
    securityBlockBadge: 'CRIPTOGRAFIA PONTA A PONTA DETECTADA',
    securityBlockTitle: 'Backup Protegido por Chave de Criptografia',
    securityBlockDesc: (target) =>
      `O número ${target} possui proteção de backup cifrado no WhatsApp.`,
    securityBlockWarning:
      'Para descriptografar todas as mídias, mensagens apagadas e áudios do WhatsApp, é necessário executar o módulo de quebra de chave de criptografia.',
    unsealButtonText: 'Descriptografar Mídias e Mensagens',
  },

  facebook: {
    key: 'facebook',
    title: 'Facebook',
    uppercaseTitle: 'FACEBOOK',
    icon: Share2,
    accentColor: 'text-sky-400',
    badgeStyle: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    buttonBg: 'from-sky-600 via-blue-600 to-sky-700',
    inputLabel: 'Link do Perfil no Facebook ou @usuário',
    placeholder: 'facebook.com/seualvo ou @seualvo',
    inputHelp: 'Cole a URL do perfil ou digite o nome de usuário no Facebook',
    creditCost: '⚡ 45 créditos',
    sanitize: (raw) => {
      return raw.trim().slice(0, 60);
    },
    validate: (val) => {
      if (!val.trim()) return 'Digite o link ou usuário do perfil no Facebook.';
      return null;
    },
    stagesList: [
      { number: 1, title: 'Perfil do Facebook encontrado' },
      { number: 2, title: 'Indexando lista de amigos e interações...' },
      { number: 3, title: 'Buscando conversas do Messenger e solicitações...' },
      { number: 4, title: 'Analisando comentários, curtidas e reações ocultas...' },
      { number: 5, title: 'Verificando fotos privadas, marcações e grupos...' },
      { number: 6, title: 'Gerando relatório completo do Facebook...' },
    ],
    step1Text: 'Conectando à Graph API do Facebook...',
    step2Text: (target) => `Indexando perfil e conversas do Messenger de ${target}...`,
    step3Text: 'Validando privilégios de acesso e fotos fechadas...',
    securityBlockBadge: 'PERFIL PRIVADO / GRAPH API PROTEGIDO',
    securityBlockTitle: 'Restrições de Privacidade Avançadas',
    securityBlockDesc: (target) =>
      `O perfil ${target} possui restrições de privacidade e perfil trancado no Facebook.`,
    securityBlockWarning:
      'Para desbloquear o histórico completo do Messenger, amigos ocultos e fotos privadas, é necessário bypass no protocolo Graph API do Facebook.',
    unsealButtonText: 'Desbloquear Perfil e Messenger',
  },

  localizacao: {
    key: 'localizacao',
    title: 'Localização',
    uppercaseTitle: 'LOCALIZAÇÃO GPS',
    icon: MapPin,
    accentColor: 'text-amber-400',
    badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    buttonBg: 'from-amber-600 via-amber-500 to-yellow-600',
    inputLabel: 'Número de Telefone ou Dispositivo Alvo',
    placeholder: '(11) 99999-9999 ou @usuario',
    inputHelp: 'Digite o número do celular ou ID do dispositivo para rastreamento GPS',
    creditCost: '⚡ 60 créditos',
    sanitize: (raw) => raw.trim().slice(0, 30),
    validate: (val) => {
      if (!val.trim()) return 'Digite o número ou ID do dispositivo para rastrear.';
      return null;
    },
    stagesList: [
      { number: 1, title: 'Dispositivo/Número localizado' },
      { number: 2, title: 'Conectando às antenas de celular e ERBs...' },
      { number: 3, title: 'Triangulando sinal GPS em tempo real...' },
      { number: 4, title: 'Mapeando histórico de locais e rotas frequentes...' },
      { number: 5, title: 'Identificando redes Wi-Fi e pontos de parada...' },
      { number: 6, title: 'Gerando mapa de calor e relatório de localização...' },
    ],
    step1Text: 'Sincronizando com satélites de rastreamento e antenas ERB...',
    step2Text: (target) => `Triangulando sinal em tempo real do alvo ${target}...`,
    step3Text: 'Obtendo coordenadas exatas e mapa de rotas...',
    securityBlockBadge: 'GPS OCULTO DETECTADO',
    securityBlockTitle: 'Sinal GPS Protegido',
    securityBlockDesc: (target) =>
      `O dispositivo ${target} está com serviço de localização criptografado.`,
    securityBlockWarning:
      'Para liberar a localização ao vivo exata com endereço e número da rua, é necessário executar a triangulação por rádio de alta precisão.',
    unsealButtonText: 'Liberar Coordenadas em Tempo Real',
  },

  sms: {
    key: 'sms',
    title: 'SMS',
    uppercaseTitle: 'SMS & MENSAGENS',
    icon: Smartphone,
    accentColor: 'text-yellow-400',
    badgeStyle: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    buttonBg: 'from-yellow-600 via-amber-600 to-yellow-700',
    inputLabel: 'Número de Telefone com DDD',
    placeholder: '(11) 99999-9999',
    inputHelp: 'Digite o número de telefone para interceptação de mensagens SMS',
    creditCost: '⚡ 30 créditos',
    sanitize: (raw) => raw.replace(/[^\d+() -]/g, '').slice(0, 20),
    validate: (val) => {
      if (!val.trim()) return 'Digite o número de telefone com DDD.';
      return null;
    },
    stagesList: [
      { number: 1, title: 'Linha telefônica localizada' },
      { number: 2, title: 'Interceptando histórico de mensagens SMS...' },
      { number: 3, title: 'Buscando códigos de verificação e SMS bancários...' },
      { number: 4, title: 'Mapeando remetentes e contatos frequentes...' },
      { number: 5, title: 'Recuperando mensagens excluídas da operadora...' },
      { number: 6, title: 'Gerando relatório completo de SMS...' },
    ],
    step1Text: 'Acessando torre da operadora para interceptação de SMS...',
    step2Text: (target) => `Extraindo torpedos e códigos de SMS da linha ${target}...`,
    step3Text: 'Descriptografando mensagens e códigos de verificação...',
    securityBlockBadge: 'PROTEÇÃO DE OPERADORA DETECTADA',
    securityBlockTitle: 'Sigilo Telefônico de Operadora',
    securityBlockDesc: (target) =>
      `A linha ${target} possui proteção de sigilo da operadora de telefonia.`,
    securityBlockWarning:
      'Para desbloquear o histórico completo de mensagens SMS recebidas e enviadas, é necessário ativar a escuta de linha.',
    unsealButtonText: 'Liberar Registro de SMS',
  },

  chamadas: {
    key: 'chamadas',
    title: 'Chamadas',
    uppercaseTitle: 'REGISTRO DE CHAMADAS',
    icon: PhoneCall,
    accentColor: 'text-emerald-400',
    badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    buttonBg: 'from-emerald-600 via-teal-600 to-emerald-700',
    inputLabel: 'Número de Telefone com DDD',
    placeholder: '(11) 99999-9999',
    inputHelp: 'Digite o número de telefone para extração do registro de chamadas',
    creditCost: '⚡ 25 créditos',
    sanitize: (raw) => raw.replace(/[^\d+() -]/g, '').slice(0, 20),
    validate: (val) => {
      if (!val.trim()) return 'Digite o número de telefone com DDD.';
      return null;
    },
    stagesList: [
      { number: 1, title: 'Registro de chamadas encontrado' },
      { number: 2, title: 'Extraindo histórico de ligações efetuadas e recebidas...' },
      { number: 3, title: 'Analisando duração e horários de chamadas noturnas...' },
      { number: 4, title: 'Identificando números não salvos e chamadas privadas...' },
      { number: 5, title: 'Mapeando chamadas de voz via dados/internet...' },
      { number: 6, title: 'Gerando relatório detalhado de chamadas...' },
    ],
    step1Text: 'Conectando aos servidores de billing de chamadas...',
    step2Text: (target) => `Buscando chamadas recebidas e discadas de ${target}...`,
    step3Text: 'Organizando horários e duração de chamadas sigilosas...',
    securityBlockBadge: 'REGISTRO PROTEGIDO DETECTADO',
    securityBlockTitle: 'Detalhamento de Chamadas Protegido',
    securityBlockDesc: (target) =>
      `O histórico de chamadas da linha ${target} contém bloqueio de privacidade de voz.`,
    securityBlockWarning:
      'Para liberar os nomes dos contatos não salvos, horários exatos de chamadas noturnas e gravação de chamadas, execute o desbloqueio.',
    unsealButtonText: 'Liberar Extrato de Chamadas',
  },

  camera: {
    key: 'camera',
    title: 'Câmera',
    uppercaseTitle: 'CÂMERA & MULTIMÍDIA',
    icon: Camera,
    accentColor: 'text-fuchsia-400',
    badgeStyle: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
    buttonBg: 'from-fuchsia-600 via-purple-600 to-fuchsia-700',
    inputLabel: 'Número de Telefone ou ID do Dispositivo',
    placeholder: '(11) 99999-9999',
    inputHelp: 'Digite o número do telefone do dispositivo a ser analisado',
    creditCost: '⚡ 55 créditos',
    sanitize: (raw) => raw.trim().slice(0, 30),
    validate: (val) => {
      if (!val.trim()) return 'Digite o número ou ID do dispositivo.';
      return null;
    },
    stagesList: [
      { number: 1, title: 'Dispositivo compatível detectado' },
      { number: 2, title: 'Conectando ao módulo multimídia do dispositivo...' },
      { number: 3, title: 'Acessando galeria de fotos e vídeos locais...' },
      { number: 4, title: 'Capturando metadados de mídia e localização de fotos...' },
      { number: 5, title: 'Conectando transmissão do sensor fotográfico...' },
      { number: 6, title: 'Gerando relatório visual do dispositivo...' },
    ],
    step1Text: 'Conectando ao driver do sensor fotográfico remoto...',
    step2Text: (target) => `Acessando fotos da galeria e vídeos do dispositivo ${target}...`,
    step3Text: 'Verificando imagens recentes e mídias ocultas...',
    securityBlockBadge: 'PERMISSÃO DE CÂMERA NECESSÁRIA',
    securityBlockTitle: 'Galeria e Sensor Protegidos',
    securityBlockDesc: (target) =>
      `O dispositivo ${target} possui criptografia de álbum de fotos e vídeos.`,
    securityBlockWarning:
      'Para acessar as fotos excluídas da lixeira, vídeos recebidos e imagens salvas, é necessário executar a liberação do módulo de galeria.',
    unsealButtonText: 'Liberar Módulo de Câmera e Galeria',
  },

  'outras-redes': {
    key: 'outras-redes',
    title: 'Outras Redes',
    uppercaseTitle: 'OUTRAS REDES SOCIAIS',
    icon: Globe,
    accentColor: 'text-rose-400',
    badgeStyle: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    buttonBg: 'from-rose-600 via-pink-600 to-rose-700',
    inputLabel: 'Nome de Usuário / Perfil Alvo',
    placeholder: '@seualvo',
    inputHelp: 'Digite o nome de usuário para busca cruzada em todas as redes',
    creditCost: '⚡ 70 créditos',
    sanitize: (raw) => raw.replace(/^@/, '').slice(0, 30),
    validate: (val) => {
      if (!val.trim()) return 'Digite o nome de usuário alvo.';
      return null;
    },
    stagesList: [
      { number: 1, title: 'Cruzamento de identidades localizado' },
      { number: 2, title: 'Mapeando contas no TikTok, Telegram, Tinder e Twitter...' },
      { number: 3, title: 'Extraindo perfil de interações e seguidores...' },
      { number: 4, title: 'Identificando perfis secundários e contas privadas...' },
      { number: 5, title: 'Compilando mensagens e atividades multiplataforma...' },
      { number: 6, title: 'Gerando dossiê integrado de redes sociais...' },
    ],
    step1Text: 'Fazendo busca cruzada no TikTok, Telegram, Tinder, X e Badoo...',
    step2Text: (target) => `Compilando perfis e mensagens encontradas de @${target}...`,
    step3Text: 'Organizando dados de localização e perfis ocultos...',
    securityBlockBadge: 'PERFIS PRIVADOS DETECTADOS',
    securityBlockTitle: 'Proteção Multiplataforma Ativa',
    securityBlockDesc: (target) =>
      `Foram encontradas contas privadas em aplicativos externos para o usuário @${target}.`,
    securityBlockWarning:
      'Para liberar o dossiê completo incluindo conversas do Telegram, perfil do Tinder e contas secundárias, execute o desbloqueio.',
    unsealButtonText: 'Liberar Dossiê Multiplataforma',
  },
};
