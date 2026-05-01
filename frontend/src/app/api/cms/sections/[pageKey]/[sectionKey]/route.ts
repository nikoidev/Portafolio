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

// GET /api/cms/sections/[pageKey]/[sectionKey] — admin
export async function GET(
  _req: NextRequest,
  { params }: { params: { pageKey: string; sectionKey: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const section = await prisma.pageContent.findUnique({
    where: { pageKey_sectionKey: { pageKey: params.pageKey, sectionKey: params.sectionKey } },
  })

  if (!section) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(mapSection(section))
}

// PUT /api/cms/sections/[pageKey]/[sectionKey] — admin
export async function PUT(
  req: NextRequest,
  { params }: { params: { pageKey: string; sectionKey: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const section = await prisma.pageContent.update({
    where: { pageKey_sectionKey: { pageKey: params.pageKey, sectionKey: params.sectionKey } },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.styles !== undefined && { styles: body.styles }),
      ...(body.is_active !== undefined && { isActive: body.is_active }),
      ...(body.is_editable !== undefined && { isEditable: body.is_editable }),
      ...(body.order_index !== undefined && { orderIndex: body.order_index }),
      version: { increment: 1 },
    },
  })

  return NextResponse.json(mapSection(section))
}

// DELETE /api/cms/sections/[pageKey]/[sectionKey] — admin
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { pageKey: string; sectionKey: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.pageContent.delete({
    where: { pageKey_sectionKey: { pageKey: params.pageKey, sectionKey: params.sectionKey } },
  })

  return NextResponse.json({ message: 'Section deleted' })
}
