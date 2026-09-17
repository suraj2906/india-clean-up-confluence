import nodemailer from "nodemailer";

import { contact, registration, site } from "@/content/site";
import { confirmationEmail, oneMentorEmail, type Registrant } from "@/lib/email/templates";

/**
 * Sends the registrant their confirmation — and, if they applied to pitch, the
 * Mentor Matchmaker email — over plain SMTP with an app password.
 *
 * This is the site's one server route, and it is deliberately *not* part of
 * capturing a registration. `RegistrationForm` calls it only after the sheet or
 * Web3Forms has accepted the row, and doesn't wait on it: a mail server being
 * slow or down must never turn a captured registration into an error on screen.
 *
 * Anyone can POST here, and every POST sends mail to an address the caller
 * chose. So it only ever sends our own fixed templates
 * (the name is escaped and capped), refuses cross-origin calls, and holds a
 * best-effort in-memory rate limit per IP and per recipient. That limit lives in
 * one server instance's memory, so it slows abuse rather than preventing it.
 */
export const runtime = "nodejs";
/** Headroom for a slow SMTP handshake. */
export const maxDuration = 30;

const { SMTP_HOST = "smtp.gmail.com", SMTP_PORT = "465", SMTP_USER, SMTP_PASS } = process.env;

const WINDOW_MS = 10 * 60 * 1000;
const PER_IP = 5;
const PER_RECIPIENT = 2;
const hits = new Map<string, number[]>();

export async function POST(request: Request) {
  if (!SMTP_USER || !SMTP_PASS) {
    return Response.json({ success: false, message: "Email is not configured." }, { status: 503 });
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return Response.json({ success: false, message: "Forbidden." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return bad("Invalid request.");

  // The same honeypot the form checks, in case something posts here directly.
  if (body.botcheck) return Response.json({ success: true });

  const email = str(body.email, 254);
  const name = str(body.name, 80);
  const attendee = str(body.attendee, 80);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || name.length < 2) return bad("Invalid request.");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(`ip:${ip}`, PER_IP) || limited(`to:${email.toLowerCase()}`, PER_RECIPIENT)) {
    return Response.json({ success: false, message: "Too many requests." }, { status: 429 });
  }

  const registrant: Registrant = {
    name,
    // Only a value the dropdown can actually produce gets printed back.
    attendee: registration.attendeeTypes.includes(attendee) ? attendee : registration.attendeeTypes[0],
    // No Mentor Matchmaker email once applications are closed, whatever is posted.
    pitching: registration.oneMentor.open && body.pitching === true,
    joiningRedFort: body.joiningRedFort === true,
  };

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const from = { name: `${site.name} | ${site.fullName}`, address: SMTP_USER };
  const replyTo = contact.email;

  try {
    // No attachments on purpose: the schedule is a link. See `registration.emails.schedule`.
    const sends = [transport.sendMail({ from, to: email, replyTo, ...confirmationEmail(registrant) })];

    if (registrant.pitching) {
      sends.push(transport.sendMail({ from, to: email, replyTo, ...oneMentorEmail(registrant) }));
    }

    await Promise.all(sends);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Registration email failed:", error);
    return Response.json({ success: false, message: "Couldn't send the email." }, { status: 502 });
  } finally {
    transport.close();
  }
}

function limited(key: string, max: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

function str(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function bad(message: string) {
  return Response.json({ success: false, message }, { status: 400 });
}
