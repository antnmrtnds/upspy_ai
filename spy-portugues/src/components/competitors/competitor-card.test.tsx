/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react"
import { CompetitorCard, Competitor } from "./competitor-card"

const competitor: Competitor = {
  id: "1",
  name: "Example",
  description: "Desc",
  website: "http://example.com",
}

test("renders competitor info", () => {
  render(<CompetitorCard competitor={competitor} />)
  expect(screen.getByText("Example")).toBeInTheDocument()
  expect(screen.getByRole("link", { name: "Site" })).toHaveAttribute(
    "href",
    competitor.website
  )
})