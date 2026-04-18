import Image from "next/image";
import FooterNewsletter from "./footer-newsletter";
import ScrollToTopButton from "./scroll-to-top-button";


const footerColumns = [
    {
        heading: "INFORMATION",
        links: ["FAQs and help centre", "Payment & Security", "Shipping & Returns"],
    },
    {
        heading: "TERMS",
        links: ["Terms & Conditions", "Privacy Policy", "Cookies Policy"],
    },
    {
        heading: "COMPANY",
        links: ["ABOUT SPOTTEQ", "CONTACT", "SUPPORT"],
    },
];

const socialLinks = [
    { icon: "/icons/social-instagram.svg", label: "Instagram", href: "#" },
    { icon: "/icons/social-tiktok.svg", label: "TikTok", href: "#" },
    { icon: "/icons/social-facebook.svg", label: "Facebook", href: "#" },
    { icon: "/icons/social-youtube.svg", label: "YouTube", href: "#" },
];

const paymentMethods = [
    { icon: "/images/pay-stripe.png", label: "Stripe", width: 110, height: 22 },
    { icon: "/images/pay-gpay.png", label: "Google Pay", width: 55, height: 50 },
    { icon: "/images/pay-apple.png", label: "Apple Pay", width: 55, height: 65 },
    { icon: "/images/pay-visa.png", label: "Visa", width: 58, height: 50 },
    { icon: "/images/pay-mc.png", label: "Mastercard", width: 50, height: 44 },
];

const Footer = () => {
    return (
        <footer className="w-full bg-white pt-20 xl:pt-42">
            {/* Top section: Newsletter (left) + Links (right) + Back-to-top */}
            <div className="max-w-[1920px] mx-auto page-x pt-16 xl:pt-20 pb-10 xl:pb-14 relative">
                <div className="flex flex-col gap-16">
                    <div className="pb-20">
                        <ScrollToTopButton />
                    </div>

                    <div className="flex flex-col xl:flex-row xl:gap-0 gap-14">
                        {/* Newsletter — left ~50% */}
                        <FooterNewsletter />
            
                        {/* Link columns — right ~50% */}
                        <div className="xl:w-1/2 flex items-start justify-end">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 xl:gap-20">
                                {footerColumns.map((col) => (
                                    <div key={col.heading}>
                                        <h4 className="font-aeonik text-[16px] text-black mb-4 uppercase">
                                            {col.heading}
                                        </h4>
                                        <ul className="flex flex-col pt-6">
                                            {col.links.map((link) => (
                                                <li key={link}>
                                                    <a
                                                        href="#"
                                                        className="font-aeonik text-[16px] text-black uppercase hover:opacity-60 transition-opacity leading-[2.2]"
                                                    >
                                                        {link}
                                                    </a>
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
            <div className="max-w-[1920px] mx-auto px-10 xl:px-[160px] py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Social icons */}
                <div className="flex items-center gap-5">
                    {socialLinks.map((s) => (
                        <a
                            key={s.label}
                            href={s.href}
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
            <div className="max-w-[1920px] mx-auto px-10 xl:px-[160px] pb-8 flex flex-col md:flex-row items-center justify-between gap-3">
                <p className="font-aeonik text-[12px] text-black">
                    © 2026 SPOTTEQ. All Rights Reserved.
                </p>
                <p className="font-aeonik text-[12px] text-black opacity-70">
                    Crafted by pecora nera design studio + Coded by Impruves
                </p>
            </div>

            <div className="max-w-[1920px] mx-auto relative w-full aspect-[1920/305]">
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