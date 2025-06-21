/** @jest-environment jsdom */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CompetitorList } from "./competitor-list";

describe("CompetitorList", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("shows a loading skeleton initially", () => {
    // hang fetch so loading stays true
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<CompetitorList />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders an error message on fetch failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
    render(<CompetitorList />);
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to load competitors"
      )
    );
  });

  it("renders an empty state when no competitors", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
    render(<CompetitorList />);
    await waitFor(() =>
      expect(screen.getByTestId("empty")).toHaveTextContent(
        "Nenhum concorrente encontrado"
      )
    );
  });

  it("renders a row for each competitor when data is returned", async () => {
    const mockData = [
      { id: "1", name: "Alpha", website: "https://alpha.com" },
      { id: "2", name: "Beta", website: null },
    ];
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockData }),
    });
    render(<CompetitorList />);
    for (const c of mockData) {
      await waitFor(() => expect(screen.getByText(c.name)).toBeInTheDocument());
      if (c.website) {
        expect(screen.getByText(c.website)).toBeInTheDocument();
      }
    }
  });
});
