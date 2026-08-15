import { site } from "@/content/site"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`display-expandido text-lg leading-none ${className}`}>
      {site.nome.split(" ")[0]}
      <span className="text-oxido">{site.nome.split(" ")[1]}</span>
    </span>
  )
}
