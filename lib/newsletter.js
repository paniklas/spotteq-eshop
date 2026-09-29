import "server-only";
import { createHash } from "crypto";
import { backendClient } from "@/sanity/lib/backendClient";

// Newsletter subscription, shared by the footer signup (app/api/newsletter) and
// the checkout opt-in (Stripe webhook, once the order is paid).

// See newsletterSubscriberType for why the id is dotted and hashed.
export function subscriberDocId(email) {
  const emailKey = createHash("sha256").update(email).digest("hex").slice(0, 32);
  return `newsletterSubscriber.${emailKey}`;
}

// Saves the subscriber. Returns { docId, created }: created is false when the
// address was already subscribed, which callers use to send a welcome email only
// once per address. Throws on any other failure.
//
// create() rather than createIfNotExists(): the 409 on an existing id is what
// tells a new subscriber apart from a repeat, and the first signup's source and
// date are kept rather than overwritten.
//
// source: "footer" | "checkout" — where consent was given.
export async function subscribeToNewsletter({ email, locale, source }) {
  const normalizedEmail = email.trim().toLowerCase();
  const docId = subscriberDocId(normalizedEmail);

  try {
    await backendClient.create({
      _id: docId,
      _type: "newsletterSubscriber",
      email: normalizedEmail,
      locale,
      source,
      subscribedAt: new Date().toISOString(),
    });
    return { docId, created: true };
  } catch (err) {
    if (err?.statusCode === 409) return { docId, created: false };
    throw err;
  }
}
