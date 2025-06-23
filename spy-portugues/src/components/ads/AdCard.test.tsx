import { render, screen, fireEvent } from '@testing-library/react'
import { AdCard } from './AdCard'
import { mockAds } from './mockData'

describe('AdCard', () => {
  const mockOnClick = jest.fn()
  const testAd = mockAds[0]

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  it('renders ad information correctly', () => {
    render(<AdCard ad={testAd} onClick={mockOnClick} />)
    
    expect(screen.getByText(testAd.headline)).toBeInTheDocument()
    expect(screen.getByText(testAd.competitor_name)).toBeInTheDocument()
    expect(screen.getByText(testAd.ad_text!)).toBeInTheDocument()
  })

  it('displays platform badge with correct styling', () => {
    render(<AdCard ad={testAd} onClick={mockOnClick} />)
    
    const platformBadge = screen.getByText('Facebook')
    expect(platformBadge).toBeInTheDocument()
  })

  it('shows engagement metrics when available', () => {
    render(<AdCard ad={testAd} onClick={mockOnClick} />)
    
    const engagement = testAd.engagement!
    const totalEngagement = engagement.likes! + engagement.comments! + engagement.shares! + engagement.reactions!
    
    expect(screen.getByText(`${totalEngagement.toLocaleString()} interactions`)).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', () => {
    render(<AdCard ad={testAd} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button', { name: /view details/i }).closest('.group')
    fireEvent.click(card!)
    
    expect(mockOnClick).toHaveBeenCalledWith(testAd)
  })

  it('displays property type badge when available', () => {
    render(<AdCard ad={testAd} onClick={mockOnClick} />)
    
    expect(screen.getByText(testAd.property_type!)).toBeInTheDocument()
  })

  it('formats date correctly', () => {
    render(<AdCard ad={testAd} onClick={mockOnClick} />)
    
    const expectedDate = new Date(testAd.first_seen).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    
    expect(screen.getByText(expectedDate)).toBeInTheDocument()
  })
}) 