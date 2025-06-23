"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Filter, Search } from "lucide-react"
import { GalleryFilters } from "./types"
import { cn } from "@/lib/utils"

interface AdFiltersProps {
  filters: GalleryFilters
  onFiltersChange: (filters: GalleryFilters) => void
  competitorOptions?: string[]
  propertyTypeOptions?: string[]
  regionOptions?: string[]
  className?: string
}

// Default options based on Portuguese real estate market
const defaultCompetitorOptions = [
  "Century 21",
  "RE/MAX", 
  "ERA",
  "Keller Williams",
  "Coldwell Banker",
  "Engel & Völkers",
  "Realty One Group",
  "Sotheby's International Realty"
]

const defaultPropertyTypeOptions = [
  "Apartamento",
  "Moradia",
  "Loft",
  "Penthouse",
  "Quinta",
  "Terreno",
  "Escritório",
  "Loja",
  "Armazém"
]

const defaultRegionOptions = [
  "Lisboa",
  "Porto",
  "Cascais",
  "Sintra",
  "Oeiras",
  "Braga",
  "Coimbra",
  "Aveiro",
  "Faro",
  "Alentejo",
  "Madeira",
  "Açores"
]

const platformOptions = [
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" }
]

export function AdFilters({
  filters,
  onFiltersChange,
  competitorOptions = defaultCompetitorOptions,
  propertyTypeOptions = defaultPropertyTypeOptions,
  regionOptions = defaultRegionOptions,
  className
}: AdFiltersProps) {
  
  const handleFilterChange = (key: keyof GalleryFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilter = (key: keyof GalleryFilters) => {
    const value = key === "keyword" ? "" : "all"
    handleFilterChange(key, value)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      competitor: "all",
      propertyType: "all",
      region: "all",
      keyword: "",
      platform: "all"
    })
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "keyword") return value !== ""
    return value !== "" && value !== "all"
  })
  
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "keyword") return value !== ""
    return value !== "" && value !== "all"
  }).length

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Competitor Filter */}
        <div className="space-y-2">
          <Label htmlFor="competitor-select" className="text-xs font-medium text-muted-foreground">
            Competitor
          </Label>
          <Select
            value={filters.competitor}
            onValueChange={(value) => handleFilterChange("competitor", value)}
          >
            <SelectTrigger id="competitor-select" className="h-9">
              <SelectValue placeholder="All Competitors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Competitors</SelectItem>
              {competitorOptions.map((competitor) => (
                <SelectItem key={competitor} value={competitor}>
                  {competitor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="property-select" className="text-xs font-medium text-muted-foreground">
            Property Type
          </Label>
          <Select
            value={filters.propertyType}
            onValueChange={(value) => handleFilterChange("propertyType", value)}
          >
            <SelectTrigger id="property-select" className="h-9">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {propertyTypeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region Filter */}
        <div className="space-y-2">
          <Label htmlFor="region-select" className="text-xs font-medium text-muted-foreground">
            Region
          </Label>
          <Select
            value={filters.region}
            onValueChange={(value) => handleFilterChange("region", value)}
          >
            <SelectTrigger id="region-select" className="h-9">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regionOptions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Platform Filter */}
        <div className="space-y-2">
          <Label htmlFor="platform-select" className="text-xs font-medium text-muted-foreground">
            Platform
          </Label>
          <Select
            value={filters.platform}
            onValueChange={(value) => handleFilterChange("platform", value)}
          >
            <SelectTrigger id="platform-select" className="h-9">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platformOptions.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Keyword Search */}
        <div className="space-y-2">
          <Label htmlFor="keyword-input" className="text-xs font-medium text-muted-foreground">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="keyword-input"
              placeholder="Search ad text..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange("keyword", e.target.value)}
              className="h-9 pl-9"
            />
            {filters.keyword && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("keyword")}
                className="absolute right-1 top-1 h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.competitor && filters.competitor !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Competitor: {filters.competitor}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("competitor")}
                className="ml-1 h-auto p-0 text-xs hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.propertyType && filters.propertyType !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Type: {filters.propertyType}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("propertyType")}
                className="ml-1 h-auto p-0 text-xs hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.region && filters.region !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Region: {filters.region}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("region")}
                className="ml-1 h-auto p-0 text-xs hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.platform && filters.platform !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Platform: {platformOptions.find(p => p.value === filters.platform)?.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("platform")}
                className="ml-1 h-auto p-0 text-xs hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.keyword && (
            <Badge variant="secondary" className="text-xs">
              Search: "{filters.keyword}"
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("keyword")}
                className="ml-1 h-auto p-0 text-xs hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
} 