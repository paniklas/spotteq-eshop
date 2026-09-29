import { Heading, Section, Text } from "react-email";
import EmailLayout, { Label, styles } from "./email-layout";
import OrderDetails from "./order-details";
import { formatDate, getCopy } from "../copy";

// Sent to the customer once Stripe confirms payment.
export default function OrderConfirmationEmail({ order, locale, newsletterSubscribed = false }) {
  const { common, orderConfirmation: t } = getCopy(locale);
  const firstName = order.shippingAddress?.firstName || order.customerName || "";

  return (
    <EmailLayout lang={locale} preview={t.preview(order.orderNumber)} footer={common.footer}>
      <Heading as="h1" style={styles.heading}>{t.heading}</Heading>
      {firstName ? <Text style={styles.text}>{t.greeting(firstName)}</Text> : null}
      <Text style={styles.text}>{t.intro}</Text>

      <Section style={{ margin: "20px 0" }}>
        <Label>{t.orderNumber}</Label>
        <Text style={styles.text}>#{order.orderNumber}</Text>
        <Label>{t.orderDate}</Label>
        <Text style={styles.text}>{formatDate(order.orderDate, locale)}</Text>
      </Section>

      <OrderDetails order={order} locale={locale} />

      {newsletterSubscribed ? (
        <Text style={{ ...styles.text, marginTop: "24px" }}>{t.newsletterSubscribed}</Text>
      ) : null}
      <Text style={{ ...styles.text, marginTop: newsletterSubscribed ? 0 : "24px" }}>{t.questions}</Text>
    </EmailLayout>
  );
}
