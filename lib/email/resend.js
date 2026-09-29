import "server-only";
import { Resend } from "resend";
import { render, toPlainText } from "react-email";

// Shared Resend setup. Every transactional email goes through sendEmail() so the
// sender, rendering and error handling live in one place; the templates in
// lib/email/templates only describe content.

const FROM = process.env.RESEND_FROM_EMAIL;

let _client = null;

// Created lazily (not at module load) so a missing key only breaks sending
// email, not every module that imports this one — notably the Stripe webhook,
// where a module-load throw would take down payment confirmation too.
function getClient() {
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY);
  return _client;
}

// The shop inbox(es): receives new-order notifications and customer replies.
// ORDER_NOTIFICATION_EMAIL may be one address or a comma-separated list.
// Returns an array, empty when unset.
export function getShopEmails() {
  return (process.env.ORDER_NOTIFICATION_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && FROM);
}

// Renders a React Email component to HTML + plain text and sends it.
//
// idempotencyKey: Resend drops a repeat send with the same key for 24h, so a
// retried caller cannot email the customer twice. Use a stable key such as
// `order-confirmation/<orderId>`.
//
// Throws on failure — callers decide whether a failed email is fatal.
export async function sendEmail({ to, subject, react, replyTo, idempotencyKey }) {
  if (!isEmailConfigured()) {
    throw new Error("Email misconfigured: RESEND_API_KEY and RESEND_FROM_EMAIL are required.");
  }

  const html = await render(react);
  // Headings keep their case in the plain-text version: the converter's
  // uppercasing leaves the tonos on Greek capitals.
  const text = toPlainText(html, {
    selectors: ["h1", "h2", "h3"].map((selector) => ({ selector, options: { uppercase: false } })),
  });

  const { data, error } = await getClient().emails.send(
    { from: FROM, to, subject, html, text, ...(replyTo?.length ? { replyTo } : {}) },
    idempotencyKey ? { idempotencyKey } : undefined
  );

  if (error) {
    throw new Error(`Resend send failed (${error.name}): ${error.message}`);
  }
  return data;
}
