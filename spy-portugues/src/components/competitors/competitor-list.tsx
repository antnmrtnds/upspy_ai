"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Competitor } from "./competitor-card"
import { regionOptions, propertyTypeOptions } from "./competitor-form"

export function CompetitorList() {
  const [competitors, setCompetitors] = React.useState<Competitor[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState("name-asc")
  const [region, setRegion] = React.useState("all")
  const [property, setProperty] = React.useState("all")

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/competitors")
        if (!res.ok) throw new Error("Failed")
        const json = await res.json()
        setCompetitors(json.data || [])
      } catch (err) {
        setError("Failed to load competitors")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = React.useMemo(() => {
    let list = competitors.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    )
    if (region !== "all") {
      list = list.filter((c) => c.regions?.includes(region))
    }
    if (property !== "all") {
      list = list.filter((c) => c.property_types?.includes(property))
    }
    list.sort((a, b) =>
      sort === "name-asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    return list
  }, [competitors, query, sort, region, property])

  if (loading) {
    return <Skeleton data-testid="loading" className="h-24 w-full" />
  }

  if (error) {
    return <div role="alert" className="text-destructive">{error}</div>
  }

  if (filtered.length === 0) {
    return (
      <div data-testid="empty" className="text-sm text-muted-foreground">
        Nenhum concorrente encontrado
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Pesquisar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={sort} onValueChange={(v) => setSort(v)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">A-Z</SelectItem>
            <SelectItem value="name-desc">Z-A</SelectItem>
          </SelectContent>
        </Select>
        <Select value={region} onValueChange={(v) => setRegion(v)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Região" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {regionOptions.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={property} onValueChange={(v) => setProperty(v)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {propertyTypeOptions.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Website</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((comp) => (
            <TableRow key={comp.id}>
              <TableCell>{comp.name}</TableCell>
              <TableCell>
                {comp.website ? (
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {comp.website}
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <Button asChild size="sm" variant="outline">
                  <a href={`/competitors/${comp.id}`}>Ver</a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}