import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/cms/sections/[pageKey]/[sectionKey]/public — public, no auth
export async function GET(
  _req: NextRequest,
  { params }: { params: { pageKey: string; sectionKey: string } }
) {
  const section = await prisma.pageContent.findUnique({
    where: {
      pageKey_sectionKey: { pageKey: params.pageKey, sectionKey: params.sectionKey },
      isActive: true,
    },
  })

  if (!section) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    section_key: section.sectionKey,
    title: section.title,
    content: section.content,
    styles: section.styles ?? {},
    order_index: section.orderIndex,
  })
}
