// Types for Ad Creative Gallery
export interface Ad {
  id: string
  competitor_name: string
  headline: string
  ad_text?: string
  thumbnail_url?: string
  media_url?: string
  media_type: 'image' | 'video' | 'carousel'
  platform: 'facebook' | 'instagram' | 'tiktok'
  property_type?: string
  region?: string
  first_seen: string
  last_seen: string
  engagement?: {
    likes?: number
    comments?: number
    shares?: number
    reactions?: number
  }
  targeting?: {
    age_range?: string
    interests?: string[]
    locations?: string[]
  }
  created_at: string
  updated_at: string
}

export interface AdCardProps {
  ad: Ad
  onClick?: (ad: Ad) => void
  className?: string
}

export interface AdGalleryProps {
  ads?: Ad[]
  loading?: boolean
  onAdClick?: (ad: Ad) => void
  className?: string
}

export interface GalleryFilters {
  competitor: string
  propertyType: string
  region: string
  keyword: string
  platform: string
} 