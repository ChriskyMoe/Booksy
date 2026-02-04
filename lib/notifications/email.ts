type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

type EmailResult = {
  id?: string;
  skipped?: boolean;
};

export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const replyTo = process.env.RESEND_REPLY_TO;

  if (!apiKey || !from) {
    return { skipped: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: replyTo,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Email send failed: ${errorText}`);
  }

  const data = (await res.json()) as { id?: string };
  return { id: data.id };
}
