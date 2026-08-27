import Image from "next/image"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo-intensity.png"
      alt=""
      width={1398}
      height={134}
      priority
      className={`h-7 w-auto sm:h-8 ${className}`}
    />
  )
}
