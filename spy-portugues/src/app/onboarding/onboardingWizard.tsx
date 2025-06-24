"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
    <div className="space-y-6">
      {/* Progress indicator */}
      <div>
        <div className="flex justify-between">
          {steps.map((s, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${index <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {index < step ? '✓' : index + 1}
              </div>
              <span className="text-sm mt-2 text-center">{s.title}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full" />
          <div
            className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[step].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {StepComponent &&
            React.cloneElement(StepComponent as any, {
              data,
              updateData,
              nextStep,
              prevStep,
            })}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={prevStep} disabled={step === 0} variant="outline">
            Voltar
          </Button>
          <Button onClick={nextStep}>
            {step === steps.length - 1 ? 'Finalizar' : 'Próximo'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}