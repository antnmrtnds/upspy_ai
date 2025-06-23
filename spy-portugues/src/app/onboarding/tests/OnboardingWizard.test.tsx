/** @jest-environment jsdom */
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }))

import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { OnboardingWizard, StepDefinition } from "../onboardingWizard"

function setup() {
  const Step1 = () => <div>First</div>
  const Step2 = () => <div>Second</div>
  const steps: StepDefinition[] = [
    { title: "Step 1", element: <Step1 /> },
    { title: "Step 2", element: <Step2 /> },
  ]
  render(<OnboardingWizard steps={steps} />)
}

describe("OnboardingWizard", () => {
  it("renders first step", () => {
    setup()
    expect(screen.getByText("First")).toBeInTheDocument()
  })

  it("moves to next step", () => {
    setup()
    fireEvent.click(screen.getByText("Próximo"))
    expect(screen.getByText("Second")).toBeInTheDocument()
  })
})
