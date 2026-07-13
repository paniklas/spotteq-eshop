import "server-only";
import { backendClient } from "../lib/backendClient";

// Orders belonging to a signed-in user: STRICTLY those linked to their userInfo
// doc. We intentionally do NOT match on the order's `email`, because a guest
// order's email is unverified/attacker-controllable — matching on it would let a
// guest who checks out with someone else's email surface their order (with PII)
// in that person's dashboard. Guest orders placed before an account existed are
// therefore not shown here (a future "claim on login" step could link them).
export async function getUserOrders({ userInfoId, locale }) {
    if (!userInfoId) return [];
    const query = `
        *[_type == "order" && userInfo._ref == $userInfoId]
        | order(orderDate desc) {
            _id,
            orderNumber,
            orderDate,
            status,
            totalPrice,
            currency,
            amountDiscount,
            isGuestCheckout,
            "itemCount": count(products) + count(bundles),
            shippingAddress,
            products[]{
                quantity,
                price,
                selectedFlavour,
                "name": product->title[language == $locale][0].value,
                "sku": product->sku,
                "imageUrl": product->image.asset->url
            },
            bundles[]{
                quantity,
                price,
                selectedFlavours[]{
                    _key,
                    flavourName,
                    quantity,
                    "variantName": variant->title[language == $locale][0].value
                },
                "name": bundle->title[language == $locale][0].value,
                "imageUrl": bundle->image.asset->url
            },
            shippingMethod-> {
                "name": name[language == $locale][0].value,
                price
            },
            boxNowLockerName,
            boxNowLockerAddress,
            boxNowParcelId,
            boxNowParcelStatus
        }
    `;
    return backendClient.fetch(query, { userInfoId, locale });
}
