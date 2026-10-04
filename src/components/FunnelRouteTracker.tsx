import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackMetaEvent, trackStandardMetaEvent } from '../utils/metaPixel';
import { getEspiaProfile } from '../services/espiaSession';
import { maskUsername } from './social/SocialStoriesRow';

export const FunnelRouteTracker: React.FC = () => {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;

    // Prevent duplicate firing on the exact same pathname during state re-renders
    if (lastTrackedPath.current === currentPath) {
      return;
    }
    lastTrackedPath.current = currentPath;

    // Get masked searched username without sending raw PII
    const profile = getEspiaProfile();
    const safeUsername = profile?.username ? maskUsername(profile.username) : undefined;

    const baseParams: Record<string, any> = {
      path: currentPath,
      funnel_version: 'current',
    };

    if (safeUsername) {
      baseParams.searched_username = safeUsername;
    }

    // 1. Fire standard PageView for SPA route navigation
    trackStandardMetaEvent('PageView', { path: currentPath });

    // 2. Map route to Funnel custom event
    let funnelEvent: string | null = null;

    if (currentPath === '/') {
      funnelEvent = 'FunnelLanding';
    } else if (currentPath === '/preparing' || currentPath === '/analyzing') {
      funnelEvent = 'FunnelPreparing';
    } else if (currentPath === '/feed') {
      funnelEvent = 'FunnelFeed';
    } else if (currentPath === '/direct' || currentPath === '/inbox') {
      funnelEvent = 'FunnelDirect';
    } else if (currentPath.startsWith('/chat/')) {
      funnelEvent = 'FunnelChat';
    } else if (currentPath === '/notifications' || currentPath === '/activity') {
      funnelEvent = 'FunnelNotifications';
    } else if (currentPath === '/unlock' || currentPath === '/acesso') {
      funnelEvent = 'FunnelUnlock';
    }

    if (funnelEvent) {
      trackMetaEvent(funnelEvent, baseParams);
    }
  }, [location.pathname]);

  return null;
};
