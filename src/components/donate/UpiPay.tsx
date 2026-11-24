"use client";

import { Check, Copy, Smartphone } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { contact, donate } from "@/content/site";
import { upiLink } from "@/lib/upi";

/**
 * Pay by UPI, straight to the LLP's bank account — no gateway in between.
 *
 * On a phone the reader picks an amount and taps one button, which opens their
 * UPI app with the payee, amount and note already filled in; all that is left
 * is the UPI PIN. Android shows its own chooser for `upi://pay`, so it gets one
 * button. iOS has no chooser and opens whichever app claimed the scheme, so an
 * iPhone gets a button per app instead.
 *
 * On a computer there is no app to open, so the QR code takes over — the phone
 * in their pocket scans it. That code is drawn by the server (`page.tsx`) and
 * passed in as an SVG path, so the QR library never ships to the browser. It
 * carries no amount, because it is drawn once at build time.
 *
 * Which of the two shows is a CSS breakpoint, not device sniffing: the iOS
 * check below only chooses between the two phone layouts.
 */

const { form: copy, upi } = donate;

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");

const noop = () => () => {};
const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  // iPadOS reports itself as a Mac; the touch screen gives it away.
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const appButton =
  "flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold " +
  "transition-all duration-300 ease-out active:scale-[0.98] active:duration-75";

export function UpiPay({ qr }: { qr: { size: number; path: string } }) {
  const [choice, setChoice] = useState<number | "custom">(copy.defaultAmount);
  const [custom, setCustom] = useState("");
  const [copied, setCopied] = useState(false);
  const ios = useSyncExternalStore(noop, isIOS, () => false);

  const raw = choice === "custom" ? Number(custom) : choice;
  const amount =
    Number.isInteger(raw) && raw >= copy.min && raw <= copy.max
      ? raw
      : undefined;
  const link = (scheme?: string) =>
    upiLink({ scheme, id: upi.id, payee: upi.payee, note: upi.note, amount });

  async function copyId() {
    let ok = false;
    try {
      // The modern API only exists on https and localhost, so it is missing
      // when a phone opens a local build over plain http — hence the fallback.
      await navigator.clipboard.writeText(upi.id);
      ok = true;
    } catch {
      ok = legacyCopy(upi.id);
    }
    if (!ok) return; // The ID is printed beside the button and can be selected by hand.
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-4xl border border-summit/60 bg-white p-6 shadow-soft sm:p-9">
      {/* Phones: choose an amount, then open the app. */}
      {upi.appLinks && (
        <div className="md:hidden">
          <fieldset>
            <legend className="mb-3 text-sm font-medium text-ink">
              {copy.amountLabel}
            </legend>
            <div className="grid grid-cols-2 gap-3">
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
                className="col-span-2"
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
                  inputMode="numeric"
                  autoFocus
                  aria-label={copy.customLabel}
                  placeholder={copy.customPlaceholder}
                  value={custom}
                  onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-2xl border border-summit bg-white py-3 pl-9 pr-4 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-sky focus:outline-none"
                />
              </div>
            )}
            {choice === "custom" && custom !== "" && !amount && (
              <p className="mt-2 text-xs text-alert" role="alert">
                {copy.amountError}
              </p>
            )}
          </fieldset>

          <div className="mt-7">
            {ios ? (
              <>
                <p className="mb-3 text-sm font-medium text-ink">
                  {upi.iosIntro}
                </p>
                <div className="space-y-3">
                  {upi.iosApps.map((app) => (
                    <a
                      key={app.name}
                      href={link(app.scheme)}
                      className={`${appButton} bg-sky-700 text-white`}
                    >
                      {app.name}
                      {amount ? ` · ${rupees.format(amount)}` : ""}
                    </a>
                  ))}
                  <a
                    href={link()}
                    className={`${appButton} border border-sky-700/25 text-sky-700`}
                  >
                    {upi.iosOther}
                  </a>
                </div>
              </>
            ) : (
              <a href={link()} className={`${appButton} bg-sky-700 text-white`}>
                <Smartphone className="size-4" aria-hidden />
                {amount
                  ? fill(upi.pay, { amount: rupees.format(amount) })
                  : upi.payNoAmount}
              </a>
            )}
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {upi.appHint}
            </p>
          </div>
        </div>
      )}

      {/* Computers: scan the code with a phone. Phones too, while `appLinks` is off. */}
      <div
        className={
          upi.appLinks
            ? "hidden items-center gap-8 md:flex"
            : "flex flex-col items-center gap-6 text-center md:flex-row md:gap-8 md:text-left"
        }
      >
        <svg
          viewBox={`0 0 ${qr.size + 8} ${qr.size + 8}`}
          className="size-52 shrink-0 rounded-2xl bg-white text-ink"
          shapeRendering="crispEdges"
          role="img"
          aria-label={fill(upi.qrAlt, { id: upi.id })}
        >
          {/* A four-module quiet zone, which scanners need to find the code. */}
          <path d={qr.path} transform="translate(4 4)" fill="currentColor" />
        </svg>
        <div>
          <h3 className="hidden text-xl md:block">{upi.qrTitle}</h3>
          <p className="mt-2 hidden text-sm leading-relaxed text-muted md:block">
            {upi.qrHint}
          </p>
          {!upi.appLinks && (
            <div className="md:hidden">
              <h3 className="text-xl">{upi.qrTitlePhone}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {upi.qrHintPhone}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-summit pt-6 text-sm">
        <span className="text-muted">{upi.idLabel}</span>
        <span className="select-all break-all font-semibold text-ink">
          {upi.id}
        </span>
        <button
          type="button"
          onClick={copyId}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-sky-700/25 px-4 text-xs font-semibold text-sky-700 transition-colors hover:border-sky-700/60 hover:bg-sky-50"
        >
          {copied ? (
            <Check className="size-3.5" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
          <span aria-live="polite">{copied ? upi.copied : upi.copy}</span>
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        {fill(upi.after, { email: contact.email })}
      </p>
    </div>
  );
}

/**
 * The pre-Clipboard-API way to copy: select text in an off-screen textarea and
 * run the copy command. Deprecated, but it still works on http pages and older
 * phone browsers, where `navigator.clipboard` is unavailable.
 */
function legacyCopy(text: string) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  // Off screen, and 16px so iOS doesn't zoom the page when it is focused.
  area.style.cssText = "position:fixed;top:0;left:-9999px;font-size:16px";
  document.body.appendChild(area);
  area.select();
  area.setSelectionRange(0, text.length); // iOS ignores select() on its own.
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
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
        name="upi-amount"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
  );
}
