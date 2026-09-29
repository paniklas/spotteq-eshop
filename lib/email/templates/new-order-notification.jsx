import { Heading, Section, Text } from "react-email";
import EmailLayout, { Label, styles } from "./email-layout";
import OrderDetails, { formatAddress } from "./order-details";
import { formatDate, getCopy } from "../copy";

// Sent to the shop inbox once Stripe confirms payment.
export default function NewOrderNotificationEmail({ order, locale }) {
  const { common, orderConfirmation, newOrder: t } = getCopy(locale);
  const billing = formatAddress(order.billingAddress);

  return (
    <EmailLayout lang={locale} preview={t.preview(order.customerName)} footer={common.footer}>
      <Heading as="h1" style={styles.heading}>
        {t.heading} #{order.orderNumber}
      </Heading>
      <Text style={styles.text}>{formatDate(order.orderDate, locale)}</Text>

      <Section style={{ margin: "20px 0" }}>
        <Label>{t.customer}</Label>
        <Text style={{ ...styles.text, margin: 0 }}>{order.customerName}</Text>
        <Text style={{ ...styles.text, margin: 0 }}>{order.email}</Text>
        <Text style={styles.text}>{order.isGuestCheckout ? t.guest : t.registered}</Text>
        {order.couponCode ? (
          <>
            <Label>{t.coupon}</Label>
            <Text style={styles.text}>{order.couponCode}</Text>
          </>
        ) : null}
      </Section>

      <OrderDetails order={order} locale={locale} />

      {billing.length ? (
        <Section style={{ marginTop: "16px" }}>
          <Label>{t.billingAddress}</Label>
          {billing.map((line, i) => (
            <Text key={i} style={{ ...styles.text, margin: 0 }}>{line}</Text>
          ))}
        </Section>
      ) : null}

      <Text style={{ ...styles.muted, marginTop: "24px" }}>
        {orderConfirmation.orderNumber}: #{order.orderNumber}
      </Text>
    </EmailLayout>
  );
}
