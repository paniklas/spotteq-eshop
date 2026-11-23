import "server-only";
import { randomUUID } from "crypto";
import { z } from "zod";
import { NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { createContactSchema } from "@/lib/contactSchema";
import { getShopEmails, isEmailConfigured, sendEmail } from "@/lib/email/resend";
import { getCopy, normalizeLocale } from "@/lib/email/copy";
import NewContactNotificationEmail from "@/lib/email/templates/new-contact-notification";

// A route handler rather than a server action so Vercel BotID can protect it,
// as with app/api/newsletter: the form is public and every accepted post writes
// a Sanity document and emails the shop.

// The shop always reads its notifications in Greek (see lib/email/order-emails).
const SHOP_LOCALE = "el";

const requestSchema = createContactSchema().extend({
  locale: z.enum(["el", "en"]).optional(),
});

// Responds { ok: true } or { ok: false, error: "invalid" | "failed" }.
export async function POST(req) {
  const verification = await checkBotId();
  if (verification.isBot) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  // agreeTerms is only a gate: the schema already rejects anything but true.
  const { agreeTerms: _agreeTerms, locale: rawLocale, ...fields } = parsed.data;
  const message = {
    ...fields,
    locale: normalizeLocale(rawLocale),
    submittedAt: new Date().toISOString(),
  };

  // See contactMessageType for why the id is dotted.
  const docId = `contactMessage.${randomUUID()}`;
  try {
    await backendClient.create({ _id: docId, _type: "contactMessage", ...message });
  } catch (err) {
    console.error("[contact] Saving message failed:", err);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }

  // The message is saved; a failed notification must not report failure.
  const shopEmails = getShopEmails();
  if (isEmailConfigured() && shopEmails.length) {
    const notification = <NewContactNotificationEmail message={message} locale={SHOP_LOCALE} />;
    try {
      await sendEmail({
        to: shopEmails,
        subject: getCopy(SHOP_LOCALE).newContact.subject(message.subject),
        react: notification,
        replyTo: message.email,
        idempotencyKey: `contact-notification/${docId}`,
      });
    } catch (err) {
      console.error("[contact] Shop notification failed for", docId, err);
    }
  } else {
    console.warn("[contact] Shop notification skipped: email or ORDER_NOTIFICATION_EMAIL not configured. Message", docId);
  }

  return NextResponse.json({ ok: true });
}
