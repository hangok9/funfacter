"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { supabase } from "@/lib/supabase"

interface Topico {
  id: number
  nombre: string
}

export function TopicCombobox({
  value,
  onChange,
  creatable = true,
}: {
  value: string
  onChange: (val: string) => void
  creatable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [topicos, setTopicos] = useState<Topico[]>([])
  const [search, setSearch] = useState("")
  const [creating, setCreating] = useState(false)

  const loadTopicos = useCallback(async () => {
    const { data } = await supabase
      .from("topicos")
      .select("id, nombre")
      .order("nombre")
    if (data) setTopicos(data as Topico[])
  }, [])

  useEffect(() => { loadTopicos() }, [loadTopicos])

  const selected = topicos.find((t) => t.nombre === value)
  const normalizedSearch = search
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")

  const exists = topicos.some((t) => t.nombre === normalizedSearch)

  async function handleCreate() {
    if (!normalizedSearch || exists || creating) return
    setCreating(true)
    const { error } = await supabase
      .from("topicos")
      .insert({ nombre: normalizedSearch })
    setCreating(false)
    if (error) {
      console.error(error)
      return
    }
    await loadTopicos()
    onChange(normalizedSearch)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected
            ? selected.nombre.charAt(0).toUpperCase() + selected.nombre.slice(1)
            : value
              ? value.charAt(0).toUpperCase() + value.slice(1)
              : "Seleccionar tópico..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Buscar tópico..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {creatable && search && !exists ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  disabled={creating}
                  onClick={handleCreate}
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Añadir &ldquo;{normalizedSearch}&rdquo;
                </Button>
              ) : (
                "No se encontraron tópicos"
              )}
            </CommandEmpty>
            <CommandGroup>
              {topicos.map((t) => (
                <CommandItem
                  key={t.id}
                  value={t.nombre}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearch("")
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === t.nombre ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {t.nombre.charAt(0).toUpperCase() + t.nombre.slice(1)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
