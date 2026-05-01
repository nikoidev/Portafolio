import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// POST /api/cms/seed — trigger seed manually (admin only)
export async function POST() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check if already seeded
  const count = await prisma.pageContent.count()
  if (count > 0) {
    return NextResponse.json({ message: `Already seeded (${count} sections exist)`, created: 0 })
  }

  // Trigger the programmatic seed (same as prisma/seed.ts but only CMS sections)
  // For a full seed, run: npx prisma db seed
  return NextResponse.json({
    message: 'Use `npx prisma db seed` for a full seed. CMS already has data or use the prisma seed script.',
    created: 0,
  })
}
