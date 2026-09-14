"use client"

import { useTransition } from "react"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { getAlternateSlug } from "@/app/actions/locale"

// Detail routes whose slug differs per locale.
const DETAIL_ROUTE = /^\/shop\/(product|category|bundle)\/([^/]+)$/

export function useLocaleSwitch() {
    const locale = useLocale()
    // next-intl's usePathname returns the path without the locale prefix.
    const pathname = usePathname()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const otherLocale = routing.locales.find((l) => l !== locale)

    const switchLocale = (nextLocale = otherLocale) => {
        if (nextLocale === locale || isPending) return

        startTransition(async () => {
            let href = pathname

            const match = pathname.match(DETAIL_ROUTE)
            if (match) {
                const [, segment, slug] = match
                const alternate = await getAlternateSlug(segment, slug, locale, nextLocale)
                // No translation for this item → fall back to the shop instead of a 404.
                href = alternate ? `/shop/${segment}/${encodeURIComponent(alternate)}` : "/shop/shop-all"
            }

            // Read at click time so the query string survives (e.g. ?redirect_url= on sign-in)
            // without forcing a Suspense boundary for useSearchParams.
            const search = window.location.search

            // Updates after an await are not part of the outer transition.
            startTransition(() => {
                router.replace(`${href}${search}`, { locale: nextLocale })
            })
        })
    }

    return { locale, otherLocale, switchLocale, isPending }
}
