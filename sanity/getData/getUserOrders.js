import "server-only";
import { backendClient } from "../lib/backendClient";

// Orders belonging to a signed-in user: those linked to their userInfo doc OR
// placed (as guest) with the same email before the profile existed.
export async function getUserOrders({ userInfoId, email, locale }) {
    const query = `
        *[_type == "order" && (userInfo._ref == $userInfoId || email == $email)]
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
    return backendClient.fetch(query, {
        userInfoId: userInfoId ?? "",
        email: email ?? "",
        locale,
    });
}
