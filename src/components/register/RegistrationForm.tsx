"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AlertCircle,
  CheckCircle2,
  Handshake,
  Loader2,
  Megaphone,
  Send,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";

import { contact, registration, site } from "@/content/site";
import { EASE } from "@/lib/motion";
import { Button } from "@/components/ui/Button";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

/**
 * The Apps Script Web App that writes the row into the Google Sheet. Its source
 * is `scripts/registrations.gs` and `scripts/README.md` is how it gets deployed —
 * the URL is per-deployment, so it lives in the environment rather than here.
 * Unset simply means no sheet: the mail still goes.
 */
const SHEETS_ENDPOINT = process.env.NEXT_PUBLIC_SHEETS_ENDPOINT;

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Record<string, string>;
/** Flat string map, because that is what both a spreadsheet row and Web3Forms want. */
type Payload = Record<string, string>;
/** `skipped` means the destination is not configured, which is not a failure. */
type Delivery = "ok" | "skipped";

const field =
  "w-full rounded-2xl border border-summit bg-white px-4 py-3 text-sm text-ink " +
  "placeholder:text-muted/60 transition-colors focus:border-sky focus:outline-none";

const { oneMentor } = registration;

/** One per `oneMentor.steps`, in the same order. */
const stepIcons = [Users, Trophy, Megaphone, Handshake];

/**
 * The one registration form, for everyone. No server handler: it posts straight
 * from the browser to two destinations at once.
 *
 * The Google Sheet is the record — every registration becomes a row, and which of
 * its two tabs the row lands on is decided by the tick box (see `postToSheet`).
 * Web3Forms is kept alongside it as the copy that survives a broken deployment,
 * on the same access key and therefore the same inbox as `ContactForm` (see the
 * contact-form note in AGENTS.md). A registration counts as captured if *either*
 * accepted it — that is the whole reason both are here — so only losing both is
 * an error the registrant is told about.
 *
 * It carries a second form inside it, and the reveal happens in two stages.
 * Choosing "NGO or clean-up movement" in the dropdown opens the One Mentor, Many
 * Missions explanation — what the session is, how the ten are picked and that
 * five of them leave with a mentor — right above the tick box, because that is
 * the only moment we know the reader is one of the people it is for. Ticking the
 * box then opens the application questions, which are rendered straight out of
 * `registration.oneMentor.questions` in `site.ts`; the component knows nothing
 * about what is being asked.
 *
 * The explanation is deliberately *in* the form rather than in a section under
 * it. Nobody scrolls past a form they came to fill in, so an explainer below it
 * is an explainer nobody reads.
 *
 * The tick box stays visible for every other kind of registrant too — someone
 * who runs an NGO but registers as an individual should still be able to find
 * it — it just doesn't unfold the full pitch until the dropdown says NGO.
 *
 * If `questions` is ever emptied, ticking the box shows `oneMentor.pending`
 * instead and the registration still submits, flagged as a pitch applicant. That
 * is the fallback rather than a temporary notice — the page can be live and
 * collecting names before anyone has decided what the panel needs to know.
 */
