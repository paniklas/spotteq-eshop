import { draftMode } from "next/headers";

export async function GET() {
    // No redirect — the DisableDraftMode button calls router.refresh() itself.
    // Returning a plain 204 avoids depending on request.url's host/protocol,
    // which is wrong behind a proxy/tunnel (e.g. ngrok forwards Host as
    // localhost, so a redirect to "/" would point at http://localhost and the
    // browser would block the mixed-content cross-origin fetch).
    const draft = await draftMode();
    draft.disable();
    return new Response(null, { status: 204 });
}
