import { useState, useEffect, useMemo } from "react"
import { Ad, GalleryFilters } from "./types"

interface UseAdFiltersProps {
  ads: Ad[]
  initialFilters?: Partial<GalleryFilters>
}

interface UseAdFiltersReturn {
  filters: GalleryFilters
  filteredAds: Ad[]
  setFilters: (filters: GalleryFilters) => void
  updateFilter: (key: keyof GalleryFilters, value: string) => void
  clearFilter: (key: keyof GalleryFilters) => void
  clearAllFilters: () => void
  hasActiveFilters: boolean
  activeFilterCount: number
  resultCount: number
}

const defaultFilters: GalleryFilters = {
  competitor: "all",
  propertyType: "all",
  region: "all",
  keyword: "",
  platform: "all"
}

export function useAdFilters({ 
  ads, 
  initialFilters = {} 
}: UseAdFiltersProps): UseAdFiltersReturn {
  
  const [filters, setFilters] = useState<GalleryFilters>({
    ...defaultFilters,
    ...initialFilters
  })

  // Apply filters to ads
  const filteredAds = useMemo(() => {
    let result = [...ads]

    // Filter by competitor
    if (filters.competitor && filters.competitor !== "all") {
      result = result.filter(ad => 
        ad.competitor_name?.toLowerCase().includes(filters.competitor.toLowerCase())
      )
    }

    // Filter by property type
    if (filters.propertyType && filters.propertyType !== "all") {
      result = result.filter(ad => 
        ad.property_type?.toLowerCase() === filters.propertyType.toLowerCase()
      )
    }

    // Filter by region
    if (filters.region && filters.region !== "all") {
      result = result.filter(ad => 
        ad.region?.toLowerCase().includes(filters.region.toLowerCase())
      )
    }

    // Filter by platform
    if (filters.platform && filters.platform !== "all") {
      result = result.filter(ad => 
        ad.platform?.toLowerCase() === filters.platform.toLowerCase()
      )
    }

    // Filter by keyword (searches in ad_text and headline)
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      result = result.filter(ad => {
        const searchableText = [
          ad.ad_text,
          ad.headline
        ].filter(Boolean).join(' ').toLowerCase()
        
        return searchableText.includes(keyword)
      })
    }

    return result
  }, [ads, filters])

  // Helper functions
  const updateFilter = (key: keyof GalleryFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilter = (key: keyof GalleryFilters) => {
    updateFilter(key, "")
  }

  const clearAllFilters = () => {
    setFilters(defaultFilters)
  }

  // Computed values
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "keyword") return value !== ""
    return value !== "" && value !== "all"
  })
  
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "keyword") return value !== ""
    return value !== "" && value !== "all"
  }).length
  const resultCount = filteredAds.length

  return {
    filters,
    filteredAds,
    setFilters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
    resultCount
  }
} 