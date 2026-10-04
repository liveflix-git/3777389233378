/**
 * Central helper for Meta Pixel tracking.
 * Provides functions for tracking custom funnel events and standard Meta Pixel events.
 * Strictly avoids transmitting PII (Personally Identifiable Information).
 */

declare global {
  interface Window {
    fbq?: (action: string, eventName: string, params?: Record<string, any>) => void;
  }
}

/**
 * Tracks custom funnel events (e.g. FunnelLanding, FunnelPreparing, FunnelFeed, etc.).
 */
export function trackMetaEvent(eventName: string, params: Record<string, any> = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, {
        funnel_version: 'current',
        ...params,
      });
    }
  } catch (err) {
    console.warn('[MetaPixel] Custom tracking error:', err);
  }
}

/**
 * Tracks standard Meta Pixel events (e.g. PageView, InitiateCheckout).
 */
export function trackStandardMetaEvent(eventName: string, params: Record<string, any> = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', eventName, {
        funnel_version: 'current',
        ...params,
      });
    }
  } catch (err) {
    console.warn('[MetaPixel] Standard tracking error:', err);
  }
}
