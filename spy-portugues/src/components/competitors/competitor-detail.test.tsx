/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react'
import { CompetitorDetail } from './competitor-detail'
import type { Competitor } from './types'

const competitor: Competitor = {
  id: '1',
  name: 'Alpha',
  website: 'https://a.com',
  facebook_url: 'fb',
  instagram_url: 'ig',
  tiktok_url: 'tt',
  regions: ['Lisboa'],
  property_types: ['Apartamento']
}

describe('CompetitorDetail', () => {
  test('renders competitor details', () => {
    render(<CompetitorDetail competitor={competitor} />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText(/Website:/i)).toBeInTheDocument()
    expect(screen.getByText('https://a.com')).toBeInTheDocument()
    expect(screen.getByText(/Facebook:/i)).toBeInTheDocument()
    expect(screen.getByText('fb')).toBeInTheDocument()
  })
})