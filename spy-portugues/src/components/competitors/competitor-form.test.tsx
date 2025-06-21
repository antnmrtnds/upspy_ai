/** @jest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CompetitorForm, CompetitorFormValues } from './competitor-form'

describe('CompetitorForm', () => {
  test('renders initial data', () => {
    const initial: Partial<CompetitorFormValues> = {
      name: 'Init',
      website: 'https://example.com',
      regions: ['lisbon'],
    }
    render(<CompetitorForm initialData={initial} onSubmit={jest.fn()} />)
    expect(screen.getByDisplayValue('Init')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument()
    const region = screen.getByLabelText(/lisbon/i) as HTMLInputElement
    expect(region.checked).toBe(true)
  })

  test('shows validation errors', async () => {
    const submit = jest.fn()
    render(<CompetitorForm onSubmit={submit} />)
    fireEvent.click(screen.getByTestId('submit'))
    await waitFor(() =>
      expect(screen.getByText(/Obrigat/)).toBeInTheDocument()
    )
    expect(submit).not.toHaveBeenCalled()
  })

  test('submits valid data', async () => {
    const submit = jest.fn()
    render(<CompetitorForm onSubmit={submit} />)
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Test' } })
    fireEvent.click(screen.getByLabelText(/lisbon/i))
    fireEvent.click(screen.getByTestId('submit'))
    await waitFor(() => expect(submit).toHaveBeenCalled())
    expect(submit.mock.calls[0][0].name).toBe('Test')
    expect(submit.mock.calls[0][0].regions).toContain('lisbon')
  })
})