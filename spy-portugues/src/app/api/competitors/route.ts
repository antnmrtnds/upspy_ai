import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/supabase-server'

async function getProfileId(clerkId: string): Promise<string | null> {
  const { data, error } = await supabaseServer
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', clerkId)
    .single()
  if (error) {
    console.error('Failed to fetch profile', error)
    return null
  }
  return data?.id ?? null
}

export async function GET(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profileId = await getProfileId(userId)
  if (!profileId) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') || '20')
  const offset = Number(searchParams.get('offset') || '0')

  const { data, error } = await supabaseServer
    .from('competitors')
    .select('*')
    .eq('user_id', profileId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch competitors', error)
    return NextResponse.json({ error: 'Failed to fetch competitors' }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profileId = await getProfileId(userId)
  if (!profileId) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const body = await request.json()

  const { data, error } = await supabaseServer
    .from('competitors')
    .insert([{ ...body, user_id: profileId }])
    .select()
    .single()

  if (error) {
    console.error('Failed to create competitor', error)
    return NextResponse.json({ error: 'Failed to create competitor' }, { status: 400 })
  }

  return NextResponse.json({ data }, { status: 201 })
}