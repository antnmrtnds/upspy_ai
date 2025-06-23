"use client"

import { useState } from "react"
import { AdGallery, EmptyGalleryState, FilteredAdGallery, Ad, GalleryFilters } from "@/components/ads"
import { mockAds, emptyAds } from "@/components/ads/mockData"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GalleryDemoPage() {
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [currentFilters, setCurrentFilters] = useState<GalleryFilters>({
    competitor: "all",
    propertyType: "all",
    region: "all",
    keyword: "",
    platform: "all"
  })

  const handleAdClick = (ad: Ad) => {
    setSelectedAd(ad)
    console.log('Ad clicked:', ad)
  }

  const handleFiltersChange = (filters: GalleryFilters) => {
    setCurrentFilters(filters)
    console.log('Filters changed:', filters)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Ad Gallery Demo</h1>
        <p className="text-muted-foreground">
          Demonstrating Task 9.1 (Core Gallery UI) and Task 9.2 (Filter Controls & State Management)
        </p>
      </div>

      <Tabs defaultValue="filtered" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="filtered">With Filters</TabsTrigger>
          <TabsTrigger value="gallery">Basic Gallery</TabsTrigger>
          <TabsTrigger value="loading">Loading State</TabsTrigger>
          <TabsTrigger value="empty">Empty State</TabsTrigger>
          <TabsTrigger value="no-ads">No Ads State</TabsTrigger>
        </TabsList>

        <TabsContent value="filtered" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtered Gallery (Task 9.2)</CardTitle>
            </CardHeader>
            <CardContent>
              <FilteredAdGallery 
                ads={mockAds} 
                onAdClick={handleAdClick}
                onFiltersChange={handleFiltersChange}
                showFilters={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Gallery (Task 9.1)</CardTitle>
            </CardHeader>
            <CardContent>
              <AdGallery 
                ads={mockAds} 
                onAdClick={handleAdClick}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading State</CardTitle>
            </CardHeader>
            <CardContent>
              <AdGallery 
                loading={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empty" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Empty State (No Results)</CardTitle>
            </CardHeader>
            <CardContent>
              <AdGallery 
                ads={emptyAds}
                onAdClick={handleAdClick}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="no-ads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>No Ads Collected State</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyGalleryState />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Ad Display */}
      {selectedAd && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Ad Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <ul className="space-y-1 text-sm">
                    <li><strong>ID:</strong> {selectedAd.id}</li>
                    <li><strong>Competitor:</strong> {selectedAd.competitor_name}</li>
                    <li><strong>Headline:</strong> {selectedAd.headline}</li>
                    <li><strong>Platform:</strong> {selectedAd.platform}</li>
                    <li><strong>Media Type:</strong> {selectedAd.media_type}</li>
                    <li><strong>Property Type:</strong> {selectedAd.property_type}</li>
                    <li><strong>Region:</strong> {selectedAd.region}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Engagement</h3>
                  {selectedAd.engagement && (
                    <ul className="space-y-1 text-sm">
                      <li><strong>Likes:</strong> {selectedAd.engagement.likes?.toLocaleString()}</li>
                      <li><strong>Comments:</strong> {selectedAd.engagement.comments?.toLocaleString()}</li>
                      <li><strong>Shares:</strong> {selectedAd.engagement.shares?.toLocaleString()}</li>
                      <li><strong>Reactions:</strong> {selectedAd.engagement.reactions?.toLocaleString()}</li>
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Ad Text</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAd.ad_text}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedAd(null)}
              >
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Component Info */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">✅ Task 9.1 Components Implemented:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>AdCard:</strong> Displays individual ad thumbnails with competitor name, headline, and engagement data</li>
              <li><strong>AdGallery:</strong> Responsive grid layout with loading and empty states</li>
              <li><strong>Responsive Design:</strong> CSS Grid layout that adapts to different screen sizes</li>
              <li><strong>Loading States:</strong> Skeleton components for smooth loading experience</li>
              <li><strong>Empty States:</strong> Helpful messages when no ads are found</li>
              <li><strong>TypeScript Types:</strong> Comprehensive type definitions for all components</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">✅ Task 9.2 Filter System Implemented:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>AdFilters:</strong> Complete filter controls UI with Select and Input components</li>
              <li><strong>useAdFilters:</strong> Custom hook for managing filter state and applying filters</li>
              <li><strong>FilteredAdGallery:</strong> Integrated gallery with filters and results summary</li>
              <li><strong>Filter Types:</strong> Competitor, Property Type, Region, Platform, and Keyword search</li>
              <li><strong>Active Filter Display:</strong> Visual badges showing applied filters with clear buttons</li>
              <li><strong>Results Counter:</strong> Shows filtered vs total results with active filter count</li>
              <li><strong>Reactive Updates:</strong> UI updates immediately when filters change</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">🎨 Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Platform-specific color coding (Facebook blue, Instagram pink, TikTok black)</li>
              <li>Media type indicators (Video, Carousel)</li>
              <li>Portuguese date formatting</li>
              <li>Engagement metrics display</li>
              <li>Hover effects and animations</li>
              <li>Click handling for ad selection</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">📱 Responsive Breakpoints:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Mobile:</strong> 1 column</li>
              <li><strong>Small tablets:</strong> 2 columns</li>
              <li><strong>Medium tablets:</strong> 3 columns</li>
              <li><strong>Desktop:</strong> 4 columns</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 