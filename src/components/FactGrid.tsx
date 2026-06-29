import { supabase } from "@/lib/supabase"
import { FactCard } from "./FactCard"
import { EmptyState } from "./EmptyState"
import type { Fact } from "@/lib/types"

interface Filters {
  topico?: string
  fuentes?: string
  longitud?: string
  orden?: string
}

async function getFacts(filters: Filters): Promise<Fact[]> {
  let topicoId: number | null = null
  if (filters.topico) {
    const { data: t } = await supabase
      .from("topicos")
      .select("id")
      .eq("nombre", filters.topico)
      .maybeSingle()
    topicoId = t?.id ?? null
  }

  let query = supabase.from("facts").select(
    "*, fact_topicos!inner(topico_id, topicos(nombre))"
  )

  if (topicoId) {
    query = query.eq("fact_topicos.topico_id", topicoId)
  }

  if (filters.fuentes === "true") {
    query = query.eq("tiene_fuentes", true)
  }

  if (filters.longitud === "corto") {
    query = query.lt("palabras", 150)
  } else if (filters.longitud === "medio") {
    query = query.gte("palabras", 150).lte("palabras", 500)
  } else if (filters.longitud === "extenso") {
    query = query.gt("palabras", 500)
  }

  const orden = filters.orden === "updated_at" ? "updated_at" : "created_at"
  query = query.order(orden, { ascending: false })

  const { data } = await query

  return (data as unknown as Fact[]) ?? []
}

export async function FactGrid({ filters }: { filters: Filters }) {
  const facts = await getFacts(filters)

  if (facts.length === 0) return <EmptyState />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {facts.map((fact) => (
        <FactCard key={fact.id} fact={fact} />
      ))}
    </div>
  )
}
