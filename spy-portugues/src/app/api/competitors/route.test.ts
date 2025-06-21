import { NextRequest } from 'next/server'
import { GET, POST /*, PUT, DELETE */ } from './route'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/supabase-server'

// Mock Clerk auth function
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}))
// Mock Supabase client
jest.mock('@/lib/supabase-server', () => ({
  supabaseServer: {
    from: jest.fn(),
  },
}))

describe('Competitors API Route', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    test('returns 401 when unauthorized', async () => {
      (auth as unknown as jest.Mock).mockResolvedValue({ userId: null })

      const req = { url: 'http://example.com/api/competitors' } as unknown as NextRequest
      const res = await GET(req)

      expect(res.status).toBe(401)
      const body = await res.json()
      expect(body).toEqual({ error: 'Unauthorized' })
    })

    test('returns 404 when profile not found', async () => {
      (auth as unknown as jest.Mock).mockResolvedValue({ userId: 'user-1' })

      const profileBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
      }
      ;(supabaseServer as any).from = jest.fn().mockReturnValue(profileBuilder)

      const req = { url: 'http://example.com/api/competitors' } as unknown as NextRequest
      const res = await GET(req)

      expect(res.status).toBe(404)
      const body = await res.json()
      expect(body).toEqual({ error: 'Profile not found' })
    })

    test('returns competitor list with status 200 when successful', async () => {
      (auth as unknown as jest.Mock).mockResolvedValue({ userId: 'user-1' })

      const profileId = 'profile-123'
      const profileBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: profileId }, error: null }),
      }

      const competitorsData = [
        { id: 'comp-1', user_id: profileId, name: 'Comp One', created_at: '2023-01-01' },
      ]
      const competitorsBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({ data: competitorsData, error: null }),
      }

      ;(supabaseServer as any).from = jest.fn().mockImplementation((table: string) =>
        table === 'profiles' ? profileBuilder : competitorsBuilder
      )

      const req = { url: 'http://example.com/api/competitors?limit=10&offset=5' } as unknown as NextRequest
      const res = await GET(req)

      expect((supabaseServer.from as jest.Mock).mock.calls[1][0]).toBe('competitors')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toEqual({ data: competitorsData })
    })
  })

  describe('POST', () => {
    test('returns 401 when unauthorized', async () => {
      (auth as unknown as jest.Mock).mockResolvedValue({ userId: null })

      const req = { url: 'http://example.com/api/competitors', json: jest.fn() } as unknown as NextRequest
      const res = await POST(req)

      expect(res.status).toBe(401)
      const body = await res.json()
      expect(body).toEqual({ error: 'Unauthorized' })
    })

    test('returns 404 when profile not found', async () => {
      (auth as unknown as jest.Mock).mockResolvedValue({ userId: 'user-1' })

      const profileBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
      }
      ;(supabaseServer as any).from = jest.fn().mockReturnValue(profileBuilder)

      const req = {
        url: 'http://example.com/api/competitors',
        json: jest.fn().mockResolvedValue({ name: 'Test' }),
      } as unknown as NextRequest
      const res = await POST(req)

      expect(res.status).toBe(404)
      const body = await res.json()
      expect(body).toEqual({ error: 'Profile not found' })
    })

    test('creates and returns new competitor with status 201 when successful', async () => {
      (auth as unknown as jest.Mock).mockResolvedValue({ userId: 'user-1' })

      const profileId = 'profile-123'
      const profileBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: profileId }, error: null }),
      }

      const newCompetitor = { id: 'comp-1', user_id: profileId, name: 'New Comp', created_at: '2023-01-01' }
      const insertBuilder = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: newCompetitor, error: null }),
      }
      ;(supabaseServer as any).from = jest.fn().mockImplementation((table: string) =>
        table === 'profiles' ? profileBuilder : insertBuilder
      )

      const req = {
        url: 'http://example.com/api/competitors',
        json: jest.fn().mockResolvedValue({ name: 'New Comp' }),
      } as unknown as NextRequest
      const res = await POST(req)

      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body).toEqual({ data: newCompetitor })
    })
  })

  describe('PUT', () => {
    test.todo('returns 401 when unauthorized')
    test.todo('returns 404 when profile not found')
    test.todo('updates competitor and returns status 200 when successful')
  })

  describe('DELETE', () => {
    test.todo('returns 401 when unauthorized')
    test.todo('returns 404 when profile not found')
    test.todo('deletes competitor and returns status 200 when successful')
  })
}) 