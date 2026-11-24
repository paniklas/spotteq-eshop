// Cookie banner choice, shared by the banner, instrumentation-client.js and
// sign-out. The _v2 suffix re-asked everyone when analytics were added (choices
// made under the old "essential cookies only" wording no longer count).
export const CONSENT_KEY = "spotteq_cookie_consent_v2";

// True when the visitor clicked Accept. Storage can throw (private mode,
// blocked site data); that counts as not accepted.
export function hasAcceptedCookies() {
    try {
        return localStorage.getItem(CONSENT_KEY) === "accepted";
    } catch {
        return false;
    }
}
