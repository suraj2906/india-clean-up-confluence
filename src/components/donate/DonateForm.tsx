"use client";

import { AlertCircle, CheckCircle2, HeartHandshake, Loader2, LockKeyhole } from "lucide-react";
import { useRef, useState } from "react";

import { contact, donate, site } from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * The donate form, paid through Razorpay Checkout.
 *
 * Nothing of Razorpay's loads with the page: `checkout.js` is fetched on the
 * first press of Donate, the same click-to-load rule `VideoEmbed` follows, so a
 * reader who never donates never talks to Razorpay. The order (and so the
 * amount charged) is created server-side by `/api/donate/order`, and the
 * signature Checkout returns is checked by `/api/donate/verify` before the page
 * says thank you. With the keys unset the order route answers 503 and the form
 * says donations aren't switched on yet.
 */

type Status = "idle" | "opening" | "paying" | "verifying" | "done" | "error";
type Errors = Partial<Record<"amount" | "name" | "email" | "phone", string>>;

type CheckoutSuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
type CheckoutFailure = { error: { description?: string } };
type Checkout = {
  open(): void;
  on(event: "payment.failed", callback: (response: CheckoutFailure) => void): void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => Checkout;
  }
}

const { form: copy, error: errorCopy } = donate;

const field =
  "w-full rounded-2xl border border-summit bg-white px-4 py-3 text-sm text-ink " +
  "placeholder:text-muted/60 transition-colors focus:border-sky focus:outline-none";

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");

let checkoutScript: Promise<void> | null = null;

function loadCheckout() {
  checkoutScript ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => {
      // Let the next press try again rather than caching the failure.
      checkoutScript = null;
      reject(new Error("Razorpay Checkout failed to load."));
    };
    document.body.appendChild(script);
  });
  return checkoutScript;
}

