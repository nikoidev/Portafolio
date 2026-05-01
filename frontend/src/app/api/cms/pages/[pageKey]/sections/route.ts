import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

function mapSection(s: any) {
  return {
    id: s.id,
    page_key: s.pageKey,
    section_key: s.sectionKey,
    title: s.title,
    description: s.description,
    content: s.content,
    styles: s.styles ?? {},
    is_active: s.isActive,
    is_editable: s.isEditable,
    order_index: s.orderIndex,
    version: s.version,
    created_at: s.updatedAt.toISOString(),
    updated_at: s.updatedAt.toISOString(),
  }
}

// GET /api/cms/pages/[pageKey]/sections — admin, with all metadata
export async function GET(
  req: NextRequest,
  { params }: { params: { pageKey: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const activeOnly = req.nextUrl.searchParams.get('active_only') === 'true'

  const sections = await prisma.pageContent.findMany({
    where: {
      pageKey: params.pageKey,
      ...(activeOnly ? { isActive: true } : {}),
    },
    orderBy: { orderIndex: 'asc' },
  })

  return NextResponse.json(sections.map(mapSection))
}
