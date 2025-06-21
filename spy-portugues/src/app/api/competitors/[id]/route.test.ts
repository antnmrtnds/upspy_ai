import { NextRequest } from 'next/server'
import { PUT, DELETE } from './route'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/supabase-server'

// Mock Clerk auth function
jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }))
// Mock Supabase client
jest.mock('@/lib/supabase-server', () => ({
  supabaseServer: { from: jest.fn() },
}))

describe('Competitor Detail API Route', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('PUT', () => {
    test('returns 401 when unauthorized', async () => {
      (auth as unknown as jest.Mock).mockResolvedValue({ userId: null })
      const req = {} as unknown as NextRequest
      const res = await PUT(req, { params: { id: 'comp-1' } })
      expect(res.status).toBe(401)
      expect(await res.json()).toEqual({ error: 'Unauthorized' })
    })

    test('returns 404 when profile not found', async () => {
      (auth as unknown as jest.Mock).mockResolvedValue({ userId: 'user-1' })
      const profileBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
      }
      ;(supabaseServer as any).from = jest.fn().mockReturnValue(profileBuilder)
      const req = { json: jest.fn().mockResolvedValue({ name: 'Updated' }) } as unknown as NextRequest
      const res = await PUT(req, { params: { id: 'comp-1' } })
      expect(res.status).toBe(404)
      expect(await res.json()).toEqual({ error: 'Profile not found' })
    })

    test('updates competitor and returns status 200 when successful', async () => {
      (auth as unknown as jest.Mock).mockResolvedValue({ userId: 'user-1' })
      const profileId = 'profile-123'
      const profileBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: profileId }, error: null }),
      }
      const updatedCompetitor = { id: 'comp-1', user_id: profileId, name: 'Updated', updated_at: '2023-01-01T00:00:00.000Z' }
      const updateBuilder = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: updatedCompetitor, error: null }),
      }
      ;(supabaseServer as any).from = jest.fn().mockImplementation((table: string) =>
        table === 'profiles' ? profileBuilder : updateBuilder
      )
      const req = { json: jest.fn().mockResolvedValue({ name: 'Updated' }) } as unknown as NextRequest
      const res = await PUT(req, { params: { id: 'comp-1' } })
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual({ data: updatedCompetitor })
    })
  })

  describe('DELETE', () => {
    test('returns 401 when unauthorized', async () => {
      (auth as unknown as jest.Mock).mockResolvedValue({ userId: null })
      const req = {} as unknown as NextRequest
      const res = await DELETE(req, { params: { id: 'comp-1' } })
      expect(res.status).toBe(401)
      expect(await res.json()).toEqual({ error: 'Unauthorized' })
    })

    test('returns 404 when profile not found', async () => {
      (auth as unknown as jest.Mock).mockResolvedValue({ userId: 'user-1' })
      const profileBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
      }
      ;(supabaseServer as any).from = jest.fn().mockReturnValue(profileBuilder)
      const req = {} as unknown as NextRequest
      const res = await DELETE(req, { params: { id: 'comp-1' } })
      expect(res.status).toBe(404)
      expect(await res.json()).toEqual({ error: 'Profile not found' })
    })

    test('deletes competitor and returns status 200 when successful', async () => {
      (auth as unknown as jest.Mock).mockResolvedValue({ userId: 'user-1' })
      const profileId = 'profile-123'
      const profileBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: profileId }, error: null }),
      }
      const deleteBuilder: any = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: (resolve: any) => resolve({ error: null }),
      }
      ;(supabaseServer as any).from = jest.fn().mockImplementation((table: string) =>
        table === 'profiles' ? profileBuilder : deleteBuilder
      )
      const req = {} as unknown as NextRequest
      const res = await DELETE(req, { params: { id: 'comp-1' } })
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual({ message: 'Competitor deleted' })
    })
  })
}) 