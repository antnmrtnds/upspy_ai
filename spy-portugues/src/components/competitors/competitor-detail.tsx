"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Competitor } from "./competitor-card"

export function CompetitorDetail({ competitor, onClose }: { competitor: Competitor; onClose?: () => void }) {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{competitor.name}</CardTitle>
        {competitor.description && (
          <CardDescription>{competitor.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {competitor.website && (
          <div>
            <span className="font-medium mr-1">Website:</span>
            <Link href={competitor.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">
              {competitor.website}
            </Link>
          </div>
        )}
        {competitor.facebook_url && (
          <div>
            <span className="font-medium mr-1">Facebook:</span>
            <Link href={competitor.facebook_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
              {competitor.facebook_url}
            </Link>
          </div>
        )}
        {competitor.instagram_url && (
          <div>
            <span className="font-medium mr-1">Instagram:</span>
            <Link href={competitor.instagram_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
              {competitor.instagram_url}
            </Link>
          </div>
        )}
        {competitor.tiktok_url && (
          <div>
            <span className="font-medium mr-1">TikTok:</span>
            <Link href={competitor.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
              {competitor.tiktok_url}
            </Link>
          </div>
        )}
      </CardContent>
      {onClose && (
        <CardFooter>
          <Button onClick={onClose}>Fechar</Button>
        </CardFooter>
      )}
    </Card>
  )
}