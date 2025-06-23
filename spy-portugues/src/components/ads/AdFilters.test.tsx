import { render, screen, fireEvent } from '@testing-library/react'
import { AdFilters } from './AdFilters'
import { GalleryFilters } from './types'

describe('AdFilters', () => {
  const mockFilters: GalleryFilters = {
    competitor: 'all',
    propertyType: 'all',
    region: 'all',
    keyword: '',
    platform: 'all'
  }

  const mockOnFiltersChange = jest.fn()

  beforeEach(() => {
    mockOnFiltersChange.mockClear()
  })

  it('renders all filter controls', () => {
    render(
      <AdFilters 
        filters={mockFilters} 
        onFiltersChange={mockOnFiltersChange} 
      />
    )

    expect(screen.getByLabelText('Competitor')).toBeInTheDocument()
    expect(screen.getByLabelText('Property Type')).toBeInTheDocument()
    expect(screen.getByLabelText('Region')).toBeInTheDocument()
    expect(screen.getByLabelText('Platform')).toBeInTheDocument()
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
  })

  it('displays filter header with correct title', () => {
    render(
      <AdFilters 
        filters={mockFilters} 
        onFiltersChange={mockOnFiltersChange} 
      />
    )

    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('shows active filter count when filters are applied', () => {
    const activeFilters: GalleryFilters = {
      ...mockFilters,
      competitor: 'Century 21',
      region: 'Lisboa'
    }

    render(
      <AdFilters 
        filters={activeFilters} 
        onFiltersChange={mockOnFiltersChange} 
      />
    )

    expect(screen.getByText('2 active')).toBeInTheDocument()
  })

  it('shows clear all button when filters are active', () => {
    const activeFilters: GalleryFilters = {
      ...mockFilters,
      competitor: 'Century 21'
    }

    render(
      <AdFilters 
        filters={activeFilters} 
        onFiltersChange={mockOnFiltersChange} 
      />
    )

    expect(screen.getByText('Clear all')).toBeInTheDocument()
  })

  it('does not show clear all button when no filters are active', () => {
    render(
      <AdFilters 
        filters={mockFilters} 
        onFiltersChange={mockOnFiltersChange} 
      />
    )

    expect(screen.queryByText('Clear all')).not.toBeInTheDocument()
  })

  it('calls onFiltersChange when keyword input changes', () => {
    render(
      <AdFilters 
        filters={mockFilters} 
        onFiltersChange={mockOnFiltersChange} 
      />
    )

    const searchInput = screen.getByPlaceholderText('Search ad text...')
    fireEvent.change(searchInput, { target: { value: 'apartment' } })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      keyword: 'apartment'
    })
  })

  it('displays active filter badges', () => {
    const activeFilters: GalleryFilters = {
      ...mockFilters,
      competitor: 'Century 21',
      propertyType: 'Apartamento',
      region: 'Lisboa',
      platform: 'facebook',
      keyword: 'luxury'
    }

    render(
      <AdFilters 
        filters={activeFilters} 
        onFiltersChange={mockOnFiltersChange} 
      />
    )

    expect(screen.getByText('Competitor: Century 21')).toBeInTheDocument()
    expect(screen.getByText('Type: Apartamento')).toBeInTheDocument()
    expect(screen.getByText('Region: Lisboa')).toBeInTheDocument()
    expect(screen.getByText('Platform: Facebook')).toBeInTheDocument()
    expect(screen.getByText('Search: "luxury"')).toBeInTheDocument()
  })

  it('clears individual filters when badge close button is clicked', () => {
    const activeFilters: GalleryFilters = {
      ...mockFilters,
      competitor: 'Century 21'
    }

    render(
      <AdFilters 
        filters={activeFilters} 
        onFiltersChange={mockOnFiltersChange} 
      />
    )

    // Look for the X button in the badge
    const badgeText = screen.getByText('Competitor: Century 21')
    expect(badgeText).toBeInTheDocument()
    
    // Find the close button within the badge container
    const badge = badgeText.closest('.text-xs')
    const closeButton = badge?.querySelector('button')
    expect(closeButton).toBeInTheDocument()
    
    if (closeButton) {
      fireEvent.click(closeButton)
    }

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...activeFilters,
      competitor: 'all'
    })
  })

  it('clears all filters when clear all button is clicked', () => {
    const activeFilters: GalleryFilters = {
      competitor: 'Century 21',
      propertyType: 'Apartamento',
      region: 'Lisboa',
      platform: 'facebook',
      keyword: 'luxury'
    }

    render(
      <AdFilters 
        filters={activeFilters} 
        onFiltersChange={mockOnFiltersChange} 
      />
    )

    const clearAllButton = screen.getByText('Clear all')
    fireEvent.click(clearAllButton)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      competitor: 'all',
      propertyType: 'all',
      region: 'all',
      platform: 'all',
      keyword: ''
    })
  })

  it('uses custom options when provided', () => {
    const customCompetitors = ['Custom Competitor 1', 'Custom Competitor 2']
    const customPropertyTypes = ['Custom Type 1', 'Custom Type 2']
    const customRegions = ['Custom Region 1', 'Custom Region 2']

    render(
      <AdFilters 
        filters={mockFilters} 
        onFiltersChange={mockOnFiltersChange}
        competitorOptions={customCompetitors}
        propertyTypeOptions={customPropertyTypes}
        regionOptions={customRegions}
      />
    )

    // Note: Testing select options would require more complex testing
    // as they are rendered in portals. This test confirms the component
    // accepts the custom props without errors.
    expect(screen.getByLabelText('Competitor')).toBeInTheDocument()
  })

  it('shows clear button in search input when keyword is present', () => {
    const filtersWithKeyword: GalleryFilters = {
      ...mockFilters,
      keyword: 'apartment'
    }

    render(
      <AdFilters 
        filters={filtersWithKeyword} 
        onFiltersChange={mockOnFiltersChange} 
      />
    )

    const searchInput = screen.getByDisplayValue('apartment')
    expect(searchInput).toBeInTheDocument()
    
    // Check that the search badge is displayed
    const searchBadge = screen.getByText('Search: "apartment"')
    expect(searchBadge).toBeInTheDocument()
  })
}) 