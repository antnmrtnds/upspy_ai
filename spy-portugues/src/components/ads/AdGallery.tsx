"use client"

import { AdCard } from "./AdCard"
import { AdGalleryProps } from "./types"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function AdGallery({ ads = [], loading = false, onAdClick, className }: AdGalleryProps) {
  // Loading state
  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <AdCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (!ads || ads.length === 0) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No ads found
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            No advertisements match your current filters. Try adjusting your search criteria or check back later for new content.
          </p>
        </div>
      </div>
    )
  }

  // Gallery with ads
  return (
    <div className={cn("space-y-6", className)}>
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {ads.length.toLocaleString()} {ads.length === 1 ? 'ad' : 'ads'}
        </p>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ads.map((ad) => (
          <AdCard 
            key={ad.id} 
            ad={ad} 
            onClick={onAdClick}
            className="h-full"
          />
        ))}
      </div>
    </div>
  )
}

// Skeleton component for loading state
function AdCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

// Alternative empty state for when no ads exist at all
export function EmptyGalleryState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <ImageIcon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">
        No ads collected yet
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Start by adding competitors to track, and our system will begin collecting their advertisements automatically.
      </p>
      <div className="text-sm text-muted-foreground">
        <p>💡 Tip: Add competitors in the Competitors section to get started</p>
      </div>
    </div>
  )
} 