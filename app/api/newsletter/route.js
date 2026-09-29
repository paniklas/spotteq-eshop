import "server-only";
import { createHash } from "crypto";
import { z } from "zod";
import { NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { getShopEmails, isEmailConfigured, sendEmail } from "@/lib/email/resend";
import { getCopy, normalizeLocale } from "@/lib/email/copy";
import NewsletterWelcomeEmail from "@/lib/email/templates/newsletter-welcome";

// A route handler rather than a server action so Vercel BotID can protect this
// one endpoint: a server action posts to whichever page it is called from, and
// the footer is on every page, so protecting it would put the bot check on
// every server-action call in the site.

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  locale: z.enum(["el", "en"]).optional(),
});

// See newsletterSubscriberType for why the id is dotted and hashed.
function subscriberDocId(email) {
  const emailKey = createHash("sha256").update(email).digest("hex").slice(0, 32);
  return `newsletterSubscriber.${emailKey}`;
}

// Responds { ok: true, alreadySubscribed } or { ok: false, error: "invalid" | "failed" }.
export async function POST(req) {
  // Before anything else: an unchecked client could otherwise create unlimited
  // subscriber documents and send a welcome email to any address it lists.
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

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

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
    if (err?.statusCode === 409) return NextResponse.json({ ok: true, alreadySubscribed: true });
    console.error("[newsletter] Subscribe failed:", err);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }

  // The subscription is saved; a failed welcome email must not report failure.
  if (isEmailConfigured()) {
    const welcomeEmail = <NewsletterWelcomeEmail locale={locale} />;
    try {
      await sendEmail({
        to: email,
        subject: getCopy(locale).newsletterWelcome.subject,
        react: welcomeEmail,
        replyTo: getShopEmails(),
        idempotencyKey: `newsletter-welcome/${docId}`,
      });
    } catch (err) {
      console.error("[newsletter] Welcome email failed for", docId, err);
    }
  }

  return NextResponse.json({ ok: true, alreadySubscribed: false });
}
