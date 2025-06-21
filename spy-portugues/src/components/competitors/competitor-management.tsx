"use client"

import * as React from "react"
import { CompetitorForm, CompetitorFormValues } from "./competitor-form"
import { CompetitorList } from "./competitor-list"

export function CompetitorManagement() {
  const [key, setKey] = React.useState(0)

  async function handleCreate(data: CompetitorFormValues) {
    await fetch("/api/competitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setKey((k) => k + 1)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="mb-4 text-xl font-semibold">Novo Concorrente</h2>
        <CompetitorForm onSubmit={handleCreate} />
      </div>
      <div>
        <h2 className="mb-4 text-xl font-semibold">Concorrentes</h2>
        <CompetitorList key={key} />
      </div>
    </div>
  )
}