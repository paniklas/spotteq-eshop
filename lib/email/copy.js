// Email copy per locale. Kept beside the templates rather than in
// messages/*.json: emails are rendered outside a next-intl request (the Stripe
// webhook), so there is no request locale to resolve against.

const copy = {
  el: {
    common: {
      footer: "SPOTTEQ · spotteq.com",
      product: "Προϊόν",
      qty: "Ποσ.",
      price: "Τιμή",
      subtotal: "Υποσύνολο",
      discount: "Έκπτωση",
      firstOrderDiscount: "Έκπτωση πρώτης παραγγελίας",
      shipping: "Μεταφορικά",
      free: "Δωρεάν",
      total: "Σύνολο",
      shippingTo: "Αποστολή σε",
      boxNowLocker: "Θυρίδα BoxNow",
      boxNowTracking: "Αριθμός παρακολούθησης BoxNow",
      shippingMethod: "Τρόπος αποστολής",
      bundle: "Πακέτο",
    },
    orderConfirmation: {
      subject: (n) => `Επιβεβαίωση παραγγελίας #${n}`,
      preview: (n) => `Λάβαμε την πληρωμή σου για την παραγγελία #${n}.`,
      heading: "Ευχαριστούμε για την παραγγελία σου!",
      greeting: (name) => `Γεια σου ${name},`,
      intro: "Λάβαμε την πληρωμή σου και ετοιμάζουμε την παραγγελία σου. Θα σε ενημερώσουμε μόλις αποσταλεί.",
      orderNumber: "Αριθμός παραγγελίας",
      orderDate: "Ημερομηνία",
      questions: "Για οποιαδήποτε απορία, απλώς απάντησε σε αυτό το email.",
      newsletterSubscribed: "Σε γράψαμε επίσης στο newsletter του SPOTTEQ, όπως επέλεξες. Θα είσαι από τους πρώτους που μαθαίνουν για προσφορές και νέα.",
    },
    newOrder: {
      subject: (n, total) => `Νέα παραγγελία #${n} — ${total}`,
      preview: (name) => `Νέα πληρωμένη παραγγελία από ${name}.`,
      heading: "Νέα παραγγελία",
      customer: "Πελάτης",
      guest: "Επισκέπτης",
      registered: "Εγγεγραμμένος",
      coupon: "Κουπόνι",
      billingAddress: "Διεύθυνση χρέωσης",
    },
    newsletterWelcome: {
      subject: "Καλώς ήρθες στο SPOTTEQ",
      preview: "Η εγγραφή σου στο newsletter ολοκληρώθηκε.",
      heading: "Καλώς ήρθες!",
      body: "Ευχαριστούμε για την εγγραφή σου στο newsletter του SPOTTEQ. Θα είσαι από τους πρώτους που μαθαίνουν για προσφορές, νέα προϊόντα και νέα μας.",
      visit: "Επισκέψου το κατάστημα",
      notYou: "Αν δεν έκανες εσύ αυτή την εγγραφή, απάντησε σε αυτό το email και θα σε αφαιρέσουμε.",
    },
  },
  en: {
    common: {
      footer: "SPOTTEQ · spotteq.com",
      product: "Product",
      qty: "Qty",
      price: "Price",
      subtotal: "Subtotal",
      discount: "Discount",
      firstOrderDiscount: "First order discount",
      shipping: "Shipping",
      free: "Free",
      total: "Total",
      shippingTo: "Shipping to",
      boxNowLocker: "BoxNow locker",
      boxNowTracking: "BoxNow tracking number",
      shippingMethod: "Shipping method",
      bundle: "Bundle",
    },
    orderConfirmation: {
      subject: (n) => `Order confirmation #${n}`,
      preview: (n) => `We've received your payment for order #${n}.`,
      heading: "Thank you for your order!",
      greeting: (name) => `Hi ${name},`,
      intro: "We've received your payment and are preparing your order. We'll let you know as soon as it ships.",
      orderNumber: "Order number",
      orderDate: "Date",
      questions: "Any questions? Just reply to this email.",
      newsletterSubscribed: "As you asked, we've also subscribed you to the SPOTTEQ newsletter — you'll be among the first to hear about promotions and news.",
    },
    newOrder: {
      subject: (n, total) => `New order #${n} — ${total}`,
      preview: (name) => `New paid order from ${name}.`,
      heading: "New order",
      customer: "Customer",
      guest: "Guest",
      registered: "Registered",
      coupon: "Coupon",
      billingAddress: "Billing address",
    },
    newsletterWelcome: {
      subject: "Welcome to SPOTTEQ",
      preview: "You're subscribed to the SPOTTEQ newsletter.",
      heading: "Welcome!",
      body: "Thanks for subscribing to the SPOTTEQ newsletter. You'll be among the first to hear about promotions, new products and news.",
      visit: "Visit the shop",
      notYou: "If you didn't sign up, reply to this email and we'll remove you.",
    },
  },
};

export function normalizeLocale(locale) {
  return locale === "en" ? "en" : "el";
}

export function getCopy(locale) {
  return copy[normalizeLocale(locale)];
}

export function formatMoney(amount, locale) {
  return new Intl.NumberFormat(normalizeLocale(locale) === "el" ? "el-GR" : "en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(amount ?? 0);
}

export function formatDate(iso, locale) {
  if (!iso) return "";
  return new Intl.DateTimeFormat(normalizeLocale(locale) === "el" ? "el-GR" : "en-IE", {
    dateStyle: "long",
    timeZone: "Europe/Athens",
  }).format(new Date(iso));
}
