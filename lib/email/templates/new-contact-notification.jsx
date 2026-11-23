import { Heading, Section, Text } from "react-email";
import EmailLayout, { Label, styles } from "./email-layout";
import { formatDate, getCopy } from "../copy";

// Sent to the shop inbox for every contact-form message (app/api/contact).
// Reply-To is the sender, so replying answers them directly.
export default function NewContactNotificationEmail({ message, locale }) {
  const { common, newContact: t } = getCopy(locale);

  return (
    <EmailLayout lang={locale} preview={t.preview(message.fullName)} footer={common.footer}>
      <Heading as="h1" style={styles.heading}>
        {t.heading}
      </Heading>
      <Text style={styles.text}>{formatDate(message.submittedAt, locale)}</Text>

      <Section style={{ margin: "20px 0" }}>
        <Label>{t.from}</Label>
        <Text style={{ ...styles.text, margin: 0 }}>{message.fullName}</Text>
        <Text style={styles.text}>{message.email}</Text>

        {message.orderNumber ? (
          <>
            <Label>{t.orderNumber}</Label>
            <Text style={styles.text}>{message.orderNumber}</Text>
          </>
        ) : null}

        <Label>{t.language}</Label>
        <Text style={styles.text}>{message.locale?.toUpperCase()}</Text>

        <Label>{t.subjectLabel}</Label>
        <Text style={styles.text}>{message.subject}</Text>

        <Label>{t.message}</Label>
        <Text style={{ ...styles.text, whiteSpace: "pre-wrap" }}>{message.message}</Text>
      </Section>

      <Text style={{ ...styles.muted, marginTop: "24px" }}>{t.replyHint}</Text>
    </EmailLayout>
  );
}
