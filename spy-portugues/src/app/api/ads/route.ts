import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '12'
  const sortBy = searchParams.get('sort_by') || 'created_at'
  const sortOrder = searchParams.get('sort_order') || 'desc'
  const offset = (parseInt(page) - 1) * parseInt(limit)
  const url = new URL(`${apiUrl}/api/ads`)
  url.searchParams.set('limit', limit)
  url.searchParams.set('offset', offset.toString())
  url.searchParams.set('sort_by', sortBy)
  url.searchParams.set('sort_order', sortOrder)
  const res = await fetch(url.toString())
  if (!res.ok) {
    return NextResponse.error()
  }
  const json = await res.json()
  return NextResponse.json(json)
} 