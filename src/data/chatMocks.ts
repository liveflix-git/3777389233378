export interface ChatMessage {
  id: string;
  type: 'text' | 'audio' | 'media' | 'heart';
  sender: 'received' | 'sent';
  text?: string;
  audioDuration?: string;
  reaction?: string;
  timestamp?: string;
  imagePreset?: 'romantic' | 'portrait' | 'location';
}

export interface ChatSessionMock {
  chatId: string;
  fallbackName: string;
  status: string;
  messages: ChatMessage[];
}

export const CHAT_MOCKS: Record<string, ChatSessionMock> = {
  chat_1: {
    chatId: 'chat_1',
    fallbackName: 'Fer*****',
    status: 'Online',
    messages: [
      { id: 'c1_1', type: 'text', sender: 'received', text: 'Oi amor ❤️', timestamp: '14:02' },
      { id: 'c1_2', type: 'text', sender: 'received', text: 'Tá podendo falar agora?', timestamp: '14:03' },
      { id: 'c1_3', type: 'text', sender: 'sent', text: 'Oi bb! Tô sim, me fala', timestamp: '14:05' },
      { id: 'c1_4', type: 'text', sender: 'received', text: 'Tava lembrando daquele dia... que saudade de vc', timestamp: '14:06' },
      { id: 'c1_5', type: 'text', sender: 'sent', text: 'Eu tb tô com muita saudade vida 🥰', timestamp: '14:08' },
      { id: 'c1_6', type: 'audio', sender: 'received', audioDuration: '0:32', timestamp: '14:10' },
      { id: 'c1_7', type: 'audio', sender: 'received', audioDuration: '0:14', timestamp: '14:11' },
      { id: 'c1_8', type: 'text', sender: 'sent', text: 'Que voz linda, meu amor kkkk', timestamp: '14:12' },
      { id: 'c1_9', type: 'text', sender: 'received', text: 'Adivinha o que vc esqueceu aqui em casa? kkkk', timestamp: '14:15' },
      { id: 'c1_10', type: 'text', sender: 'sent', text: 'Minha chave ou o casaco? 😲', timestamp: '14:16' },
      { id: 'c1_11', type: 'media', sender: 'received', reaction: '❤️', imagePreset: 'romantic', timestamp: '14:17' },
      { id: 'c1_12', type: 'text', sender: 'sent', text: 'Nossa, nem acredito que deixei aí hahaha', timestamp: '14:18' },
      { id: 'c1_13', type: 'text', sender: 'received', text: 'Pois é! Quando vc vem buscar?', timestamp: '14:19' },
      { id: 'c1_14', type: 'text', sender: 'sent', text: 'Passo aí mais tarde, tô saindo do trabalho já', timestamp: '14:20' },
      { id: 'c1_15', type: 'text', sender: 'received', text: 'Pode deixar, fico te esperando aqui então 😘', timestamp: '14:21' },
      { id: 'c1_16', type: 'text', sender: 'sent', text: 'Beijo vida, até já já!', timestamp: '14:22' },
      { id: 'c1_17', type: 'text', sender: 'received', text: 'Vem com cuidado, bjs!', timestamp: '14:23' },
      { id: 'c1_18', type: 'heart', sender: 'sent', timestamp: '14:24' },
    ],
  },
  chat_2: {
    chatId: 'chat_2',
    fallbackName: 'Bia*****',
    status: 'Online',
    messages: [
      { id: 'c2_1', type: 'text', sender: 'received', text: 'Oii sumido(a)! kkkk', timestamp: '11:00' },
      { id: 'c2_2', type: 'text', sender: 'sent', text: 'Eu sumido? Vc que não me manda mais nada 🙄', timestamp: '11:02' },
      { id: 'c2_3', type: 'text', sender: 'received', text: 'Mano, vc não sabe o que aconteceu ontem...', timestamp: '11:05' },
      { id: 'c2_4', type: 'text', sender: 'sent', text: 'O que?? Conta tudo haha', timestamp: '11:06' },
      { id: 'c2_5', type: 'text', sender: 'received', text: 'Já cheguei, só pra te avisar...', timestamp: '11:08' },
      { id: 'c2_6', type: 'text', sender: 'sent', text: 'Sério?? Nem me avisou antes kkkk', timestamp: '11:09' },
      { id: 'c2_7', type: 'text', sender: 'received', text: 'Foi meio de última hora! Mas ó, já tô por perto', timestamp: '11:11' },
      { id: 'c2_8', type: 'text', sender: 'sent', text: 'Bora tomar um café/uma breja então?', timestamp: '11:12' },
      { id: 'c2_9', type: 'text', sender: 'received', text: 'Bora!! Me dá 20 minutos pra me arrumar', timestamp: '11:14' },
      { id: 'c2_10', type: 'media', sender: 'received', reaction: '🔥', imagePreset: 'portrait', timestamp: '11:15' },
      { id: 'c2_11', type: 'text', sender: 'sent', text: 'Eita, que look hein 👀 kkkk', timestamp: '11:16' },
      { id: 'c2_12', type: 'text', sender: 'received', text: 'Gostou? Te mandei só de prévia 😉', reaction: '❤️', timestamp: '11:18' },
      { id: 'c2_13', type: 'text', sender: 'sent', text: 'kkkkkkkkk aprovadíssimo!', timestamp: '11:19' },
      { id: 'c2_14', type: 'text', sender: 'received', text: 'Me espera na esquina daí?', timestamp: '11:21' },
      { id: 'c2_15', type: 'text', sender: 'sent', text: 'Tô descendo já!', timestamp: '11:22' },
      { id: 'c2_16', type: 'text', sender: 'received', text: 'Fechado ✌️', timestamp: '11:23' },
    ],
  },
  chat_3: {
    chatId: 'chat_3',
    fallbackName: 'Giu*****',
    status: 'Online',
    messages: [
      { id: 'c3_1', type: 'text', sender: 'received', text: 'Oi... tá sozinho?', timestamp: '22:30' },
      { id: 'c3_2', type: 'text', sender: 'sent', text: 'Oi! Tô sim, o que houve?', timestamp: '22:31' },
      { id: 'c3_3', type: 'text', sender: 'received', text: 'Preciso te contar uma coisa, mas me promete que não vai falar pra ninguém', timestamp: '22:33' },
      { id: 'c3_4', type: 'text', sender: 'sent', text: 'Prometo ué, sabe que pode confiar em mim', timestamp: '22:34' },
      { id: 'c3_5', type: 'text', sender: 'received', text: 'Não fala nada ainda... é meio tenso', timestamp: '22:35' },
      { id: 'c3_6', type: 'text', sender: 'sent', text: 'Nossa, tá me deixando curioso kkkk o que é?', timestamp: '22:36' },
      { id: 'c3_7', type: 'audio', sender: 'received', audioDuration: '0:45', timestamp: '22:37' },
      { id: 'c3_8', type: 'text', sender: 'sent', text: 'Manooo... sério isso? Não acredito!', timestamp: '22:38' },
      { id: 'c3_9', type: 'text', sender: 'received', text: 'Pois é! Apaga essa mensagem depois por favor', timestamp: '22:40' },
      { id: 'c3_10', type: 'text', sender: 'sent', text: 'Pode deixar, já apaguei na minha mente kkkk', timestamp: '22:41' },
      { id: 'c3_11', type: 'media', sender: 'received', reaction: '😱', imagePreset: 'location', timestamp: '22:42' },
      { id: 'c3_12', type: 'text', sender: 'sent', text: 'Caramba, o print não mente mesmo', timestamp: '22:43' },
      { id: 'c3_13', type: 'text', sender: 'received', text: 'Pois é... depois me liga pra gente conversar direito', timestamp: '22:45' },
      { id: 'c3_14', type: 'text', sender: 'sent', text: 'Te ligo assim que sair daqui, fica tql', timestamp: '22:46' },
      { id: 'c3_15', type: 'text', sender: 'received', text: 'Fechou, me avisa!', timestamp: '22:47' },
    ],
  },
};

export function getChatMockWithTargetName(chatId: string, targetName: string): ChatSessionMock {
  const base = CHAT_MOCKS[chatId] || CHAT_MOCKS.chat_1;
  const messages = base.messages.map((m) => {
    if (m.id === 'c1_9') {
      return {
        ...m,
        text: `${targetName}, adivinha o que vc esqueceu aqui em casa? kkkk`,
      };
    }
    return m;
  });

  return {
    ...base,
    messages,
  };
}
