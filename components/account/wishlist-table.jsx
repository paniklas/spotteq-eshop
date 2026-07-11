"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Heart, Eye } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import { useFavouritesStore } from "@/store/favourites-store";
import { formatPrice } from "@/utils/formatPrice";

const thumb = (image) =>
    typeof image === "string" ? image : image ? urlFor(image).width(120).url() : null;

// Client table for the account wishlist. Seeded from server data, removals are
// optimistic (row drops immediately) and routed through the favourites store so
// the count on the dashboard and hearts elsewhere stay in sync; on failure the
// row is restored.
export default function WishlistTable({ favourites }) {
    const t = useTranslations("account");
    const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite);
    const [rows, setRows] = useState(favourites);
    const [removing, setRemoving] = useState({});

    const handleRemove = async (id) => {
        if (removing[id]) return;
        const removed = rows.find((p) => p._id === id);
        setRemoving((r) => ({ ...r, [id]: true }));
        setRows((rs) => rs.filter((p) => p._id !== id));

        const result = await toggleFavourite(id);

        setRemoving((r) => {
            const next = { ...r };
            delete next[id];
            return next;
        });

        if (!result?.ok) {
            // Re-insert only this row (functional update), so a failure during
            // rapid multi-removal doesn't resurrect other already-removed rows.
            if (removed) {
                setRows((rs) => (rs.some((p) => p._id === id) ? rs : [...rs, removed]));
            }
            toast.error(t("wishlistRemoveError"));
        }
    };

    if (rows.length === 0) {
        return (
            <div className="bg-white-custom rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-3">
                <p className="font-aeonik text-[16px] text-black-custom">{t("wishlistEmptyTitle")}</p>
                <p className="font-aeonik text-[13px] text-gray-text max-w-xs">{t("wishlistEmptyDesc")}</p>
            </div>
        );
    }

    return (
        <div className="bg-white-custom rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-160 text-left">
                    <thead>
                        <tr className="border-b border-gray-mint">
                            <th className="font-aeonik text-[11px] uppercase tracking-wide text-gray-text font-normal px-5 xl:px-6 py-4">
                                {t("wishlistProduct")}
                            </th>
                            <th className="font-aeonik text-[11px] uppercase tracking-wide text-gray-text font-normal px-5 xl:px-6 py-4">
                                {t("wishlistPrice")}
                            </th>
                            <th className="font-aeonik text-[11px] uppercase tracking-wide text-gray-text font-normal px-5 xl:px-6 py-4">
                                {t("wishlistStock")}
                            </th>
                            <th className="px-5 xl:px-6 py-4" aria-label={t("wishlistActions")} />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-mint">
                        {rows.map((product) => {
                            const src = thumb(product.image);
                            const slug = product.slug ?? product._id;
                            const isBundle = product.type === "bundle";
                            const href = isBundle ? `/shop/bundle/${slug}` : `/shop/product/${slug}`;
                            const secondaryLine = isBundle ? t("bundle") : product.flavourName;
                            const onSale = product.salePrice != null;
                            const effectivePrice = product.salePrice ?? product.price;
                            const inStock = product.inStock;
                            return (
                                <tr key={product._id} className="align-middle">
                                    {/* Product */}
                                    <td className="px-5 xl:px-6 py-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-12 h-12 rounded-lg bg-gray-soft overflow-hidden shrink-0 relative">
                                                {src && (
                                                    <Image
                                                        src={src}
                                                        alt={product.title ?? ""}
                                                        fill
                                                        unoptimized
                                                        sizes="48px"
                                                        className="object-contain p-1.5"
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="block font-aeonik text-[14px] text-black-custom truncate">
                                                    {product.title}
                                                </span>
                                                {secondaryLine && (
                                                    <span className="block font-aeonik text-[12px] text-gray-text truncate">
                                                        {secondaryLine}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    {/* Price */}
                                    <td className="px-5 xl:px-6 py-4 whitespace-nowrap">
                                        <span className={`font-aeonik text-[14px] ${onSale ? "text-orange-accent" : "text-black-custom"}`}>
                                            {formatPrice(effectivePrice)}€
                                        </span>
                                        {onSale && (
                                            <span className="font-aeonik text-[12px] text-gray-text line-through ml-2">
                                                {formatPrice(product.price)}€
                                            </span>
                                        )}
                                    </td>
                                    {/* Stock */}
                                    <td className="px-5 xl:px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${inStock ? "bg-teal-accent" : "bg-red-400"}`} />
                                            <span className="font-aeonik text-[13px] text-black-custom">
                                                {inStock ? t("inStock") : t("outOfStock")}
                                            </span>
                                        </span>
                                    </td>
                                    {/* Actions */}
                                    <td className="px-5 xl:px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={href}
                                                aria-label={t("wishlistView")}
                                                title={t("wishlistView")}
                                                className="inline-flex items-center justify-center rounded-full w-9 h-9 text-gray-text hover:bg-gray-soft hover:text-black-custom transition-colors"
                                            >
                                                <Eye size={18} strokeWidth={1.5} />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(product._id)}
                                                disabled={!!removing[product._id]}
                                                aria-label={t("wishlistRemove")}
                                                aria-pressed={true}
                                                className="inline-flex items-center justify-center rounded-full w-9 h-9 hover:bg-gray-soft transition-colors disabled:opacity-50 cursor-pointer"
                                            >
                                                <Heart size={18} strokeWidth={1.5} className="fill-orange-accent text-orange-accent transition-transform hover:scale-110" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
