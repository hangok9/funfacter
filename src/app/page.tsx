import { FactGrid } from "@/components/FactGrid"
import { Filters } from "@/components/Filters"
import { CreateFactForm } from "@/components/CreateFactForm"
import { MinimalistToggle } from "@/components/MinimalistToggle"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const sp = await searchParams

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-bold">Fun Facts</h1>
        <MinimalistToggle />
      </div>
      <p className="text-center text-muted-foreground mb-8">
        Curiosidades fascinantes para alimentar tu mente
      </p>
      <CreateFactForm />
      <Filters />
      <FactGrid
        filters={{
          topico: sp.topico,
          fuentes: sp.fuentes,
          longitud: sp.longitud,
          orden: sp.orden,
        }}
      />
    </main>
  )
}
