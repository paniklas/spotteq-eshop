import { Column, Row, Section, Text } from "react-email";
import { Label, styles } from "./email-layout";
import { formatMoney, getCopy } from "../copy";

// Line items, totals and delivery block shared by the customer confirmation
// and the shop notification. `order` is the shape returned by getOrderForEmail().

const cell      = { ...styles.text, margin: 0, padding: "8px 0", verticalAlign: "top" };
const cellRight = { ...cell, textAlign: "right", whiteSpace: "nowrap" };
const subLine   = { ...styles.muted, margin: "2px 0 0" };
const rowBorder = { borderBottom: "1px solid #eeeeee" };

function ItemRow({ name, details, quantity, lineTotal }) {
  return (
    <Row style={rowBorder}>
      <Column style={cell}>
        {name}
        {details.map((d, i) => (
          <Text key={i} style={subLine}>{d}</Text>
        ))}
      </Column>
      {/* Leading spaces are invisible in HTML but keep columns apart in the plain-text version */}
      <Column style={{ ...cellRight, width: "48px" }}> ×{quantity}</Column>
      <Column style={{ ...cellRight, width: "96px" }}> {lineTotal}</Column>
    </Row>
  );
}

function TotalRow({ label, value, bold }) {
  const weight = bold ? { fontWeight: 700, fontSize: "16px" } : {};
  return (
    <Row>
      <Column style={{ ...cell, padding: "4px 0", ...weight }}>{label}</Column>
      <Column style={{ ...cellRight, padding: "4px 0", ...weight }}> {value}</Column>
    </Row>
  );
}

export function formatAddress(a) {
  if (!a) return [];
  return [
    [a.firstName, a.lastName].filter(Boolean).join(" "),
    a.company,
    [a.address, a.apartment].filter(Boolean).join(", "),
    [a.postalCode, a.city].filter(Boolean).join(" "),
    a.country,
    a.phone,
  ].filter(Boolean);
}

export function orderSubtotal(order) {
  const lines = [...(order.products ?? []), ...(order.bundles ?? [])];
  return lines.reduce((sum, l) => sum + (l.price ?? 0) * (l.quantity ?? 0), 0);
}

export default function OrderDetails({ order, locale }) {
  const t = getCopy(locale).common;
  const money = (n) => formatMoney(n, locale);

  const discount = order.amountDiscount ?? 0;
  const shippingCost = order.shippingCost ?? 0;
  // Any BoxNow field marks a locker delivery: the locker name is optional and
  // can be stored as an empty string.
  const isBoxNow = Boolean(order.boxNowLockerName || order.boxNowLockerAddress || order.boxNowParcelId);

  return (
    <>
      <Section>
        {(order.products ?? []).map((p, i) => (
          <ItemRow
            key={`p${i}`}
            name={p.name ?? "—"}
            details={[p.flavourName].filter(Boolean)}
            quantity={p.quantity}
            lineTotal={money(p.price * p.quantity)}
          />
        ))}
        {(order.bundles ?? []).map((b, i) => (
          <ItemRow
            key={`b${i}`}
            name={`${t.bundle}: ${b.name ?? "—"}`}
            details={(b.contents ?? []).map(
              (c) => `${c.quantity ?? 1} × ${[c.name, c.flavourName].filter(Boolean).join(" – ")}`
            )}
            quantity={b.quantity}
            lineTotal={money(b.price * b.quantity)}
          />
        ))}
      </Section>

      <Section style={{ marginTop: "12px" }}>
        <TotalRow label={t.subtotal} value={money(orderSubtotal(order))} />
        {discount > 0 ? (
          <TotalRow
            label={
              order.firstOrderDiscountApplied
                ? t.firstOrderDiscount
                : order.couponCode
                  ? `${t.discount} (${order.couponCode})`
                  : t.discount
            }
            value={`−${money(discount)}`}
          />
        ) : null}
        <TotalRow label={t.shipping} value={shippingCost > 0 ? money(shippingCost) : t.free} />
        <TotalRow label={t.total} value={money(order.totalPrice)} bold />
      </Section>

      <Section style={{ marginTop: "24px" }}>
        {order.shippingMethodName ? (
          <>
            <Label>{t.shippingMethod}</Label>
            <Text style={styles.text}>{order.shippingMethodName}</Text>
          </>
        ) : null}
        <Label>{isBoxNow ? t.boxNowLocker : t.shippingTo}</Label>
        {(isBoxNow
          ? [order.boxNowLockerName, order.boxNowLockerAddress, ...formatAddress(order.shippingAddress).slice(0, 1)]
          : formatAddress(order.shippingAddress)
        )
          .filter(Boolean)
          .map((line, i) => (
            <Text key={i} style={{ ...styles.text, margin: 0 }}>{line}</Text>
          ))}
        {order.boxNowParcelId ? (
          <>
            <Label>{t.boxNowTracking}</Label>
            <Text style={{ ...styles.text, margin: 0 }}>{order.boxNowParcelId}</Text>
          </>
        ) : null}
      </Section>
    </>
  );
}
