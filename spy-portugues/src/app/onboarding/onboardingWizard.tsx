"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export interface StepDefinition {
  title: string
  element: React.ReactElement
}

export interface OnboardingWizardProps {
  steps: StepDefinition[]
}

export function OnboardingWizard({ steps }: OnboardingWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<Record<string, any>>({})

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => setStep((s) => Math.max(0, s - 1))

  const updateData = (update: Record<string, any>) => {
    setData((d) => ({ ...d, ...update }))
  }

  async function completeOnboarding() {
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    router.push("/dashboard")
  }

  const StepComponent = steps[step].element
  const progress = (step / (steps.length - 1)) * 100

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-2">{steps[step].title}</h2>
        <Progress value={progress} />
      </div>
      <div>{StepComponent && React.cloneElement(StepComponent as any, { data, updateData, nextStep, prevStep })}</div>
      <div className="flex justify-between pt-4">
        <Button onClick={prevStep} disabled={step === 0} variant="outline">
          Voltar
        </Button>
        <Button onClick={nextStep}>{step === steps.length - 1 ? "Finalizar" : "Próximo"}</Button>
      </div>
    </div>
  )
}