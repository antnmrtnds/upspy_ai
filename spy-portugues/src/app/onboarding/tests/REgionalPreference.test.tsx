/** @jest-environment jsdom */
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { RegionalPreferences } from "@/components/onboarding/RegionalPreferences"

describe("RegionalPreferences", () => {
  it("updates region selection", () => {
    const update = jest.fn()
    render(
      <RegionalPreferences
        data={{}}
        updateData={update}
        nextStep={() => {}}
        prevStep={() => {}}
      />
    )
    const cb = screen.getByLabelText(/lisbon/i) as HTMLInputElement
    fireEvent.click(cb)
    expect(update).toHaveBeenLastCalledWith(
      expect.objectContaining({ regions: ["lisbon"] })
    )
  })
})