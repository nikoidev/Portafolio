import { api } from '@/lib/api'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://tu-dominio.com'

    // Páginas estáticas
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
    ]

    // Páginas dinámicas de proyectos
    let projectPages: MetadataRoute.Sitemap = []

    try {
        const projects = await api.getProjects({ limit: 100 }) as any[]
        projectPages = projects.map((project) => ({
            url: `${baseUrl}/projects/${project.slug}`,
            lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(project.createdAt || new Date()),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }))
    } catch (error) {
        console.error('Error fetching projects for sitemap:', error)
    }

    return [...staticPages, ...projectPages]
}
