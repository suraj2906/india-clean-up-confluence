import { readFile } from "node:fs/promises";
import path from "node:path";

import nodemailer from "nodemailer";

import { contact, registration, site } from "@/content/site";
import {
  confirmationEmail,
  ICON_DIR,
  iconCid,
  oneMentorEmail,
  type Registrant,
  type Rendered,
} from "@/lib/email/templates";

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
 * chose, with a large attachment. So it only ever sends our own fixed templates
 * (the name is escaped and capped), refuses cross-origin calls, and holds a
 * best-effort in-memory rate limit per IP and per recipient. That limit lives in
 * one server instance's memory, so it slows abuse rather than preventing it.
 */
export const runtime = "nodejs";
/** Headroom for handing a message with the schedule attached to the SMTP server. */
export const maxDuration = 60;

const { SMTP_HOST = "smtp.gmail.com", SMTP_PORT = "465", SMTP_USER, SMTP_PASS } = process.env;

const WINDOW_MS = 10 * 60 * 1000;
const PER_IP = 5;
const PER_RECIPIENT = 2;
const hits = new Map<string, number[]>();

let schedule: Promise<Buffer> | null = null;

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
    pitching: body.pitching === true,
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
    const { icons, ...confirmation } = confirmationEmail(registrant);
    const sends = [
      transport.sendMail({
        from,
        to: email,
        replyTo,
        ...confirmation,
        attachments: [
          {
            filename: registration.emails.attachment.filename,
            content: await readSchedule(),
            contentType: "application/pdf",
          },
          ...inlineIcons(icons),
        ],
      }),
    ];

    if (registrant.pitching) {
      const { icons: mentorIcons, ...mentor }: Rendered = oneMentorEmail(registrant);
      sends.push(
        transport.sendMail({ from, to: email, replyTo, ...mentor, attachments: inlineIcons(mentorIcons) }),
      );
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

/**
 * Read once per server instance. The file is in `public/`, which the server
 * bundle does not include on its own — `outputFileTracingIncludes` in
 * `next.config.ts` is what puts it next to this route in production.
 */
function readSchedule() {
  schedule ??= readFile(path.join(process.cwd(), "public", registration.emails.attachment.path)).catch(
    (error) => {
      schedule = null;
      throw error;
    },
  );
  return schedule;
}

/** The icon PNGs a template used, attached inline under the content ids it referenced. */
function inlineIcons(names: string[]) {
  return names.map((name) => ({
    filename: `${name}.png`,
    path: path.join(process.cwd(), "public", ICON_DIR, `${name}.png`),
    cid: iconCid(name),
    contentDisposition: "inline" as const,
  }));
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
