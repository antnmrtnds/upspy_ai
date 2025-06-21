"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

const regionOptions = ['lisbon','porto','coimbra','braga','faro','aveiro','setubal']
const propertyTypeOptions = ['apartment','house','land','office','shop']

export interface CompetitorFormValues {
  name: string
  website?: string
  facebook_url?: string
  instagram_url?: string
  tiktok_url?: string
  regions: string[]
  property_types: string[]
}

export function CompetitorForm({
  initialData,
  onSubmit,
}: {
  initialData?: Partial<CompetitorFormValues>
  onSubmit: (data: CompetitorFormValues) => Promise<void> | void
}) {
  const [form, setForm] = React.useState<CompetitorFormValues>({
    name: initialData?.name || '',
    website: initialData?.website || '',
    facebook_url: initialData?.facebook_url || '',
    instagram_url: initialData?.instagram_url || '',
    tiktok_url: initialData?.tiktok_url || '',
    regions: initialData?.regions || [],
    property_types: initialData?.property_types || [],
  })
  const [errors, setErrors] = React.useState<Record<string,string>>({})
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)

  function toggle(list: string[], value: string) {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
  }

  function validate(values: CompetitorFormValues) {
    const errs: Record<string,string> = {}
    if (!values.name.trim()) errs.name = 'Obrigatório'
    const urlPattern = /^https?:\/\//i
    for (const field of ['website','facebook_url','instagram_url','tiktok_url'] as const) {
      const val = values[field]
      if (val && !urlPattern.test(val)) errs[field] = 'URL inválida'
    }
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    setMessage(null)
    try {
      await onSubmit(form)
      setMessage('Salvo com sucesso')
    } catch {
      setMessage('Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Nome</label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
      </div>
      <div>
        <label>Website</label>
        <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        {errors.website && <p className="text-destructive text-sm">{errors.website}</p>}
      </div>
      <div>
        <label>Facebook</label>
        <Input value={form.facebook_url} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} />
        {errors.facebook_url && <p className="text-destructive text-sm">{errors.facebook_url}</p>}
      </div>
      <div>
        <label>Instagram</label>
        <Input value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} />
        {errors.instagram_url && <p className="text-destructive text-sm">{errors.instagram_url}</p>}
      </div>
      <div>
        <label>TikTok</label>
        <Input value={form.tiktok_url} onChange={(e) => setForm({ ...form, tiktok_url: e.target.value })} />
        {errors.tiktok_url && <p className="text-destructive text-sm">{errors.tiktok_url}</p>}
      </div>
      <fieldset>
        <legend>Regiões</legend>
        {regionOptions.map((r) => (
          <label key={r} className="flex items-center gap-2">
            <Checkbox checked={form.regions.includes(r)} onCheckedChange={() => setForm({ ...form, regions: toggle(form.regions, r) })} />
            {r}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Tipos de Propriedade</legend>
        {propertyTypeOptions.map((p) => (
          <label key={p} className="flex items-center gap-2">
            <Checkbox checked={form.property_types.includes(p)} onCheckedChange={() => setForm({ ...form, property_types: toggle(form.property_types, p) })} />
            {p}
          </label>
        ))}
      </fieldset>
      {message && <p role="status">{message}</p>}
      <Button type="submit" disabled={loading} data-testid="submit">
        {loading ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  )
}