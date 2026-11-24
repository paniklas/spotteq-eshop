import { z } from "zod";

const BILLING_REQUIRED_FIELDS = [
  ["billingFirstName",  "firstNameRequired"],
  ["billingLastName",   "lastNameRequired"],
  ["billingAddress",    "addressRequired"],
  ["billingCity",       "cityRequired"],
  ["billingPostalCode", "postalCodeRequired"],
  ["billingCountry",    "countryRequired"],
  ["billingPhone",      "phoneRequired"],
];

// t: translates the error keys (messages: checkout.errors.*). The checkout form
// passes next-intl's t; without one the keys are kept as they are.
export function createCheckoutSchema(t = (key) => key) {
  return z
    .object({
      // Contact
      email:          z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
      emailMarketing: z.boolean().default(false),

      // Shipping address
      firstName:  z.string().min(1, t("firstNameRequired")),
      lastName:   z.string().min(1, t("lastNameRequired")),
      company:    z.string().optional(),
      address:    z.string().min(1, t("addressRequired")),
      apartment:  z.string().optional(),
      city:       z.string().min(1, t("cityRequired")),
      postalCode: z.string().min(1, t("postalCodeRequired")),
      country:    z.string().min(1, t("countryRequired")),
      phone:      z.string().min(1, t("phoneRequired")),

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
      shippingMethodId: z.string().min(1, t("shippingMethodRequired")),
      boxNowLockerId:   z.string().optional(),

      // Agreement
      agreeTerms: z.boolean().refine((v) => v === true, {
        message: t("agreeTermsRequired"),
      }),
    })
    .superRefine((data, ctx) => {
      if (data.useShippingAsBilling) return;
      for (const [field, key] of BILLING_REQUIRED_FIELDS) {
        if (!data[field]?.trim()) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: t(key) });
        }
      }
    });
}
