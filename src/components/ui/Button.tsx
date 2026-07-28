import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "ghost-light";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold " +
  "transition-all duration-300 ease-out active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-sky-700 text-white hover:bg-deep hover:shadow-lift",
  secondary: "bg-leaf text-white hover:bg-leaf-600 hover:shadow-lift",
  ghost: "border border-sky-700/25 text-sky-700 hover:border-sky-700/60 hover:bg-sky-50",
  /** Same shape as `ghost`, for use over a photo or the deep bands instead of shell/mist. */
  "ghost-light": "border border-white/40 text-white hover:border-white/70 hover:bg-white/10",
};

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
