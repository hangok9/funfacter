"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Fact, FactTopico } from "@/lib/types"

export function FactCard({ fact }: { fact: Fact }) {
  const [expanded, setExpanded] = useState(false)

  const topicos = (fact.fact_topicos?.map((ft: FactTopico) => ft.topicos?.nombre).filter((n): n is string => !!n) ?? [])

  return (
    <Card
      className="card-shadow cursor-pointer transition-all hover:shadow-lg"
      onClick={() => setExpanded(!expanded)}
    >
      <CardHeader>
        <CardTitle className="text-lg">{fact.titulo}</CardTitle>
        <div className="flex flex-wrap gap-1 mt-2">
          {topicos.map((topico: string) => (
            <Badge key={topico} variant="accent">
              {topico.charAt(0).toUpperCase() + topico.slice(1)}
            </Badge>
          ))}
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {fact.descripcion_breve}
          </p>
          <Link href={`/fact/${fact.id}`} onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="sm">
              Leer más
            </Button>
          </Link>
        </CardContent>
      )}
    </Card>
  )
}
