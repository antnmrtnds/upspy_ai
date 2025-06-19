import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// Update user role (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: currentUserId } = await auth()
    const { userId: targetUserId } = await params
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if current user is admin
    const client = await clerkClient()
    const currentUser = await client.users.getUser(currentUserId)
    const currentUserRole = currentUser.publicMetadata?.role as string
    
    if (currentUserRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { role } = body

    // Validate role
    const allowedRoles = ['admin', 'user']
    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Update target user's role
    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        role: role
      }
    })

    return NextResponse.json({ 
      message: 'Role updated successfully',
      userId: targetUserId,
      role: role 
    })

  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get user role (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: currentUserId } = await auth()
    const { userId: targetUserId } = await params
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if current user is admin or requesting their own role
    const client = await clerkClient()
    const currentUser = await client.users.getUser(currentUserId)
    const currentUserRole = currentUser.publicMetadata?.role as string
    
    if (currentUserRole !== 'admin' && currentUserId !== targetUserId) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    // Get target user's role
    const targetUser = await client.users.getUser(targetUserId)
    const targetUserRole = targetUser.publicMetadata?.role as string || 'user'

    return NextResponse.json({ 
      userId: targetUserId,
      role: targetUserRole,
      email: targetUser.emailAddresses[0]?.emailAddress,
      name: `${targetUser.firstName || ''} ${targetUser.lastName || ''}`.trim()
    })

  } catch (error) {
    console.error('Error getting user role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 