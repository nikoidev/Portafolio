import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_SETTINGS = {
  site_name: 'Mi Portafolio',
  site_description: '',
  site_logo_url: null,
  site_favicon_url: null,
  contact_email: '',
  contact_phone: '',
  contact_location: '',
  contact_availability: 'Disponible para proyectos',
  social_links: [],
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  seo_og_image: null,
  google_analytics_id: null,
  google_search_console: null,
  theme_mode: 'auto',
  primary_color: '#3b82f6',
  font_family: null,
  maintenance_mode: false,
  maintenance_message: null,
  global_banner: null,
  banner_enabled: false,
  banner_type: 'info',
  newsletter_enabled: false,
  newsletter_provider: null,
  newsletter_api_key: null,
  facebook_pixel: null,
  hotjar_id: null,
  extra_config: {},
}

function buildResponse(settings: any) {
  const data = settings?.data as Record<string, any> ?? {}
  return {
    id: settings?.id ?? 'singleton',
    ...DEFAULT_SETTINGS,
    ...data,
    created_at: settings?.updatedAt?.toISOString() ?? new Date().toISOString(),
    updated_at: settings?.updatedAt?.toISOString() ?? new Date().toISOString(),
  }
}

// GET /api/settings — admin
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
  return NextResponse.json(buildResponse(settings))
}

// PUT /api/settings — admin
export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const existing = await prisma.settings.findUnique({ where: { id: 'singleton' } })
  const currentData = (existing?.data as Record<string, any>) ?? {}

  const settings = await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: { data: { ...currentData, ...body } },
    create: { id: 'singleton', data: { ...DEFAULT_SETTINGS, ...body } },
  })

  return NextResponse.json(buildResponse(settings))
}
