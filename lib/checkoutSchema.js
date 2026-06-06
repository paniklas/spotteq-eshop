import { z } from "zod";

const BILLING_REQUIRED_FIELDS = [
  ["billingFirstName",  "First name is required"],
  ["billingLastName",   "Last name is required"],
  ["billingAddress",    "Address is required"],
  ["billingCity",       "City is required"],
  ["billingPostalCode", "Postal code is required"],
  ["billingCountry",    "Country is required"],
  ["billingPhone",      "Phone is required"],
];

export const checkoutSchema = z
  .object({
    // Contact
    email:          z.string().min(1, "Email is required").email("Invalid email address"),
    emailMarketing: z.boolean().default(false),

    // Shipping address
    firstName:  z.string().min(1, "First name is required"),
    lastName:   z.string().min(1, "Last name is required"),
    company:    z.string().optional(),
    address:    z.string().min(1, "Address is required"),
    apartment:  z.string().optional(),
    city:       z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country:    z.string().min(1, "Country is required"),
    phone:      z.string().min(1, "Phone is required"),

    // Flags
    saveInfo:            z.boolean().default(false),
    useShippingAsBilling: z.boolean().default(true),

    // Billing address — validated conditionally in superRefine
    billingFirstName:  z.string().optional(),
    billingLastName:   z.string().optional(),
    billingCompany:    z.string().optional(),
    billingAddress:    z.string().optional(),
    billingApartment:  z.string().optional(),
    billingCity:       z.string().optional(),
    billingPostalCode: z.string().optional(),
    billingCountry:    z.string().optional(),
    billingPhone:      z.string().optional(),

    // Shipping method
    shippingMethodId: z.string().min(1, "Please select a shipping method"),

    // Agreement
    agreeTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.useShippingAsBilling) return;
    for (const [field, message] of BILLING_REQUIRED_FIELDS) {
      if (!data[field]?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
      }
    }
  });
