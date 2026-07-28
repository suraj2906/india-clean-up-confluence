"use client";

import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";

import { contact, site } from "@/content/site";
import { Button } from "@/components/ui/Button";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const field =
  "w-full rounded-2xl border border-summit bg-white px-4 py-3 text-sm text-ink " +
  "placeholder:text-muted/60 transition-colors focus:border-sky focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");

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
    const body = String(data.get("message") ?? "").trim();

    if (name.length < 2) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = "Enter a valid email address.";
    if (body.length < 10) next.message = "A little more detail helps us route your message.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!ACCESS_KEY) {
      setStatus("error");
      setMessage(
        "This form isn't connected yet. Add NEXT_PUBLIC_WEB3FORMS_KEY to .env.local to start receiving submissions.",
      );
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `${site.name} website — ${data.get("subject")}`,
          from_name: `${site.name} website`,
          name,
          email,
          organisation: data.get("organisation"),
          enquiry: data.get("subject"),
          message: body,
        }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
        setMessage(json.message ?? "Something went wrong. Please email us instead.");
      }
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the server. Check your connection, or email us directly.");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-4xl border border-leaf/25 bg-leaf-100/60 p-10 text-center">
        <CheckCircle2 className="size-12 text-leaf" aria-hidden />
        <h3 className="mt-5 text-2xl">Message received</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Thank you for reaching out. Someone from the ICUC team will reply to you shortly.
        </p>
        <Button variant="ghost" className="mt-7" onClick={() => setStatus("idle")}>
          Send another message
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

        <Field label="Organisation" name="organisation" hint="Optional">
          <input
            id="organisation"
            name="organisation"
            autoComplete="organization"
            placeholder="Collective, company or college"
            className={field}
          />
        </Field>

        <Field label="I'm reaching out about" name="subject">
          <select id="subject" name="subject" defaultValue={contact.subjects[0]} className={field}>
            {contact.subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Message" name="message" error={errors.message} required>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Tell us a little about what you have in mind…"
              className={`${field} resize-y`}
            />
          </Field>
        </div>
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
              Send message
              <Send className="size-4" aria-hidden />
            </>
          )}
        </Button>
        <p className="text-xs text-muted">We usually reply within two working days.</p>
      </div>
    </form>
  );
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
