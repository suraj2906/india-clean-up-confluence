"use client";

import { useReducedMotion } from "motion/react";
import { AlertCircle, Angry, CheckCircle2, Frown, Laugh, Loader2, Meh, Send, Smile } from "lucide-react";
import { useState } from "react";

import { contact, feedback, type FeedbackQuestion } from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * The Apps Script Web App that writes each response into the feedback sheet,
 * the one and only destination. It is a separate deployment from the
 * registrations one, so it has its own variable.
 */
const FEEDBACK_ENDPOINT = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT;

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Record<string, string>;
/** Flat string map, because that is what a spreadsheet row wants. */
type Payload = Record<string, string>;

const field =
  "w-full rounded-2xl border border-summit bg-white px-4 py-3 text-base text-ink sm:text-sm " +
  "placeholder:text-muted/60 transition-colors focus:border-sky focus:outline-none";

/**
 * A tappable option. The real control is a visually hidden native radio or
 * checkbox before it (`peer`), so `FormData`, keyboard arrows and screen
 * readers all behave exactly as they do for a plain input; this is only the
 * part people see and tap. `min-h-11` keeps every target at least 44px.
 */
/** One face per point on the rating scale, 1 to 5. Their names come from `faces` in `site.ts`. */
const faceIcons = [Angry, Frown, Meh, Smile, Laugh];

const option =
  "flex min-h-11 cursor-pointer items-center justify-center rounded-2xl border border-summit " +
  "bg-white px-4 py-2.5 text-center text-sm font-medium text-ink transition-colors " +
  "hover:border-sky-700/50 peer-checked:border-sky-700 peer-checked:bg-sky-700 " +
  "peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 " +
  "peer-focus-visible:outline-sky-700";

const withEmail = (text: string) => text.replace("{email}", contact.email);

/**
 * The ICUC 3.0 feedback form, reached from a QR code at the venue. It is
 * modelled on `RegistrationForm` and posts straight from the browser to one
 * place: the feedback Google Sheet. Unlike registration there is no Web3Forms
 * copy. Its free plan's monthly cap is shared with the contact form and
 * registration, it ran out on the event day, and a lost feedback row costs far
 * less than a lost registration, so that quota is left for the forms that need
 * it.
 *
 * The questions are rendered straight out of `feedback.questions` in `site.ts`;
 * this component knows nothing about what is being asked, only how to draw
 * each `type`. Every control is uncontrolled, so `form.reset()` clears it all.
 *
 * The payload is a contract with the Apps Script that writes the sheet, so it
 * is kept deliberately plain: `submitted_at`, `name`, `phone`, then one string
 * per question keyed by its `name`, and nothing else.
 */
