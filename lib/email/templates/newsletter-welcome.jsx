import { Button, Heading, Section, Text } from "react-email";
import EmailLayout, { styles } from "./email-layout";
import { getCopy, normalizeLocale } from "../copy";

// Sent once when an address subscribes to the newsletter.
export default function NewsletterWelcomeEmail({ locale }) {
  const { common, newsletterWelcome: t } = getCopy(locale);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://spotteq.com";
  const shopUrl = `${baseUrl.replace(/\/$/, "")}/${normalizeLocale(locale)}`;

  return (
    <EmailLayout lang={locale} preview={t.preview} footer={common.footer}>
      <Heading as="h1" style={styles.heading}>{t.heading}</Heading>
      <Text style={styles.text}>{t.body}</Text>

      <Section style={{ margin: "24px 0" }}>
        <Button
          href={shopUrl}
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            fontSize: "13px",
            letterSpacing: "1px",
            borderRadius: "20px",
            padding: "12px 28px",
            textDecoration: "none",
          }}
        >
          {t.visit}
        </Button>
      </Section>

      <Text style={styles.muted}>{t.notYou}</Text>
    </EmailLayout>
  );
}
