import "server-only";
import { backendClient } from "@/sanity/lib/backendClient";
import { getShopEmails, sendEmail } from "./resend";
import { formatMoney, getCopy, normalizeLocale } from "./copy";
import OrderConfirmationEmail from "./templates/order-confirmation";
import NewOrderNotificationEmail from "./templates/new-order-notification";

// The shop always reads orders in Greek, whatever language the customer used.
const SHOP_LOCALE = "el";

// Same projection shape as getUserOrders, plus the fields the emails need.
// Titles fall back to Greek when a product has no translation in $locale.
const ORDER_EMAIL_QUERY = `
  *[_type == "order" && _id == $orderId][0]{
    orderNumber,
    orderDate,
    customerName,
    email,
    isGuestCheckout,
    totalPrice,
    amountDiscount,
    shippingCost,
    firstOrderDiscountApplied,
    "couponCode": appliedCoupon.code,
    shippingAddress,
    billingAddress,
    boxNowLockerName,
    boxNowLockerAddress,
    "shippingMethodName": coalesce(
      shippingMethod->name[language == $locale][0].value,
      shippingMethod->name[language == "el"][0].value
    ),
    products[]{
      quantity,
      price,
      "name": coalesce(product->title[language == $locale][0].value, product->title[language == "el"][0].value),
      "flavourName": coalesce(product->flavourName[language == $locale][0].value, product->flavourName[language == "el"][0].value)
    },
    bundles[]{
      quantity,
      price,
      "name": coalesce(bundle->title[language == $locale][0].value, bundle->title[language == "el"][0].value),
      // What is actually in the box: the validated flavour choice, or the
      // bundle's defaults when that choice is missing, empty or incomplete (a
      // variant since deleted) — the same rule decrementInventory() in the
      // Stripe webhook uses. select() rather than coalesce(): coalesce only
      // falls back on null, and an empty array must mean defaults too. Labels
      // come from the referenced products, never from the flavourName the
      // client submitted.
      "contents": select(
        count(selectedFlavours) > 0 && count(selectedFlavours[!defined(variant->_id)]) == 0 => selectedFlavours[]{
          quantity,
          "name": coalesce(variant->title[language == $locale][0].value, variant->title[language == "el"][0].value),
          "flavourName": coalesce(variant->flavourName[language == $locale][0].value, variant->flavourName[language == "el"][0].value)
        },
        bundle->products[]{
          quantity,
          "name": coalesce(product->title[language == $locale][0].value, product->title[language == "el"][0].value),
          "flavourName": coalesce(product->flavourName[language == $locale][0].value, product->flavourName[language == "el"][0].value)
        }
      )
    }
  }
`;

function getOrderForEmail(orderId, locale) {
  return backendClient.fetch(ORDER_EMAIL_QUERY, { orderId, locale });
}

// Sends the customer confirmation and the shop notification for a paid order.
//
// The two run concurrently and each owns its failure (logged only), so neither
// can hold up the other: sent one after the other, a slow first send running
// into the function timeout would stop the second from ever starting, and the
// webhook's paid guard means a redelivery would not retry it. Idempotency keys
// make a repeated call within 24h a no-op at Resend, so a retry can never email
// anyone twice.
//
// newsletterSubscribed: the customer opted in at checkout and is now on the
// list — the confirmation says so, in place of a separate welcome email.
export async function sendOrderPaidEmails(orderId, customerLocale, { newsletterSubscribed = false } = {}) {
  const locale = normalizeLocale(customerLocale);
  const shopEmails = getShopEmails();

  await Promise.all([
    sendCustomerConfirmation(orderId, locale, shopEmails, newsletterSubscribed),
    sendShopNotification(orderId, shopEmails),
  ]);
}

async function sendCustomerConfirmation(orderId, locale, shopEmails, newsletterSubscribed) {
  try {
    const order = await getOrderForEmail(orderId, locale);
    if (!order?.email) throw new Error("order not found or has no email");

    await sendEmail({
      to: order.email,
      subject: getCopy(locale).orderConfirmation.subject(order.orderNumber),
      react: <OrderConfirmationEmail order={order} locale={locale} newsletterSubscribed={newsletterSubscribed} />,
      replyTo: shopEmails,
      idempotencyKey: `order-confirmation/${orderId}`,
    });
  } catch (err) {
    console.error("[email] Order confirmation failed for order", orderId, err);
  }
}

async function sendShopNotification(orderId, shopEmails) {
  if (!shopEmails.length) {
    console.error("[email] ORDER_NOTIFICATION_EMAIL is not set — shop not notified of order", orderId);
    return;
  }

  try {
    const order = await getOrderForEmail(orderId, SHOP_LOCALE);
    if (!order) throw new Error("order not found");

    await sendEmail({
      to: shopEmails,
      subject: getCopy(SHOP_LOCALE).newOrder.subject(order.orderNumber, formatMoney(order.totalPrice, SHOP_LOCALE)),
      react: <NewOrderNotificationEmail order={order} locale={SHOP_LOCALE} />,
      replyTo: order.email,
      idempotencyKey: `new-order-notification/${orderId}`,
    });
  } catch (err) {
    console.error("[email] Shop new-order notification failed for order", orderId, err);
  }
}
