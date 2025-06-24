import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, MapPin } from "lucide-react"
import { AdCardProps } from "./types"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function AdCard({ ad, onClick, className }: AdCardProps) {
  const handleClick = () => {
    onClick?.(ad)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatEngagement = (engagement?: { likes?: number; comments?: number; shares?: number; reactions?: number }) => {
    if (!engagement) return 0
    return (engagement.likes || 0) + (engagement.comments || 0) + (engagement.shares || 0) + (engagement.reactions || 0)
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'bg-blue-500'
      case 'instagram':
        return 'bg-pink-500'
      case 'tiktok':
        return 'bg-black'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-border/50",
        className
      )}
      onClick={handleClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
          {ad.thumbnail_url ? (
            <Image
              src={ad.thumbnail_url}
              alt={ad.headline}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          {/* Media type indicator */}
          {ad.media_type === 'video' && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
              Video
            </div>
          )}
          
          {ad.media_type === 'carousel' && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
              Carousel
            </div>
          )}
          
          {/* Platform badge */}
          <div className="absolute top-2 left-2">
            <Badge 
              variant="secondary" 
              className={cn("text-white border-0", getPlatformColor(ad.platform))}
            >
              {ad.platform.charAt(0).toUpperCase() + ad.platform.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <CardTitle className="text-sm font-semibold text-foreground line-clamp-2 mb-1">
            {ad.headline}
          </CardTitle>
          <p className="text-xs text-muted-foreground font-medium">
            {ad.competitor_name}
          </p>
        </div>
        
        {ad.ad_text && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {ad.ad_text}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(ad.first_seen)}</span>
          </div>
          
          {ad.region && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-20">{ad.region}</span>
            </div>
          )}
        </div>
        
        {ad.engagement && formatEngagement(ad.engagement) > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {formatEngagement(ad.engagement).toLocaleString()} interactions
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleClick()
              }}
            >
              View Details
            </Button>
          </div>
        )}
        
        {ad.property_type && (
          <Badge variant="outline" className="text-xs">
            {ad.property_type}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
} 