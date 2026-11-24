import { initBotId } from 'botid/client/core';
import posthog from 'posthog-js';

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
  });

  // Keeps PostHog in step with the banner if its own opt-in record is missing
  // (e.g. cleared). The key is _v2 so choices made under the old "essential
  // cookies only" wording are asked again. Storage can throw (private mode,
  // blocked site data); the visitor then stays opted out.
  try {
    if (localStorage.getItem('spotteq_cookie_consent_v2') === 'accepted' && posthog.has_opted_out_capturing()) {
      posthog.opt_in_capturing();
    }
  } catch {}
}
