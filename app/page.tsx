export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-6 px-6">
      <p className="micro-rotulo">seleção do diogo</p>
      <h1 className="display-expandido text-5xl text-text sm:text-7xl">
        O que eu uso
        <br />
        e indico de
        <br />
        <span className="text-oxido">verdade.</span>
      </h1>
      <div className="fio-rotulo" />
      <p className="text-text-muted">
        Corpo em IBM Plex Sans. Este texto existe só para conferir a escala
        tipográfica e some na Task 7.
      </p>
      <div className="card-rotulo flex items-center justify-between p-4">
        <span className="micro-rotulo">marca</span>
        <span className="font-mono text-sm text-text">GROWTH</span>
      </div>
    </main>
  )
}