export function FeedbackForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const reduced = useReducedMotion();

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
    const name = text(data, "name");
    const phone = text(data, "phone");
    if (name.length < 2) next.name = feedback.name.error;
    // Spaces, dashes and a leading + are fine; what matters is 10 digits, or
    // 12 with India's 91 in front.
    const digits = phone.replace(/[\s-]/g, "").replace(/^\+/, "");
    if (!/^(\d{10}|91\d{10})$/.test(digits)) next.phone = feedback.phone.error;

    const answers: Payload = {};
    for (const q of feedback.questions) {
      const value =
        q.type === "multi"
          ? data
              .getAll(q.name)
              .map((v) => String(v).trim())
              .filter(Boolean)
              .join(", ")
          : text(data, q.name);
      answers[q.name] = value;
      if (!q.optional && value.length === 0) next[q.name] = feedback.required;
    }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      focusFirstError(next, reduced);
      return;
    }

    if (!FEEDBACK_ENDPOINT) {
      setStatus("error");
      setMessage(withEmail(feedback.error.notConnected));
      return;
    }

    const payload: Payload = {
      submitted_at: new Date().toISOString(),
      name,
      phone,
      ...answers,
    };

    setStatus("sending");
    try {
      await postToSheet(payload);
      setStatus("sent");
      form.reset();
    } catch (error) {
      console.warn("Sheet write failed:", error);
      setStatus("error");
      setMessage(withEmail(feedback.error.failed));
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center rounded-4xl border border-leaf/25 bg-leaf-100/60 p-10 text-center">
        <CheckCircle2 className="size-12 text-leaf" aria-hidden />
        <h2 className="mt-5 text-2xl">{feedback.success.title}</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{feedback.success.body}</p>
        <Button variant="ghost" className="mt-7" onClick={() => setStatus("idle")}>
          {feedback.success.again}
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
      {/* Honeypot: visually hidden, never focusable by keyboard. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={feedback.name.label} name="name" error={errors.name} required>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder={feedback.name.placeholder}
            className={field}
          />
        </Field>

        <Field label={feedback.phone.label} name="phone" error={errors.phone} required>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={feedback.phone.placeholder}
            className={field}
          />
        </Field>
      </div>

      <div className="mt-8 grid gap-8 border-t border-summit/60 pt-8">
        {feedback.questions.map((q) => (
          <Question key={q.name} q={q} error={errors[q.name]} />
        ))}
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-2xl bg-alert-100 p-4 text-sm text-ink"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-alert" aria-hidden />
          {message}
        </p>
      )}

      <div className="mt-8">
        <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {feedback.sending}
            </>
          ) : (
            <>
              {feedback.submit}
              <Send className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

/** One entry of `feedback.questions`, drawn according to its `type`. */
function Question({ q, error }: { q: FeedbackQuestion; error?: string }) {
  const hint = q.hint ?? (q.optional ? feedback.optional : undefined);

  if (q.type === "text" || q.type === "textarea") {
    return (
      <Field label={q.label} name={q.name} hint={hint} error={error} required={!q.optional}>
        {q.type === "textarea" ? (
          <textarea
            id={q.name}
            name={q.name}
            rows={4}
            placeholder={q.placeholder}
            className={`${field} resize-y`}
          />
        ) : (
          <input id={q.name} name={q.name} placeholder={q.placeholder} className={field} />
        )}
      </Field>
    );
  }

  if (q.type === "rating") {
    return (
      <Group label={q.label} name={q.name} hint={hint} error={error} required={!q.optional}>
        <div className="grid grid-cols-5 gap-2 sm:max-w-lg">
          {faceIcons.map((Icon, i) => (
            <label key={i} className="relative">
              <input
                type="radio"
                // The first input carries the question's name as its id, so
                // `focusFirstError` can find the group the same way it finds a
                // text field.
                id={i === 0 ? q.name : undefined}
                name={q.name}
                value={String(i + 1)}
                className="peer sr-only"
              />
              <span className={`${option} h-auto flex-col gap-1.5 px-1 py-3`}>
                <Icon className="size-8 sm:size-9" strokeWidth={1.75} aria-hidden />
                <span className="text-[11px] leading-tight sm:text-xs">{q.faces[i]}</span>
              </span>
            </label>
          ))}
        </div>
      </Group>
    );
  }

  // `choice` and `multi` differ only in the kind of input underneath.
  const inputType = q.type === "choice" ? "radio" : "checkbox";
  return (
    <Group label={q.label} name={q.name} hint={hint} error={error} required={!q.optional}>
      <div className="flex flex-wrap gap-2">
        {q.options.map((opt, i) => (
          <label key={opt} className="relative">
            <input
              type={inputType}
              id={i === 0 ? q.name : undefined}
              name={q.name}
              value={opt}
              className="peer sr-only"
            />
            <span className={option}>{opt}</span>
          </label>
        ))}
      </div>
    </Group>
  );
}

/**
 * Take the reader to the first thing they have to fix. `errors` is written in
 * the order the fields are rendered, so its first key is the topmost one, and
 * every field's (or group's first input's) `id` is its `name`. A group's input
 * is visually hidden, so the scroll targets the whole question instead.
 */
function focusFirstError(errors: Errors, reduced: boolean | null) {
  const first = Object.keys(errors)[0];
  const el = first ? document.getElementById(first) : null;
  if (!el) return;

  el.focus({ preventScroll: true });
  const target = el.closest("[data-question]") ?? el;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
}

function text(data: FormData, name: string) {
  return String(data.get(name) ?? "").trim();
}

/**
 * The feedback sheet, through its Apps Script Web App. The body goes as
 * `text/plain` on purpose: that keeps it a CORS *simple* request, which needs
 * no preflight, and an Apps Script Web App cannot answer a preflight because it
 * redirects to a second origin before `doPost` runs. The script parses
 * `e.postData.contents` itself. Don't 'fix' it to application/json.
 */
async function postToSheet(payload: Payload) {
  const res = await fetch(FEEDBACK_ENDPOINT!, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  // A wrong or private deployment URL answers with a Google HTML page (a
  // sign-in screen or an error), not JSON. Say so plainly rather than letting
  // `res.json()` throw an unreadable parse error.
  const body = await res.text();
  let json: { success?: boolean; message?: string };
  try {
    json = JSON.parse(body);
  } catch {
    throw new Error(
      "The feedback endpoint answered with a web page, not JSON. Check the deployment is a " +
        "Web app with access set to Anyone, and that the URL ends in /exec.",
    );
  }
  if (!res.ok || !json.success) throw new Error(json.message ?? "Couldn't record the feedback.");
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
    <div data-question>
      <label htmlFor={name} className="mb-2 flex flex-wrap items-baseline gap-x-2 text-sm font-medium text-ink">
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

/** `Field` for a set of radios or checkboxes, which take a legend rather than a label. */
function Group({
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
    <fieldset data-question aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-3 flex flex-wrap items-baseline gap-x-2 text-sm font-medium text-ink">
        {label}
        {required && <span className="text-alert">*</span>}
        {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
      </legend>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-xs text-alert" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
