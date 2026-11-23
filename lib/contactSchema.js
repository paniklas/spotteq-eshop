import { z } from "zod";

// Contact form fields, shared by the form (zodResolver) and POST /api/contact so
// both sides validate the same rules.
//
// t: translates the error keys (messages: contact.errors.*). The form passes
// next-intl's t; the server only needs pass/fail and keeps the keys as they are.
export function createContactSchema(t = (key) => key) {
    return z.object({
        fullName:    z.string().trim().min(1, t("fullNameRequired")).max(120, t("tooLong")),
        email:       z.string().trim().toLowerCase().min(1, t("emailRequired")).email(t("emailInvalid")).max(254, t("tooLong")),
        orderNumber: z.string().trim().max(40, t("tooLong")).optional().default(""),
        subject:     z.string().trim().min(1, t("subjectRequired")).max(150, t("tooLong")),
        message:     z.string().trim().min(1, t("messageRequired")).max(5000, t("tooLong")),
        agreeTerms:  z.boolean().refine((v) => v === true, t("agreeTermsRequired")),
    });
}
