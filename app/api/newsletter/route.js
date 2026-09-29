import "server-only";
import { z } from "zod";
import { NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { subscribeToNewsletter } from "@/lib/newsletter";
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

// Responds { ok: true } or { ok: false, error: "invalid" | "failed" }.
//
// A new and an already-subscribed address get the same response, so the form
// cannot be used to find out whether someone is on the list.
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

  // A repeat signup is not an error, but gets no second welcome email — the
  // form cannot be used to spam an inbox.
  let docId;
  try {
    const result = await subscribeToNewsletter({ email, locale, source: "footer" });
    if (!result.created) return NextResponse.json({ ok: true });
    docId = result.docId;
  } catch (err) {
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

  return NextResponse.json({ ok: true });
}