export function DonateForm() {
  const [choice, setChoice] = useState<number | "custom">(copy.defaultAmount);
  const [custom, setCustom] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState({ amount: "", id: "" });
  /** Checkout reports a declined card and keeps its window open for a retry,
      so the reason is held here until the donor either succeeds or gives up. */
  const declined = useRef<string | null>(null);

  const amount = choice === "custom" ? Number(custom) : choice;
  const amountValid = Number.isInteger(amount) && amount >= copy.min && amount <= copy.max;
  const busy = status === "opening" || status === "paying" || status === "verifying";

  function fail(template: string, values: Record<string, string> = {}) {
    setStatus("error");
    setMessage(fill(template, { email: contact.email, ...values }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // Bots fill hidden fields; humans don't. Nothing to pretend about here —
    // just don't open a payment window for one.
    if (data.get("botcheck")) return;

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    const next: Errors = {};
    if (!amountValid) next.amount = copy.amountError;
    if (name.length < 2) next.name = copy.name.error;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = copy.email.error;
    // Same rule as the feedback form: 10 digits, or 12 with India's 91.
    const digits = phone.replace(/[\s-]/g, "").replace(/^\+/, "");
    if (phone && !/^(\d{10}|91\d{10})$/.test(digits)) next.phone = copy.phone.error;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("opening");
    declined.current = null;

    let order: { id: string; amount: number; currency: string; keyId: string };
    try {
      const res = await fetch("/api/donate/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, name, email, phone }),
      });
      if (res.status === 503) return fail(errorCopy.notConnected);
      const json = await res.json();
      if (!res.ok || !json.success) return fail(errorCopy.failed);
      order = json;
      await loadCheckout();
    } catch {
      return fail(errorCopy.failed);
    }
    if (!window.Razorpay) return fail(errorCopy.failed);

    const formatted = rupees.format(amount);
    // Checkout wants a hex colour, so it borrows the live token rather than
    // repeating one here — `.theme-deck` on <body> decides what that is.
    const color = getComputedStyle(document.body).getPropertyValue("--color-sky-700").trim();

    const checkout = new window.Razorpay({
      key: order.keyId,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      name: site.fullName,
      description: donate.checkoutDescription,
      prefill: { name, email, contact: digits },
      ...(color && { theme: { color } }),
      handler: async (response: CheckoutSuccess) => {
        setStatus("verifying");
        const id = response.razorpay_payment_id;
        try {
          const res = await fetch("/api/donate/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: id,
              signature: response.razorpay_signature,
            }),
          });
          if (!res.ok) return fail(errorCopy.unverified, { id });
          setReceipt({ amount: formatted, id });
          setStatus("done");
        } catch {
          fail(errorCopy.unverified, { id });
        }
      },
      modal: {
        ondismiss: () => {
          if (declined.current) {
            fail(errorCopy.declined, { reason: declined.current });
          } else {
            setStatus("error");
            setMessage(errorCopy.cancelled);
          }
        },
      },
    });

    checkout.on("payment.failed", (response) => {
      declined.current = response.error.description ?? "";
    });
    checkout.open();
    setStatus("paying");
  }

  if (status === "done") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-4xl border border-leaf/25 bg-leaf-100/60 p-10 text-center">
        <CheckCircle2 className="size-12 text-leaf" aria-hidden />
        <h3 className="mt-5 text-2xl">{donate.success.title}</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          {fill(donate.success.body, { amount: receipt.amount })}
        </p>
        <p className="mt-3 max-w-sm break-words text-xs leading-relaxed text-muted">
          {fill(donate.success.reference, { id: receipt.id })}
        </p>
        <Button variant="ghost" className="mt-7" onClick={() => setStatus("idle")}>
          {donate.success.again}
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

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-ink">{copy.amountLabel}</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {copy.presets.map((value) => (
            <AmountOption
              key={value}
              checked={choice === value}
              onChange={() => setChoice(value)}
              label={rupees.format(value)}
            />
          ))}
          <AmountOption
            checked={choice === "custom"}
            onChange={() => setChoice("custom")}
            label={copy.customLabel}
            className="col-span-2 sm:col-span-3"
          />
        </div>

        {choice === "custom" && (
          <div className="relative mt-3">
            <span
              className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-muted"
              aria-hidden
            >
              ₹
            </span>
            <input
              id="amount"
              name="amount"
              inputMode="numeric"
              autoFocus
              aria-label={copy.customLabel}
              placeholder={copy.customPlaceholder}
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
              className={`${field} pl-9`}
            />
          </div>
        )}

        {errors.amount && (
          <p className="mt-2 text-xs text-alert" role="alert">
            {errors.amount}
          </p>
        )}
      </fieldset>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label={copy.name.label} name="name" error={errors.name} required>
            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder={copy.name.placeholder}
              className={field}
            />
          </Field>
        </div>

        <Field label={copy.email.label} name="email" error={errors.email} required>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={copy.email.placeholder}
            className={field}
          />
        </Field>

        <Field label={copy.phone.label} name="phone" hint={copy.phone.hint} error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={copy.phone.placeholder}
            className={field}
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

      <Button type="submit" disabled={busy} className="mt-7 w-full sm:w-auto">
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {status === "verifying" ? copy.verifying : copy.opening}
          </>
        ) : (
          <>
            {fill(copy.submit, { amount: amountValid ? rupees.format(amount) : "" }).trim()}
            <HeartHandshake className="size-4" aria-hidden />
          </>
        )}
      </Button>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
        <LockKeyhole className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        {copy.secure}
      </p>
    </form>
  );
}

/** A radio styled as a pill, so the preset amounts read as one choice of several. */
function AmountOption({
  checked,
  onChange,
  label,
  className = "",
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  className?: string;
}) {
  return (
    <label
      className={`flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-sky-700 ${
        checked
          ? "border-sky-700 bg-sky-700 text-white"
          : "border-summit bg-white text-ink hover:border-sky hover:bg-sky-50"
      } ${className}`}
    >
      <input
        type="radio"
        name="amount-choice"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
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