export function RegistrationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [pitching, setPitching] = useState(false);
  const [attendee, setAttendee] = useState(registration.attendeeTypes[0]);
  const reduced = useReducedMotion();

  // Two ways in, because either one means the reader is looking at this: the
  // dropdown says NGO, or they ticked the box without it. Ticking without
  // reading is the case that matters most — that is exactly the person who needs
  // to be told what they have just put their hand up for.
  const showPitchInfo = attendee === registration.ngoType || pitching;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Bots fill hidden fields; humans don't. Pretend success and drop it.
    if (data.get("botcheck")) {
      setStatus("sent");
      return;
    }

    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    if (name.length < 2) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = "Enter a valid email address.";

    // Only the revealed track is validated — a question nobody was shown can't
    // be missing.
    const answers: Record<string, string> = {};
    if (pitching) {
      for (const q of oneMentor.questions) {
        const value = String(data.get(q.name) ?? "").trim();
        answers[q.name] = value;
        if (!q.optional && value.length === 0) next[q.name] = "This one is needed to apply.";
      }
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!ACCESS_KEY && !SHEETS_ENDPOINT) {
      setStatus("error");
      setMessage(`This form isn't connected yet — please email us at ${contact.email} instead.`);
      return;
    }

    // One payload, both destinations, so the row and the mail can never disagree
    // about what somebody said.
    const payload: Payload = {
      name,
      email,
      phone: text(data, "phone"),
      organisation: text(data, "organisation"),
      role: text(data, "role"),
      city: text(data, "city"),
      registering_as: attendee,
      one_mentor_many_missions: pitching ? "Yes — wants to pitch" : "No",
      ...answers,
      message: text(data, "message"),
    };

    setStatus("sending");
    const [sheet, mail] = await Promise.allSettled([
      postToSheet(payload, pitching),
      postToMail(payload, { attendee, email, pitching }),
    ]);

    // A half failure is ours to notice, not the registrant's to act on — there is
    // nothing they could do differently, and the other destination has them.
    if (sheet.status === "rejected") console.warn("Sheet write failed:", sheet.reason);
    if (mail.status === "rejected") console.warn("Web3Forms failed:", mail.reason);

    if ([sheet, mail].some((r) => r.status === "fulfilled" && r.value === "ok")) {
      setStatus("sent");
      form.reset();
      // `form.reset()` returns the uncontrolled fields to their defaults but not
      // these two, which React owns.
      setPitching(false);
      setAttendee(registration.attendeeTypes[0]);
      return;
    }

    setStatus("error");
    const failed = [sheet, mail].find((r) => r.status === "rejected");
    const detail = failed?.reason instanceof Error ? failed.reason.message : null;
    setMessage(
      detail
        ? `${detail} Please email us at ${contact.email} instead.`
        : `Something went wrong. Please email us at ${contact.email} instead.`,
    );
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center rounded-4xl border border-leaf/25 bg-leaf-100/60 p-10 text-center">
        <CheckCircle2 className="size-12 text-leaf" aria-hidden />
        <h2 className="mt-5 text-2xl">{registration.success.title}</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          {registration.success.body}
        </p>
        <Button variant="ghost" className="mt-7" onClick={() => setStatus("idle")}>
          {registration.success.again}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-4xl border border-summit/60 bg-white p-6 shadow-soft sm:p-9"
    >
      {/* Honeypot — visually hidden, never focusable by keyboard. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" error={errors.name} required>
          <input id="name" name="name" autoComplete="name" placeholder="Priya Sharma" className={field} />
        </Field>

        <Field label="Email" name="email" error={errors.email} required>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={field}
          />
        </Field>

        <Field label="Phone" name="phone" hint="Optional">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98200 00000"
            className={field}
          />
        </Field>

        <Field label="City" name="city" hint="Optional">
          <input
            id="city"
            name="city"
            autoComplete="address-level2"
            placeholder="Mumbai"
            className={field}
          />
        </Field>

        <Field label="Organisation" name="organisation" hint="Optional">
          <input
            id="organisation"
            name="organisation"
            autoComplete="organization"
            placeholder="NGO, company or college"
            className={field}
          />
        </Field>

        <Field label="Your role there" name="role" hint="Optional">
          <input
            id="role"
            name="role"
            autoComplete="organization-title"
            placeholder="Founder, volunteer, student…"
            className={field}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="I'm registering as" name="attendee">
            <select
              id="attendee"
              name="attendee"
              value={attendee}
              onChange={(e) => setAttendee(e.target.value)}
              className={field}
            >
              {registration.attendeeTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* The One Mentor, Many Missions track. Closed by default: most people
          registering are not applying to pitch, and a form that opens with
          somebody else's application looks like it is not for them. */}
      <div className="mt-7 rounded-3xl border border-sky-700/20 bg-sky-50 p-5 sm:p-6">
        {/* Unfolds the moment the dropdown says NGO, or the moment the box is
            ticked from any other kind of registration — either way, before they
            move on without knowing what they have just applied to. */}
        <AnimatePresence initial={false}>
          {showPitchInfo && (
            <motion.div
              key="one-mentor-explainer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mb-5 border-b border-sky-700/15 pb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {oneMentor.eyebrow}
                </p>
                <h3 className="mt-2 text-lg font-semibold sm:text-xl">{oneMentor.title}</h3>

                <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
                  {oneMentor.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>

                <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {oneMentor.steps.map((step, i) => {
                    const Icon = stepIcons[i] ?? Users;
                    return (
                      <li key={step.title} className="rounded-2xl bg-white/70 p-4">
                        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <h4 className="mt-3 text-sm font-semibold">{step.title}</h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted">{step.body}</p>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={pitching}
            onChange={(e) => setPitching(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-sky-700"
          />
          <span>
            <span className="block text-sm font-semibold text-ink">{oneMentor.question}</span>
            <span className="mt-1 block text-xs leading-relaxed text-muted">{oneMentor.hint}</span>
          </span>
        </label>

        {pitching && (
          <div className="mt-6 border-t border-sky-700/15 pt-6">
            {oneMentor.questions.length === 0 ? (
              <p className="text-sm leading-relaxed text-muted">{oneMentor.pending}</p>
            ) : (
              <div className="grid gap-5">
                {oneMentor.questions.map((q) => (
                  <Field
                    key={q.name}
                    label={q.label}
                    name={q.name}
                    hint={q.hint ?? (q.optional ? "Optional" : undefined)}
                    error={errors[q.name]}
                    required={!q.optional}
                  >
                    {q.type === "textarea" ? (
                      <textarea
                        id={q.name}
                        name={q.name}
                        rows={4}
                        placeholder={q.placeholder}
                        className={`${field} resize-y`}
                      />
                    ) : (
                      <input
                        id={q.name}
                        name={q.name}
                        type={q.type ?? "text"}
                        placeholder={q.placeholder}
                        className={field}
                      />
                    )}
                  </Field>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-5">
        <Field label="Anything else we should know" name="message" hint="Optional">
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Access needs, a group you're bringing, anything at all…"
            className={`${field} resize-y`}
          />
        </Field>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-2xl bg-alert-100 p-4 text-sm text-ink"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-alert" aria-hidden />
          {message}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            <>
              Register
              <Send className="size-4" aria-hidden />
            </>
          )}
        </Button>
        <p className="text-xs text-muted">We&rsquo;ll confirm by email.</p>
      </div>
    </form>
  );
}

/** Every field on this form is a text field, so `File` never comes back. */
function text(data: FormData, name: string) {
  return String(data.get(name) ?? "").trim();
}

/**
 * The Google Sheet, through the Apps Script Web App.
 *
 * `sheet` is what decides which tab the row lands on: pitch applicants go to the
 * One Mentor, Many Missions tab along with their answers, everyone else to the
 * general one. Splitting them at write time rather than with a filter is the
 * point of the arrangement — the panel opens one tab and reads nothing else.
 *
 * The body goes as `text/plain` on purpose. That keeps it a CORS *simple*
 * request, which needs no preflight — and an Apps Script Web App cannot answer a
 * preflight, because it redirects to a second origin before `doPost` ever runs.
 * The script parses `e.postData.contents` itself, so the content type is a
 * formality to everything except the browser. Don't 'fix' it to application/json.
 */
async function postToSheet(payload: Payload, pitching: boolean): Promise<Delivery> {
  if (!SHEETS_ENDPOINT) return "skipped";

  const res = await fetch(SHEETS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      ...payload,
      sheet: pitching ? "one_mentor" : "general",
      submitted_at: new Date().toISOString(),
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? "Couldn't record the registration.");
  }
  return "ok";
}

/**
 * Web3Forms, the same client-side path `ContactForm` takes and the same key, so
 * the same inbox. This is the copy of record's copy: if the Apps Script
 * deployment is broken or has been revoked, the registration still arrives
 * somewhere a person will see it.
 */
async function postToMail(
  payload: Payload,
  { attendee, email, pitching }: { attendee: string; email: string; pitching: boolean },
): Promise<Delivery> {
  if (!ACCESS_KEY) return "skipped";

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      // The pitch applicants are the ones that have to be findable in a full
      // inbox, so they say so in the subject line rather than only in a field.
      subject: pitching
        ? `${site.name} 3.0 registration — ${attendee} — One Mentor, Many Missions`
        : `${site.name} 3.0 registration — ${attendee}`,
      from_name: `${site.name} website`,
      // Replying in the inbox goes to the registrant, not to us.
      replyto: email,
      ...payload,
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? "Something went wrong.");
  return "ok";
}

function Field({
  label,
  name,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 flex items-baseline gap-2 text-sm font-medium text-ink">
        {label}
        {required && <span className="text-alert">*</span>}
        {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="mt-2 text-xs text-alert" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
