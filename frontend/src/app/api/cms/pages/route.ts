import { CMS_PAGES } from '@/lib/cms-pages'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/cms/pages — list of all pages with section count
export async function GET() {
  const counts = await prisma.pageContent.groupBy({
    by: ['pageKey'],
    _count: { id: true },
  })
  const countMap = Object.fromEntries(counts.map((c: any) => [c.pageKey, c._count.id]))

  const pages = CMS_PAGES.map(p => ({
    page_key: p.page_key,
    label: p.label,
    icon: p.icon,
    description: p.description,
    sections_count: countMap[p.page_key] ?? 0,
  }))

  return NextResponse.json(pages)
}
