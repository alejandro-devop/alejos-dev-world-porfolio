import { NextRequest, NextResponse } from "next/server";

/**
 * Contact form delivery.
 *
 * POST /api/contact
 * Body (JSON): { name, email, message, company? }
 *
 * Sends the message to CONTACT_EMAIL_TO via the Resend REST API.
 * `company` is a honeypot field: real users never fill it (it's visually
 * hidden), so a non-empty value gets a fake success without sending.
 *
 * Env:
 *   RESEND_API_KEY     — required; without it the route answers 503 and the
 *                        form falls back to showing the direct email link.
 *   CONTACT_EMAIL_TO   — recipient (default: alejandro.devop@gmail.com).
 *   CONTACT_EMAIL_FROM — verified sender. Default `onboarding@resend.dev`
 *                        works out of the box for sending to your own inbox.
 */

const MAX_NAME = 120;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { status: false, errors: ["not_configured"] },
      { status: 503 },
    );
  }

  let body: { name?: unknown; email?: unknown; message?: unknown; company?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: false, errors: ["invalid_body"] },
      { status: 400 },
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const honeypot = typeof body.company === "string" ? body.company.trim() : "";

  if (honeypot) {
    // Bot: pretend everything went fine.
    return NextResponse.json({ status: true });
  }

  const errors: string[] = [];
  if (!name || name.length > MAX_NAME) errors.push("name");
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) errors.push("email");
  if (!message || message.length > MAX_MESSAGE) errors.push("message");

  if (errors.length > 0) {
    return NextResponse.json({ status: false, errors }, { status: 400 });
  }

  const to = process.env.CONTACT_EMAIL_TO ?? "alejandro.devop@gmail.com";
  const from =
    process.env.CONTACT_EMAIL_FROM ?? "Portfolio <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[Portfolio] Mensaje de ${name}`,
      html: [
        `<p><strong>Nombre:</strong> ${escapeHtml(name)}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
        `<p><strong>Mensaje:</strong></p>`,
        `<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
      ].join("\n"),
      text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });

  if (!response.ok) {
    console.error("[contact] Resend error", response.status, await response.text());
    return NextResponse.json(
      { status: false, errors: ["delivery_failed"] },
      { status: 502 },
    );
  }

  return NextResponse.json({ status: true });
}
