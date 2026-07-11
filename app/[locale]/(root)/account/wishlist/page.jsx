import { getTranslations } from "next-intl/server";
import { Heart } from "lucide-react";
import { getUserFavourites } from "@/sanity/getData/getUserFavourites";
import WishlistTable from "@/components/account/wishlist-table";

export const dynamic = "force-dynamic";

export default async function WishlistPage({ params }) {
    const { locale } = await params;

    const [t, favourites] = await Promise.all([
        getTranslations("account"),
        getUserFavourites(locale),
    ]);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-aeonik text-[24px] xl:text-[32px] text-black-custom">{t("nav.wishlist")}</h1>

            {favourites.length === 0 ? (
                <div className="bg-white-custom rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-3">
                    <Heart size={40} strokeWidth={1.25} className="text-gray-mint" />
                    <p className="font-aeonik text-[16px] text-black-custom">{t("wishlistEmptyTitle")}</p>
                    <p className="font-aeonik text-[13px] text-gray-text max-w-xs">{t("wishlistEmptyDesc")}</p>
                </div>
            ) : (
                <WishlistTable favourites={favourites} />
            )}
        </div>
    );
}
