import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/cms/sections/[pageKey]/[sectionKey]/reorder — admin
export async function PATCH(
  req: NextRequest,
  { params }: { params: { pageKey: string; sectionKey: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { direction } = await req.json() as { direction: 'up' | 'down' }

  const current = await prisma.pageContent.findUnique({
    where: { pageKey_sectionKey: { pageKey: params.pageKey, sectionKey: params.sectionKey } },
  })

  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const sibling = await prisma.pageContent.findFirst({
    where: {
      pageKey: params.pageKey,
      orderIndex: direction === 'up'
        ? { lt: current.orderIndex }
        : { gt: current.orderIndex },
    },
    orderBy: { orderIndex: direction === 'up' ? 'desc' : 'asc' },
  })

  if (!sibling) {
    return NextResponse.json({
      id: current.id,
      page_key: current.pageKey,
      section_key: current.sectionKey,
      order_index: current.orderIndex,
    })
  }

  // Swap order_index values
  await prisma.$transaction([
    prisma.pageContent.update({
      where: { id: current.id },
      data: { orderIndex: sibling.orderIndex },
    }),
    prisma.pageContent.update({
      where: { id: sibling.id },
      data: { orderIndex: current.orderIndex },
    }),
  ])

  const updated = await prisma.pageContent.findUnique({ where: { id: current.id } })

  return NextResponse.json({
    id: updated!.id,
    page_key: updated!.pageKey,
    section_key: updated!.sectionKey,
    title: updated!.title,
    content: updated!.content,
    order_index: updated!.orderIndex,
    is_active: updated!.isActive,
    is_editable: updated!.isEditable,
    version: updated!.version,
    updated_at: updated!.updatedAt.toISOString(),
  })
}
