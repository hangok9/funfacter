"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TopicCombobox } from "./TopicCombobox"
import { Plus, X } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface FuenteEntry {
  Texto_Mostrado: string
  URL_Link: string
}

export function CreateFactForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [explicacion, setExplicacion] = useState("")
  const [topicos, setTopicos] = useState<string[]>([])
  const [fuentes, setFuentes] = useState<FuenteEntry[]>([])

  function addFuente() {
    setFuentes([...fuentes, { Texto_Mostrado: "", URL_Link: "" }])
  }

  function updateFuente(i: number, field: keyof FuenteEntry, val: string) {
    const next = [...fuentes]
    next[i] = { ...next[i], [field]: val }
    setFuentes(next)
  }

  function removeFuente(i: number) {
    setFuentes(fuentes.filter((_, idx) => idx !== i))
  }

  function addTopico(t: string) {
    if (t && !topicos.includes(t)) setTopicos([...topicos, t])
  }

  function removeTopico(t: string) {
    setTopicos(topicos.filter((x) => x !== t))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!titulo || !descripcion || !explicacion) return
    setSubmitting(true)

    const fuentesValidas = fuentes.filter((f) => f.Texto_Mostrado)
    const payload = {
      titulo,
      descripcion_breve: descripcion,
      explicacion_extensa: explicacion,
      fuentes: fuentesValidas.length > 0 ? fuentesValidas : [],
    }

    const { data: fact, error } = await supabase
      .from("facts")
      .insert(payload)
      .select("id")
      .single()

    if (error || !fact) {
      console.error(error)
      setSubmitting(false)
      return
    }

    // Ensure all topics exist and link them
    for (const t of topicos) {
      const { data: topico } = await supabase
        .from("topicos")
        .select("id")
        .eq("nombre", t)
        .maybeSingle()

      let topicoId: number
      if (topico) {
        topicoId = topico.id
      } else {
        const { data: newTop } = await supabase
          .from("topicos")
          .insert({ nombre: t })
          .select("id")
          .single()
        topicoId = newTop!.id
      }

      await supabase
        .from("fact_topicos")
        .insert({ fact_id: fact.id, topico_id: topicoId })
    }

    setSubmitting(false)
    setOpen(false)
    resetForm()
    router.refresh()
  }

  function resetForm() {
    setTitulo("")
    setDescripcion("")
    setExplicacion("")
    setTopicos([])
    setFuentes([])
  }

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  if (!open) {
    return (
      <div className="mb-8 text-center">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Añadir curiosidad
        </Button>
      </div>
    )
  }

  return (
    <div className="mb-8 p-6 border border-border rounded-lg bg-card">
      <h2 className="text-xl font-semibold mb-4">Nueva curiosidad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción breve</Label>
          <Textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="explicacion">Explicación extensa</Label>
          <Textarea
            id="explicacion"
            className="min-h-[200px]"
            value={explicacion}
            onChange={(e) => setExplicacion(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Tópicos</Label>
          <TopicCombobox
            value=""
            onChange={addTopico}
            creatable={true}
            key={topicos.join(",")}
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {topicos.map((t) => (
              <Badge key={t} variant="accent" className="gap-1">
                {capitalize(t)}
                <button
                  type="button"
                  onClick={() => removeTopico(t)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Fuentes</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addFuente}
            >
              <Plus className="h-3 w-3 mr-1" />
              Añadir fuente
            </Button>
          </div>
          {fuentes.map((f, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 space-y-1">
                <Input
                  placeholder="Texto mostrado"
                  value={f.Texto_Mostrado}
                  onChange={(e) => updateFuente(i, "Texto_Mostrado", e.target.value)}
                />
                <Input
                  placeholder="URL (opcional)"
                  value={f.URL_Link}
                  onChange={(e) => updateFuente(i, "URL_Link", e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-1"
                onClick={() => removeFuente(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false)
              resetForm()
            }}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
