import { getAnnouncement } from "@/sanity/getData/getAnnouncement";
import { getFirstOrderPromoPercentForDisplay } from "@/sanity/getData/getFirstOrderPromo";
import AnnouncementPromoTrigger from "./announcement-promo-trigger";

// Marquee for whatever the editor writes in Studio (Site Settings →
// Announcement Bar). Without a CTA link, clicking it opens the first-order
// modal, like the mobile HeroPromoBar. The discount itself is still applied at
// checkout from the customer's account, not from anything clicked here.
const AnnouncementBar = async ({ locale }) => {
    const [announcement, firstOrderPromoPercent] = await Promise.all([
        getAnnouncement(locale),
        getFirstOrderPromoPercentForDisplay(),
    ]);
    const text = announcement?.text?.trim();

    // Nothing to say (inactive, or no text for this locale) — render no bar at all.
    if (!text) return null;

    const linkText = announcement.linkText?.trim();
    const link = announcement.link?.trim();

    // Doubled so the -50% translate in the marquee keyframes loops seamlessly.
    const items = Array(10).fill(null);

    const marquee = (
        <div className="flex items-center h-full overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
                {items.concat(items).map((_, i) => (
                    <span
                        key={i}
                        className="font-tt font-light text-[18px] text-black uppercase mx-15"
                    >
                        {text}
                        {linkText && <span className="underline ml-2">{linkText}</span>}
                    </span>
                ))}
            </div>
        </div>
    );

    // Desktop only: on mobile the same promo already sits at the top of the hero
    // (HeroPromoBar), so showing both would say it twice.
    const barClass = "hidden md:block w-full bg-gray-mint h-13 overflow-hidden";

    if (link) {
        return (
            <a
                id="announcement-bar-section"
                href={link}
                className={`${barClass} cursor-pointer`}
                aria-label={linkText ? `${text} — ${linkText}` : text}
            >
                {marquee}
            </a>
        );
    }

    // Only while the promo is on in Studio — never open a modal for a discount
    // checkout would refuse to give.
    if (firstOrderPromoPercent > 0) {
        return (
            <AnnouncementPromoTrigger percent={firstOrderPromoPercent} className={barClass} label={text}>
                {marquee}
            </AnnouncementPromoTrigger>
        );
    }

    return (
        <div id="announcement-bar-section" className={barClass} role="status">
            {marquee}
        </div>
    );
};

export default AnnouncementBar;
