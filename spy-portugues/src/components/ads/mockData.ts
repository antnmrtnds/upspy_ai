import { Ad } from './types'

export const mockAds: Ad[] = [
  {
    id: '1',
    competitor_name: 'Century 21',
    headline: 'Apartamento T3 no Centro de Lisboa',
    ad_text: 'Apartamento moderno com 3 quartos, 2 casas de banho e varanda. Localização privilegiada no coração de Lisboa.',
    thumbnail_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=400&fit=crop',
    media_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    media_type: 'image',
    platform: 'facebook',
    property_type: 'Apartamento',
    region: 'Lisboa',
    first_seen: '2024-01-15T10:00:00Z',
    last_seen: '2024-01-20T15:30:00Z',
    engagement: {
      likes: 45,
      comments: 12,
      shares: 8,
      reactions: 65
    },
    targeting: {
      age_range: '25-45',
      interests: ['Real Estate', 'Home Buying'],
      locations: ['Lisboa', 'Porto']
    },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    competitor_name: 'RE/MAX',
    headline: 'Moradia T4 com Jardim no Porto',
    ad_text: 'Casa familiar com 4 quartos, jardim privado e garagem. Zona residencial tranquila.',
    thumbnail_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=400&fit=crop',
    media_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    media_type: 'video',
    platform: 'instagram',
    property_type: 'Moradia',
    region: 'Porto',
    first_seen: '2024-01-16T14:20:00Z',
    last_seen: '2024-01-22T09:15:00Z',
    engagement: {
      likes: 89,
      comments: 23,
      shares: 15,
      reactions: 127
    },
    created_at: '2024-01-16T14:20:00Z',
    updated_at: '2024-01-22T09:15:00Z'
  },
  {
    id: '3',
    competitor_name: 'ERA',
    headline: 'Loft Moderno em Cascais',
    ad_text: 'Loft contemporâneo com vista mar, totalmente mobilado. Ideal para jovens profissionais.',
    thumbnail_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop',
    media_type: 'carousel',
    platform: 'facebook',
    property_type: 'Loft',
    region: 'Cascais',
    first_seen: '2024-01-18T08:45:00Z',
    last_seen: '2024-01-25T16:20:00Z',
    engagement: {
      likes: 156,
      comments: 34,
      shares: 22,
      reactions: 212
    },
    created_at: '2024-01-18T08:45:00Z',
    updated_at: '2024-01-25T16:20:00Z'
  },
  {
    id: '4',
    competitor_name: 'Keller Williams',
    headline: 'Apartamento T2 Renovado',
    ad_text: 'Apartamento completamente renovado com acabamentos de luxo. Próximo ao metro.',
    thumbnail_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop',
    media_type: 'image',
    platform: 'tiktok',
    property_type: 'Apartamento',
    region: 'Lisboa',
    first_seen: '2024-01-19T12:30:00Z',
    last_seen: '2024-01-26T11:45:00Z',
    engagement: {
      likes: 78,
      comments: 19,
      shares: 11
    },
    created_at: '2024-01-19T12:30:00Z',
    updated_at: '2024-01-26T11:45:00Z'
  },
  {
    id: '5',
    competitor_name: 'Coldwell Banker',
    headline: 'Quinta com Piscina no Alentejo',
    ad_text: 'Propriedade rural com casa principal, piscina e terreno de 2 hectares. Perfeita para turismo rural.',
    thumbnail_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop',
    media_type: 'video',
    platform: 'instagram',
    property_type: 'Quinta',
    region: 'Alentejo',
    first_seen: '2024-01-17T16:10:00Z',
    last_seen: '2024-01-24T13:25:00Z',
    engagement: {
      likes: 203,
      comments: 45,
      shares: 31,
      reactions: 279
    },
    created_at: '2024-01-17T16:10:00Z',
    updated_at: '2024-01-24T13:25:00Z'
  },
  {
    id: '6',
    competitor_name: 'Engel & Völkers',
    headline: 'Penthouse de Luxo com Vista',
    ad_text: 'Penthouse exclusivo com terraço panorâmico e acabamentos premium. Vista deslumbrante sobre a cidade.',
    thumbnail_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=400&fit=crop',
    media_type: 'carousel',
    platform: 'facebook',
    property_type: 'Penthouse',
    region: 'Lisboa',
    first_seen: '2024-01-20T09:15:00Z',
    last_seen: '2024-01-27T14:40:00Z',
    engagement: {
      likes: 312,
      comments: 67,
      shares: 43,
      reactions: 422
    },
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-01-27T14:40:00Z'
  }
]

// Mock data for different states
export const emptyAds: Ad[] = []

export const loadingAds = null 