import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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
  google_analytics_id: null,
  theme_mode: 'auto',
  primary_color: '#3b82f6',
  maintenance_mode: false,
  maintenance_message: null,
  global_banner: null,
  banner_enabled: false,
  banner_type: 'info',
}

// GET /api/settings/public — public, no auth required
export async function GET() {
  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
  const data = settings?.data as Record<string, any> ?? {}

  const publicData = {
    site_name: data.site_name ?? DEFAULT_SETTINGS.site_name,
    site_description: data.site_description ?? DEFAULT_SETTINGS.site_description,
    site_logo_url: data.site_logo_url ?? null,
    site_favicon_url: data.site_favicon_url ?? null,
    contact_email: data.contact_email ?? '',
    contact_phone: data.contact_phone ?? '',
    contact_location: data.contact_location ?? '',
    contact_availability: data.contact_availability ?? DEFAULT_SETTINGS.contact_availability,
    social_links: data.social_links ?? [],
    seo_title: data.seo_title ?? '',
    seo_description: data.seo_description ?? '',
    google_analytics_id: data.google_analytics_id ?? null,
    theme_mode: data.theme_mode ?? DEFAULT_SETTINGS.theme_mode,
    primary_color: data.primary_color ?? DEFAULT_SETTINGS.primary_color,
    maintenance_mode: data.maintenance_mode ?? false,
    maintenance_message: data.maintenance_message ?? null,
    global_banner: data.global_banner ?? null,
    banner_enabled: data.banner_enabled ?? false,
    banner_type: data.banner_type ?? 'info',
  }

  return NextResponse.json(publicData)
}
