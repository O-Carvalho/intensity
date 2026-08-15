import Link from "next/link"
import type { ReactNode } from "react"

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: "primary" | "ghost"
  external?: boolean
  className?: string
}

/** primary: bloco óxido sólido com texto CARVÃO. Texto off-white sobre
 *  óxido daria 3.37:1 e falharia AA — carvão sobre óxido dá 4.96:1.
 *  ghost: contorno aço, para o CTA secundário. */
export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.14em] transition-colors"
  const styles =
    variant === "primary"
      ? "bg-oxido text-bg hover:bg-oxido-bright"
      : "border border-line text-text-muted hover:border-aco hover:text-text"

  return (
    <Link
      href={href}
      className={`${base} ${styles} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  )
}
