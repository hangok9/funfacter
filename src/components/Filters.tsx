"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Toggle } from "@/components/ui/toggle"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TopicCombobox } from "./TopicCombobox"
import { BookOpen } from "lucide-react"

export function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const topico = searchParams.get("topico") ?? ""
  const fuentes = searchParams.get("fuentes") ?? ""
  const longitud = searchParams.get("longitud") ?? ""
  const orden = searchParams.get("orden") ?? "created_at"

  const setParam = useCallback(
    (key: string, val: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (val) {
        params.set(key, val)
      } else {
        params.delete(key)
      }
      router.push(`/?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-wrap gap-3 items-end mb-8">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground font-medium">
          Tópico
        </label>
        <TopicCombobox
          value={topico}
          onChange={(v) => setParam("topico", v)}
          creatable={true}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground font-medium">
          Fuentes
        </label>
        <Toggle
          pressed={fuentes === "true"}
          onPressedChange={(p: boolean) => setParam("fuentes", p ? "true" : "")}
          className="gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Con fuentes
        </Toggle>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground font-medium">
          Longitud
        </label>
        <Select
          value={longitud}
          onValueChange={(v) => setParam("longitud", v)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Cualquier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Cualquier</SelectItem>
            <SelectItem value="corto">Corto (&lt;150)</SelectItem>
            <SelectItem value="medio">Medio (150-500)</SelectItem>
            <SelectItem value="extenso">Extenso (&gt;500)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground font-medium">
          Ordenar por
        </label>
        <Select value={orden} onValueChange={(v) => setParam("orden", v)}>
          <SelectTrigger className="w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Fecha creación</SelectItem>
            <SelectItem value="updated_at">Última modificación</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
