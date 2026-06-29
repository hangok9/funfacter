import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { BackButton } from "@/components/BackButton"
import { SuggestedCards } from "@/components/SuggestedCards"
import { Badge } from "@/components/ui/badge"
import type { Fact, FactTopico } from "@/lib/types"

export const dynamic = "force-dynamic"

async function getFact(id: string): Promise<Fact | null> {
  const { data } = await supabase
    .from("facts")
    .select("*, fact_topicos(topico_id, topicos(nombre))")
    .eq("id", id)
    .single()

  return data as unknown as Fact | null
}

export default async function FactDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string>>
}) {
  const { id } = await params
  const sp = await searchParams
  const fact = await getFact(id)

  if (!fact) notFound()

  const ft = (fact.fact_topicos ?? []) as FactTopico[]
  const topicos = ft
    .map((f) => f.topicos?.nombre)
    .filter((n): n is string => !!n)
  const topicoIds = ft
    .map((f) => f.topico_id)
    .filter((n): n is number => !!n)
  const fuentes: Array<{ Texto_Mostrado: string; URL_Link?: string }> =
    Array.isArray(fact.fuentes) ? fact.fuentes : []

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
      <BackButton searchParams={sp} />

      <article className="mt-6">
        <h1 className="text-3xl font-bold mb-3">{fact.titulo}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {topicos.map((t) => (
            <Badge key={t} variant="accent">
              {capitalize(t)}
            </Badge>
          ))}
        </div>

        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {fact.descripcion_breve}
        </p>

        <div className="prose prose-stone max-w-none mb-8 leading-relaxed whitespace-pre-wrap">
          {fact.explicacion_extensa}
        </div>

        {fuentes.length > 0 && (
          <section className="border-t border-border pt-4 mt-8">
            <h2 className="text-lg font-semibold mb-3">Fuentes</h2>
            <ul className="space-y-2">
              {fuentes.map((f, i) => (
                <li key={i}>
                  {f.URL_Link ? (
                    <a
                      href={f.URL_Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {f.Texto_Mostrado}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">
                      {f.Texto_Mostrado}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <SuggestedCards factId={fact.id} topicoIds={topicoIds} />
    </div>
  )
}
