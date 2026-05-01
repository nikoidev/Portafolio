import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/cms/pages/[pageKey]/public — public, no auth
export async function GET(
  _req: NextRequest,
  { params }: { params: { pageKey: string } }
) {
  const sections = await prisma.pageContent.findMany({
    where: { pageKey: params.pageKey, isActive: true },
    orderBy: { orderIndex: 'asc' },
  })

  return NextResponse.json({
    page_key: params.pageKey,
    sections: sections.map((s: any) => ({
      section_key: s.sectionKey,
      title: s.title,
      content: s.content,
      styles: s.styles ?? {},
      order_index: s.orderIndex,
    })),
  })
}
