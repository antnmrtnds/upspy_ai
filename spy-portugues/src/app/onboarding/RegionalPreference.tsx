"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { regionOptions, propertyTypeOptions } from "@/components/competitors/competitor-form"

export interface RegionalPreferencesProps {
  data: Record<string, any>
  updateData: (update: Record<string, any>) => void
  nextStep: () => void
  prevStep: () => void
}

export function RegionalPreferences({ data, updateData, nextStep, prevStep }: RegionalPreferencesProps) {
  const [regions, setRegions] = React.useState<string[]>(data.regions || [])
  const [types, setTypes] = React.useState<string[]>(data.propertyTypes || [])
  const [priceMin, setPriceMin] = React.useState<string>(data.priceMin || "")
  const [priceMax, setPriceMax] = React.useState<string>(data.priceMax || "")
  const [sizeMin, setSizeMin] = React.useState<string>(data.sizeMin || "")
  const [sizeMax, setSizeMax] = React.useState<string>(data.sizeMax || "")

  React.useEffect(() => {
    updateData({ regions, propertyTypes: types, priceMin, priceMax, sizeMin, sizeMax })
  }, [regions, types, priceMin, priceMax, sizeMin, sizeMax, updateData])

  function toggle(list: string[], value: string) {
    return list.includes(value) ? list.filter(v => v !== value) : [...list, value]
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Selecione Regiões</h3>
        <div className="grid grid-cols-2 gap-2">
          {regionOptions.map(r => (
            <label key={r} className="flex items-center gap-2">
              <Checkbox checked={regions.includes(r)} onCheckedChange={() => setRegions(toggle(regions, r))} />
              {r}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Tipos de Propriedade</h3>
        <div className="grid grid-cols-2 gap-2">
          {propertyTypeOptions.map(p => (
            <label key={p} className="flex items-center gap-2">
              <Checkbox checked={types.includes(p)} onCheckedChange={() => setTypes(toggle(types, p))} />
              {p}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Preço Mínimo</label>
          <Input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Preço Máximo</label>
          <Input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Área Mínima (m²)</label>
          <Input type="number" value={sizeMin} onChange={e => setSizeMin(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Área Máxima (m²)</label>
          <Input type="number" value={sizeMax} onChange={e => setSizeMax(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Voltar</Button>
        <Button onClick={nextStep}>Próximo</Button>
      </div>
    </div>
  )
}