import { aeonikProRegular, ttNormsProLight } from '@/fonts/fonts';
import "./globals.css";
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getLocale } from "next-intl/server";

export default async function RootLayout({ children }) {

  const locale = await getLocale();

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
          className={`
            ${aeonikProRegular.variable}
            ${ttNormsProLight.variable}
            antialiased`
          }
      >
        {children}
      </body>
    </html>
  );
}
