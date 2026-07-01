import { z } from "zod";

// Shipping/delivery address — mirrors the shipping fields in checkoutSchema.js and
// the `userInfo.shippingInfo` Sanity object. Used by the account address form and
// the updateUserShippingInfo server action.
export const addressSchema = z.object({
    firstName:  z.string().min(1, "First name is required"),
    lastName:   z.string().min(1, "Last name is required"),
    company:    z.string().optional().default(""),
    address:    z.string().min(1, "Address is required"),
    apartment:  z.string().optional().default(""),
    city:       z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country:    z.string().min(1, "Country is required"),
    phone:      z.string().min(1, "Phone is required"),
});
