"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
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

  useEffect(() => {
    supabase
      .from("topicos")
      .select("id, nombre")
      .order("nombre")
      .then(({ data }) => {
        if (data) setTopicos(data as Topico[])
      })
  }, [])

  const selected = topicos.find((t) => t.nombre === value)
  const normalizedSearch = search
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")

  const exists = topicos.some((t) => t.nombre === normalizedSearch)

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
                  onClick={() => {
                    onChange(normalizedSearch)
                    setOpen(false)
                    setSearch("")
                  }}
                >
                  <Plus className="h-4 w-4" />
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
