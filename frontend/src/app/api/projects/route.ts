import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a').replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i').replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u').replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function mapProject(p: any) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    short_description: p.shortDescription,
    content: p.content,
    github_url: p.githubUrl,
    demo_video_type: p.demoVideoType,
    demo_video_url: p.demoVideoUrl,
    demo_video_thumbnail: p.demoVideoThumbnail,
    demo_images: p.demoImages,
    technologies: p.technologies,
    tags: p.tags,
    thumbnail_url: p.thumbnailUrl,
    is_featured: p.isFeatured,
    is_published: p.isPublished,
    order_index: p.orderIndex,
    view_count: p.viewCount,
    created_at: p.createdAt.toISOString(),
    updated_at: p.updatedAt.toISOString(),
  }
}

// GET /api/projects — public list
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const featuredOnly = searchParams.get('featured_only') === 'true'
  const includeUnpublished = searchParams.get('include_unpublished') === 'true'
  const search = searchParams.get('search') ?? ''
  const limit = parseInt(searchParams.get('limit') ?? '100')
  const skip = parseInt(searchParams.get('skip') ?? '0')

  const session = await auth()

  const where: any = {}
  if (featuredOnly) where.isFeatured = true
  if (!includeUnpublished || !session) where.isPublished = true
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: [{ isFeatured: 'desc' }, { orderIndex: 'asc' }, { createdAt: 'desc' }],
    take: limit,
    skip,
  })

  return NextResponse.json(projects.map(mapProject))
}

// POST /api/projects — admin only
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const slug = body.slug || toSlug(body.title)

  const project = await prisma.project.create({
    data: {
      slug,
      title: body.title,
      description: body.description,
      shortDescription: body.short_description,
      content: body.content,
      githubUrl: body.github_url,
      demoVideoType: body.demo_video_type,
      demoVideoUrl: body.demo_video_url,
      demoVideoThumbnail: body.demo_video_thumbnail,
      demoImages: body.demo_images ?? [],
      technologies: body.technologies ?? [],
      tags: body.tags ?? [],
      thumbnailUrl: body.thumbnail_url,
      isFeatured: body.is_featured ?? false,
      isPublished: body.is_published ?? true,
      orderIndex: body.order_index ?? 0,
    },
  })

  return NextResponse.json(mapProject(project), { status: 201 })
}
