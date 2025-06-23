"use client"

import React from "react"
import { AdGallery } from "./AdGallery"
import { AdFilters } from "./AdFilters"
import { Ad, GalleryFilters } from "./types"
import { useAdFilters } from "./useAdFilters"
import { cn } from "@/lib/utils"

interface FilteredAdGalleryProps {
  ads: Ad[]
  loading?: boolean
  onAdClick?: (ad: Ad) => void
  className?: string
  showFilters?: boolean
  initialFilters?: Partial<GalleryFilters>
  competitorOptions?: string[]
  propertyTypeOptions?: string[]
  regionOptions?: string[]
  onFiltersChange?: (filters: GalleryFilters) => void
}

export function FilteredAdGallery({
  ads,
  loading = false,
  onAdClick,
  className,
  showFilters = true,
  initialFilters = {},
  competitorOptions,
  propertyTypeOptions,
  regionOptions,
  onFiltersChange
}: FilteredAdGalleryProps) {
  
  const {
    filters,
    filteredAds,
    setFilters,
    hasActiveFilters,
    activeFilterCount,
    resultCount
  } = useAdFilters({
    ads,
    initialFilters
  })

  // Notify parent of filter changes
  React.useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters)
    }
  }, [filters, onFiltersChange])

  const handleFiltersChange = (newFilters: GalleryFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filter Controls */}
      {showFilters && (
        <AdFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          competitorOptions={competitorOptions}
          propertyTypeOptions={propertyTypeOptions}
          regionOptions={regionOptions}
        />
      )}

      {/* Results Summary */}
      {showFilters && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              {loading ? (
                "Loading ads..."
              ) : (
                <>
                  Showing <span className="font-medium">{resultCount.toLocaleString()}</span> of{" "}
                  <span className="font-medium">{ads.length.toLocaleString()}</span> ads
                </>
              )}
            </span>
            {hasActiveFilters && (
              <span className="text-xs text-muted-foreground">
                ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Gallery */}
      <AdGallery
        ads={filteredAds}
        loading={loading}
        onAdClick={onAdClick}
      />
    </div>
  )
} 