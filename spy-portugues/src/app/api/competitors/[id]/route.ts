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

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profileId = await getProfileId(userId)
  if (!profileId) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const { id } = context.params
  const { data, error } = await supabaseServer
    .from('competitors')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Competitor not found' }, { status: 404 })
  }

  if (data.user_id !== profileId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({ data })
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profileId = await getProfileId(userId)
  if (!profileId) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const body = await request.json()
  const { id } = context.params

  const { data, error } = await supabaseServer
    .from('competitors')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', profileId)
    .select()
    .single()

  if (error || !data) {
    console.error('Failed to update competitor', error)
    return NextResponse.json({ error: 'Failed to update competitor' }, { status: 400 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profileId = await getProfileId(userId)
  if (!profileId) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const { id } = context.params

  const { error } = await supabaseServer
    .from('competitors')
    .delete()
    .eq('id', id)
    .eq('user_id', profileId)

  if (error) {
    console.error('Failed to delete competitor', error)
    return NextResponse.json({ error: 'Failed to delete competitor' }, { status: 400 })
  }

  return NextResponse.json({ message: 'Competitor deleted' })
}