import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/projects/[slug]/view — public, increments view count
export async function POST(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await prisma.project.update({
    where: { slug: params.slug },
    data: { viewCount: { increment: 1 } },
  })

  return NextResponse.json({ ok: true })
}
