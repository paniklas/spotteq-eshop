import { z } from "zod";

// Shipping/delivery address — mirrors the shipping fields in checkoutSchema.js and
// the `userInfo.shippingInfo` Sanity object. Used by the account address form and
// the updateUserShippingInfo server action.
// t: translates the error keys (messages: checkout.errors.*, shared with the
// checkout's address fields). Without one the keys are kept as they are.
export function createAddressSchema(t = (key) => key) {
    return z.object({
        firstName:  z.string().min(1, t("firstNameRequired")),
        lastName:   z.string().min(1, t("lastNameRequired")),
        company:    z.string().optional().default(""),
        address:    z.string().min(1, t("addressRequired")),
        apartment:  z.string().optional().default(""),
        city:       z.string().min(1, t("cityRequired")),
        postalCode: z.string().min(1, t("postalCodeRequired")),
        country:    z.string().min(1, t("countryRequired")),
        phone:      z.string().min(1, t("phoneRequired")),
    });
}

// Server-side validation: only pass/fail matters there, the messages are not shown.
export const addressSchema = createAddressSchema();
