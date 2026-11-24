import { aeonikProRegular, ttNormsProLight } from '@/fonts/fonts';
import "./globals.css";
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getLocale } from "next-intl/server";
import { ClerkProvider } from '@clerk/nextjs';
import { elGR, enUS } from '@clerk/localizations';

export default async function RootLayout({ children }) {

  const locale = await getLocale();

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  return (
    <ClerkProvider
      localization={locale === 'el' ? elGR : enUS}
      signInUrl={`/${locale}/sign-in`}
      signUpUrl={`/${locale}/sign-up`}
      afterSignOutUrl={`/${locale}`}
      signInFallbackRedirectUrl={`/${locale}/account`}
      signUpFallbackRedirectUrl={`/${locale}/account`}
    >
      <html lang={locale} data-scroll-behavior="smooth">
        <body
            className={`
              ${aeonikProRegular.variable}
              ${ttNormsProLight.variable}
              antialiased bg-black-custom`
            }
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
