import { MicroRotulo } from "@/components/ui/micro-rotulo"

export type LinhaDeFicha = { rotulo: string; valor: string }

/** O verso do pote: rótulo em mono à esquerda, fio de 1px preenchendo o
 *  vão, valor à direita. O fio é um <span> que cresce (flex-1) com uma
 *  borda inferior — assim ele ocupa exatamente o espaço sobrando,
 *  independente do tamanho do rótulo e do valor. */
export function FichaTecnica({
  linhas,
  className = "",
}: {
  linhas: readonly LinhaDeFicha[]
  className?: string
}) {
  return (
    <dl className={`flex flex-col gap-2.5 ${className}`}>
      {linhas.map((linha) => (
        <div key={linha.rotulo} className="flex items-baseline gap-3">
          <dt>
            <MicroRotulo>{linha.rotulo}</MicroRotulo>
          </dt>
          <span aria-hidden="true" className="fio-rotulo min-w-4 flex-1" />
          <dd className="font-mono text-xs uppercase tracking-[0.08em] text-text">
            {linha.valor}
          </dd>
        </div>
      ))}
    </dl>
  )
}
