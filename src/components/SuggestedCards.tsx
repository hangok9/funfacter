import { supabase } from "@/lib/supabase"
import { FactCard } from "./FactCard"
import type { Fact } from "@/lib/types"

async function getSuggested(
  factId: number,
  topicoIds: number[]
): Promise<Fact[]> {
  if (topicoIds.length === 0) return []

  const { data: factsWithTopics } = await supabase
    .from("facts")
    .select("*, fact_topicos!inner(topico_id, topicos(nombre))")
    .neq("id", factId)
    .in("fact_topicos.topico_id", topicoIds)
    .limit(3)

  return (factsWithTopics as unknown as Fact[]) ?? []
}

export async function SuggestedCards({
  factId,
  topicoIds,
}: {
  factId: number
  topicoIds: number[]
}) {
  const suggested = await getSuggested(factId, topicoIds)

  if (suggested.length === 0) return null

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-xl font-semibold mb-4">
        También te puede interesar
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggested.map((fact) => (
          <FactCard key={fact.id} fact={fact} />
        ))}
      </div>
    </section>
  )
}
