import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "react-email";

// Shared frame for every SPOTTEQ email: wordmark header, white card, footer.
// Kept to inline styles — email clients ignore stylesheets and web fonts.

export const styles = {
  body:      { backgroundColor: "#f4f4f4", fontFamily: "Helvetica, Arial, sans-serif", margin: 0, padding: "24px 0" },
  container: { backgroundColor: "#ffffff", maxWidth: "600px", margin: "0 auto", padding: "32px", borderRadius: "8px" },
  wordmark:  { fontSize: "22px", fontWeight: 700, letterSpacing: "4px", color: "#000000", margin: "0 0 24px" },
  heading:   { fontSize: "22px", fontWeight: 600, color: "#000000", margin: "0 0 12px" },
  text:      { fontSize: "14px", lineHeight: "22px", color: "#222222", margin: "0 0 12px" },
  muted:     { fontSize: "12px", lineHeight: "18px", color: "#777777", margin: 0 },
  label:     { fontSize: "12px", fontWeight: 600, letterSpacing: "1px", color: "#777777", margin: "0 0 6px" },
  hr:        { borderColor: "#e5e5e5", margin: "24px 0" },
};

// Greek all-caps drop the tonos but keep the dialytika (Ά → Α, ΐ → Ϊ). Done in
// code rather than with CSS text-transform, which most email clients apply
// without removing the accents.
export function toUpperCaseNoAccents(value) {
  return String(value ?? "").toUpperCase().normalize("NFD").replace(/\u0301/g, "").normalize("NFC");
}

export function Label({ children }) {
  return <Text style={styles.label}>{toUpperCaseNoAccents(children)}</Text>;
}

export default function EmailLayout({ lang = "el", preview, footer, children }) {
  return (
    <Html lang={lang}>
      <Head />
      {preview ? <Preview>{preview}</Preview> : null}
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.wordmark}>SPOTTEQ</Text>
          {children}
          <Hr style={styles.hr} />
          <Section>
            <Text style={styles.muted}>{footer}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
