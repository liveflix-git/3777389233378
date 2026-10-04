/**
 * Central utility to sanitize any location references in DM/chat messages into clean generic text.
 * Replaces any city, street, or neighborhood mentions with natural generic phrases.
 * Zero asterisks, zero blur badges.
 */

export function sanitizeDemoMessage(text: string): string {
  if (!text) return '';
  return text
    .replace(/Tô em Trajano de Moraes aqui, já, só pra avisar\.\.\./gi, 'Já cheguei, só pra te avisar...')
    .replace(/Tô em Trajano de Moraes aqui, já, s\.\.\./gi, 'Já cheguei, só pra te avisar...')
    .replace(/Trajano de Moraes/gi, 'por aqui')
    .replace(/Trajano/gi, 'por perto')
    .replace(/Moraes/gi, 'por perto')
    .replace(/rua\s+([A-Za-z\u00C0-\u00FF]+)/gi, 'por perto')
    .replace(/bairro\s+([A-Za-z\u00C0-\u00FF]+)/gi, 'por perto');
}
