"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BackButton({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const router = useRouter()

  const queryString = new URLSearchParams(searchParams).toString()
  const href = queryString ? `/?${queryString}` : "/"

  return (
    <Button
      variant="ghost"
      className="gap-2 -ml-2"
      onClick={() => router.push(href)}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Volver</span>
    </Button>
  )
}
