import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/cms/sections — create new section (admin)
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const section = await prisma.pageContent.create({
    data: {
      pageKey: body.page_key,
      sectionKey: body.section_key,
      title: body.title,
      description: body.description,
      content: body.content ?? {},
      styles: body.styles,
      isActive: body.is_active ?? true,
      isEditable: body.is_editable ?? true,
      orderIndex: body.order_index ?? 0,
    },
  })

  return NextResponse.json({
    id: section.id,
    page_key: section.pageKey,
    section_key: section.sectionKey,
    title: section.title,
    description: section.description,
    content: section.content,
    styles: section.styles ?? {},
    is_active: section.isActive,
    is_editable: section.isEditable,
    order_index: section.orderIndex,
    version: section.version,
    created_at: section.updatedAt.toISOString(),
    updated_at: section.updatedAt.toISOString(),
  }, { status: 201 })
}
