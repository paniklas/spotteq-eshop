import "server-only";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "../lib/backendClient";

// A bundle is in stock only while every constituent product can supply its
// required quantity — mirrors the derivation used on the bundle cards/cart.
function bundleInStock(bundleProducts) {
    const maxQty = (bundleProducts ?? []).reduce((min, item) => {
        if (item.inventory == null) return min; // unlimited component
        return Math.min(min, Math.floor(item.inventory / (item.quantity || 1)));
    }, Infinity);
    return maxQty === Infinity || maxQty > 0;
}

// Resolves the signed-in user's favourite products AND bundles into one
// normalized shape the wishlist table renders (type, title, slug, image,
// price/salePrice, flavourName, inStock). Empty array for guests.
export async function getUserFavourites(locale) {
    const { userId } = await auth();
    if (!userId) return [];

    const query = `
        *[_type == "userInfo" && userId == $userId][0]{
            "favourites": favourites[]->{
                _id,
                "type": _type,
                "title": title[language == $locale][0].value,
                "slug": slugs[$locale].current,
                image,
                _type == "product" => {
                    "flavourName": flavourName[language == $locale][0].value,
                    price,
                    salePrice,
                    inventory
                },
                _type == "bundle" => {
                    "price": bundlePrice,
                    "salePrice": saleBundlePrice,
                    "bundleProducts": products[]{ quantity, "inventory": product->inventory }
                }
            }
        }.favourites
    `;

    const favourites = await backendClient.fetch(query, { userId, locale });

    return (favourites ?? [])
        .filter(Boolean)
        .map((f) => ({
            _id: f._id,
            type: f.type,
            title: f.title,
            slug: f.slug,
            image: f.image,
            flavourName: f.type === "product" ? f.flavourName : null,
            price: f.price,
            salePrice: f.salePrice,
            inStock:
                f.type === "bundle"
                    ? bundleInStock(f.bundleProducts)
                    : f.inventory == null || f.inventory > 0,
        }));
}
