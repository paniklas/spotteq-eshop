import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import FooterNewsletter from "./footer-newsletter";
import ScrollToTopButton from "./scroll-to-top-button";


// Labels are footer.headings.* / footer.links.* messages. `href` is omitted
// while a destination page doesn't exist yet — those render as inert links,
// as they did before.
const footerColumns = [
    {
        heading: "information",
        links: [
            { key: "faq", href: "/faq" },
            { key: "shippingPayments", href: "/shipping" },
            { key: "returns", href: "/returns" },
        ],
    },
    {
        heading: "terms",
        links: [
            { key: "termsOfUse", href: "/terms" },
            { key: "privacy", href: "/privacy" },
            { key: "cookies", href: "/cookies" },
        ],
    },
    {
        heading: "company",
        links: [
            { key: "about", href: "/about" },
            { key: "contact", href: "/contact" },
            // { key: "support" }, — hidden for now (no message yet)
        ],
    },
];

const footerLinkClass =
    "font-aeonik text-[16px] text-black uppercase hover:opacity-60 transition-opacity leading-[2.2]";

const socialLinks = [
    { icon: "/icons/social-instagram.svg", label: "Instagram", href: "https://www.instagram.com/spotteqcom/" },
    { icon: "/icons/social-tiktok.svg", label: "TikTok", href: "https://www.tiktok.com/@spotteqcom" },
    { icon: "/icons/social-facebook.svg", label: "Facebook", href: "https://www.facebook.com/spotteqcom/" },
    { icon: "/icons/social-youtube.svg", label: "YouTube", href: "https://www.youtube.com/@spotteqcom" },
];

// Sizes are the SVGs' viewBoxes (the designer's export size).
const paymentMethods = [
    { icon: "/images/pay-stripe.svg", label: "Stripe", width: 102, height: 24 },
    { icon: "/images/pay-gpay.svg", label: "Google Pay", width: 53, height: 24 },
    { icon: "/images/pay-apple.svg", label: "Apple Pay", width: 53, height: 24 },
    { icon: "/images/pay-visa.svg", label: "Visa", width: 53, height: 24 },
    { icon: "/images/pay-mc.svg", label: "Mastercard", width: 42, height: 24 },
];

// `locale` is passed explicitly: on the force-static home page the server
// i18n Link has no request to read it from and would fall back to el.
const Footer = async ({ locale }) => {
    const t = await getTranslations({ locale, namespace: "footer" });

    return (
        <footer id="footer-section" className="w-full bg-white-custom pt-5 xl:pt-42">
            {/* Top section: Newsletter (left) + Links (right) + Back-to-top */}
            <div className="max-w-480 mx-auto page-x pt-16 xl:pt-20 pb-8 xl:pb-14 relative">
                <div className="flex flex-col gap-16">
                    <div className="hidden xl:block pb-20">
                        <ScrollToTopButton />
                    </div>

                    <div className="flex flex-col xl:flex-row xl:gap-0 gap-14">
                        {/* Newsletter — left ~50% */}
                        <FooterNewsletter />
            
                        {/* Link columns — right ~50% */}
                        <div className="xl:w-1/2 flex items-start justify-start xl:justify-end">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 xl:gap-20">
                                {footerColumns.map((col) => (
                                    <div key={col.heading}>
                                        <h4 className="font-aeonik text-[16px] text-black uppercase">
                                            {t(`headings.${col.heading}`)}
                                        </h4>
                                        <ul className="flex flex-col xl:pt-6">
                                            {col.links.map((link) => (
                                                <li key={link.key}>
                                                    {link.href ? (
                                                        <Link href={link.href} locale={locale} className={footerLinkClass}>
                                                            {t(`links.${link.key}`)}
                                                        </Link>
                                                    ) : (
                                                        <a href="#" className={footerLinkClass}>
                                                            {t(`links.${link.key}`)}
                                                        </a>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
    
            {/* Social + Payment row */}
            <div className="max-w-480 mx-auto px-10 xl:px-40 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Social icons */}
                <div className="flex items-center gap-5">
                    {socialLinks.map((s) => (
                        <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.label}
                            className="hover:opacity-60 transition-opacity"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={s.icon}
                                alt={s.label}
                                className="w-7 h-7"
                            />
                        </a>
                    ))}
                </div>

                {/* Payment methods */}
                <div className="flex items-center gap-2">
                    {paymentMethods.map((p) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={p.label}
                            src={p.icon}
                            alt={p.label}
                            width={p.width}
                            height={p.height}
                        />
                    ))}
                </div>
            </div>
    
            {/* Copyright row */}
            <div className="max-w-480 mx-auto px-10 xl:px-40 pb-8 flex flex-col md:flex-row items-center justify-between gap-3">
                <p className="font-aeonik text-[12px] text-black">
                    © 2026 SPOTTEQ, a brand of M100 Impact Agency. All rights reserved.
                </p>
                <p className="font-aeonik text-[12px] text-black opacity-70">
                    Designed by{" "}
                    <a href="https://www.pecoranera.gr/" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                        pecora nera design studio
                    </a>
                    {" "}+ Coded by{" "}
                    <a href="https://www.impruves.com" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                        Impruves Web Dev
                    </a>
                </p>
            </div>

            <div className="max-w-480 mx-auto relative w-full aspect-1920/305">
                <Image
                    src="/images/footer-spotteq-image.png"
                    alt="SPOTTEQ"
                    fill
                    sizes="(max-width: 1920px) 100vw, 1920px"
                    className="object-contain"
                />
            </div>
        </footer>
    )
}

export default Footer