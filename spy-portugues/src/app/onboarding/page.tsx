"use client"

import { OnboardingWizard, StepDefinition } from "./onboardingWizard"
import { RegionalPreferences } from "./RegionalPreference"

const steps: StepDefinition[] = [
  { title: "Competidores", element: <div>Selecionar concorrentes</div> },
  { title: "Preferências", element: <RegionalPreferences data={{}} updateData={() => {}} nextStep={() => {}} prevStep={() => {}} /> },
  { title: "Notificações", element: <div>Configurar notificações</div> },
]

export default function OnboardingPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <OnboardingWizard steps={steps} />
    </div>
  )
}