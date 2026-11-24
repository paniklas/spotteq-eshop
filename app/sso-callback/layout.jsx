import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { elGR } from "@clerk/localizations";
import { aeonikProRegular, ttNormsProLight } from "@/fonts/fonts";
import { NO_INDEX } from "@/lib/seo";

export const metadata = { robots: NO_INDEX };

// The OAuth callback sits outside [locale] (the proxy skips locale routing for
// it), so it gets its own document. Greek defaults, as it had under the old root
// layout; the page itself reads the NEXT_LOCALE cookie for its copy and redirect.
export default function SsoCallbackLayout({ children }) {
    return (
        <ClerkProvider
            localization={elGR}
            signInUrl="/el/sign-in"
            signUpUrl="/el/sign-up"
            afterSignOutUrl="/el"
            signInFallbackRedirectUrl="/el/account"
            signUpFallbackRedirectUrl="/el/account"
        >
            <html lang="el">
                <body className={`${aeonikProRegular.variable} ${ttNormsProLight.variable} antialiased bg-black-custom`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
