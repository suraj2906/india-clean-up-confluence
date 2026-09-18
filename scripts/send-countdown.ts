/**
 * Sends the "2 days to go" email with the final agenda attached.
 *
 *   npx tsx scripts/send-countdown.ts --test you@example.com [--name Suraj]
 *   npx tsx scripts/send-countdown.ts --list people.csv --log sent.txt
 *
 * Run by hand from a machine with `.env.local`; nothing on the site calls it.
 * It reads the same `SMTP_*` credentials as `/api/register/confirm`, so it sends
 * from the same account. Copy is `registration.emails.countdown` in `site.ts`;
 * markup is `countdownEmail` in `src/lib/email/templates.ts`.
 *
 * `--list` takes a CSV with `name,email` columns and sends one email per row,
 * one at a time with a pause between, so a free Gmail account isn't flagged for
 * a burst. Every address that goes out is appended to `--log`, and anything
 * already in the log is skipped, so a run that stops halfway can simply be run
 * again. Keep the list and the log out of the repo: they are registrants' data.
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";

import nodemailer from "nodemailer";

import { contact, registration, site } from "../src/content/site";
import { countdownEmail } from "../src/lib/email/templates";

const ROOT = path.join(__dirname, "..");
const AGENDA = path.join(ROOT, "public", registration.emails.schedule.path);
const PAUSE_MS = 2000;

function env() {
  const vars: Record<string, string> = {};
  for (const line of readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) vars[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return vars;
}

function arg(flag: string) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
}

/** Minimal CSV: quoted fields with doubled quotes, as Python's csv module writes them. */
function readCsv(file: string) {
  const rows: string[][] = [];
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells = [...line.matchAll(/("(?:[^"]|"")*"|[^,]*)(,|$)/g)]
      .slice(0, -1)
      .map((m) => m[1].replace(/^"|"$/g, "").replace(/""/g, '"'));
    rows.push(cells);
  }
  const [header, ...body] = rows;
  const ni = header.indexOf("name");
  const ei = header.indexOf("email");
  if (ei === -1) throw new Error("The CSV needs an `email` column.");
  return body.map((r) => ({ name: ni === -1 ? "" : (r[ni] ?? ""), email: (r[ei] ?? "").trim().toLowerCase() }));
}

async function main() {
  const test = arg("--test");
  const list = arg("--list");
  const log = arg("--log");
  if (!test && !list) throw new Error("Pass --test <email> or --list <file.csv> --log <file>.");
  if (list && !log) throw new Error("--list needs --log, so a stopped run can resume without double-sending.");

  const { SMTP_HOST = "smtp.gmail.com", SMTP_PORT = "465", SMTP_USER, SMTP_PASS } = env();
  if (!SMTP_USER || !SMTP_PASS) throw new Error("SMTP_USER and SMTP_PASS must be set in .env.local.");

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    pool: true,
    maxConnections: 1,
  });
  const agenda = readFileSync(AGENDA);

  const send = (to: string, name: string) =>
    transport.sendMail({
      from: { name: `${site.name} | ${site.fullName}`, address: SMTP_USER },
      to,
      replyTo: contact.email,
      ...countdownEmail(name),
      attachments: [{ filename: "ICUC 3.0 Final Agenda.pdf", content: agenda, contentType: "application/pdf" }],
    });

  if (test) {
    const info = await send(test, arg("--name") ?? "");
    console.log(`Sent to ${test}: ${info.response}`);
    transport.close();
    return;
  }

  const done = new Set(
    existsSync(log!) ? readFileSync(log!, "utf8").split(/\r?\n/).map((l) => l.trim().toLowerCase()).filter(Boolean) : [],
  );
  const seen = new Set<string>();
  const people = readCsv(list!).filter((p) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.email) || seen.has(p.email)) return false;
    seen.add(p.email);
    return true;
  });
  const todo = people.filter((p) => !done.has(p.email));
  console.log(`${people.length} people, ${people.length - todo.length} already sent, ${todo.length} to send.`);

  let sent = 0;
  const failed: string[] = [];
  for (const [i, p] of todo.entries()) {
    try {
      await send(p.email, p.name);
      appendFileSync(log!, `${p.email}\n`);
      sent++;
      console.log(`[${i + 1}/${todo.length}] sent`);
    } catch (error) {
      failed.push(p.email);
      console.error(`[${i + 1}/${todo.length}] FAILED: ${error instanceof Error ? error.message : error}`);
      // Gmail's daily cap or a blocked account won't clear by retrying the next address.
      if (/limit|quota|5\.4\.5|5\.7\.0|550/i.test(String(error))) {
        console.error("Stopping: this looks like a sending limit. Run again later to resume.");
        break;
      }
    }
    await new Promise((r) => setTimeout(r, PAUSE_MS));
  }

  console.log(`Done. Sent ${sent}, failed ${failed.length}.`);
  transport.close();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
