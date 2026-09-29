"use server"

import { createHash } from "crypto";
import { z } from "zod";
import { backendClient } from "@/sanity/lib/backendClient";
import { getShopEmails, isEmailConfigured, sendEmail } from "@/lib/email/resend";
import { getCopy, normalizeLocale } from "@/lib/email/copy";
import NewsletterWelcomeEmail from "@/lib/email/templates/newsletter-welcome";

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  locale: z.enum(["el", "en"]).optional(),
});

// See newsletterSubscriberType for why the id is dotted and hashed.
function subscriberDocId(email) {
  const emailKey = createHash("sha256").update(email).digest("hex").slice(0, 32);
  return `newsletterSubscriber.${emailKey}`;
}

// Returns { ok: true, alreadySubscribed } or { ok: false, error: "invalid" | "failed" }.
export async function subscribeToNewsletter(input) {
  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const { email } = parsed.data;
  const locale = normalizeLocale(parsed.data.locale);
  const docId = subscriberDocId(email);

  // create() rather than createIfNotExists(): the 409 on an existing id is what
  // tells a new subscriber apart from a repeat, so the welcome email only ever
  // goes out once per address — the form cannot be used to spam an inbox.
  try {
    await backendClient.create({
      _id: docId,
      _type: "newsletterSubscriber",
      email,
      locale,
      subscribedAt: new Date().toISOString(),
    });
  } catch (err) {
    if (err?.statusCode === 409) return { ok: true, alreadySubscribed: true };
    console.error("[newsletter] Subscribe failed:", err);
    return { ok: false, error: "failed" };
  }

  // The subscription is saved; a failed welcome email must not report failure.
  if (isEmailConfigured()) {
    try {
      await sendEmail({
        to: email,
        subject: getCopy(locale).newsletterWelcome.subject,
        react: <NewsletterWelcomeEmail locale={locale} />,
        replyTo: getShopEmails(),
        idempotencyKey: `newsletter-welcome/${docId}`,
      });
    } catch (err) {
      console.error("[newsletter] Welcome email failed for", docId, err);
    }
  }

  return { ok: true, alreadySubscribed: false };
}
