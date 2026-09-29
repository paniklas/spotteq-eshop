import { initBotId } from 'botid/client/core';

// Vercel BotID: attaches the bot-check headers to fetches that match these
// paths. Every path listed here must call checkBotId() on the server, and every
// checkBotId() call needs its path listed here, or the check fails.
initBotId({
  protect: [
    { path: '/api/newsletter', method: 'POST' },
  ],
});
