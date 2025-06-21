"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import type { Competitor } from "./types"

export type { Competitor } from "./types"
export function CompetitorCard({ competitor }: { competitor: Competitor }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 pb-2">
        <Avatar className="h-8 w-8">
          {competitor.logo_url && <AvatarImage src={competitor.logo_url} alt={competitor.name} />}
          <AvatarFallback>
            {competitor.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-sm font-medium">
          {competitor.name}
        </CardTitle>
        {competitor.website && (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="ml-auto"
          >
            <Link href={competitor.website} target="_blank" rel="noopener noreferrer">
              Site
            </Link>
          </Button>
        )}
      </CardHeader>
      {competitor.description && (
        <CardContent className="pt-0 text-sm text-muted-foreground">
          {competitor.description}
        </CardContent>
      )}
    </Card>
  )
}