import { initBotId } from 'botid/client/core';
import posthog from 'posthog-js';
import { hasAcceptedCookies } from '@/lib/cookie-consent';

// Vercel BotID: attaches the bot-check headers to fetches that match these
// paths. Every path listed here must call checkBotId() on the server, and every
// checkBotId() call needs its path listed here, or the check fails.
initBotId({
  protect: [
    { path: '/api/newsletter', method: 'POST' },
    { path: '/api/contact', method: 'POST' },
  ],
});

// PostHog analytics (EU cloud), sent through the /sq-relay rewrites in
// next.config. Nothing is captured until the visitor accepts the cookie banner
// (components/common/cookie-banner.jsx opts in/out).
const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
if (posthogToken) {
  posthog.init(posthogToken, {
    api_host: '/sq-relay',
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-08-30',
    opt_out_capturing_by_default: true,
    // Feature flags are not used. Left on, the SDK calls /flags (with the
    // visitor's id) on every load and identify(), even before consent. Not
    // advanced_disable_flags: that also stops remote config, which turns off
    // session replay.
    advanced_disable_feature_flags: true,
  });

  // Keeps PostHog in step with the banner if its own opt-in record is missing
  // (e.g. cleared). No $opt_in event: the visitor accepted earlier.
  if (hasAcceptedCookies() && posthog.has_opted_out_capturing()) {
    posthog.opt_in_capturing({ captureEventName: false });
  }
}
