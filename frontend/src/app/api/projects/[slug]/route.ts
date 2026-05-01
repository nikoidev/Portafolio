import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

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

// GET /api/projects/[slug]
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  })

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const session = await auth()
  if (!project.isPublished && !session) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(mapProject(project))
}

// PUT /api/projects/[slug] — admin only
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const project = await prisma.project.update({
    where: { slug: params.slug },
    data: {
      slug: body.slug,
      title: body.title,
      description: body.description,
      shortDescription: body.short_description,
      content: body.content,
      githubUrl: body.github_url,
      demoVideoType: body.demo_video_type,
      demoVideoUrl: body.demo_video_url,
      demoVideoThumbnail: body.demo_video_thumbnail,
      demoImages: body.demo_images,
      technologies: body.technologies,
      tags: body.tags,
      thumbnailUrl: body.thumbnail_url,
      isFeatured: body.is_featured,
      isPublished: body.is_published,
      orderIndex: body.order_index,
    },
  })

  return NextResponse.json(mapProject(project))
}

// DELETE /api/projects/[slug] — admin only
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.project.delete({ where: { slug: params.slug } })

  return NextResponse.json({ message: 'Project deleted' })
}
