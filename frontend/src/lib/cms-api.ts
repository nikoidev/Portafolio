/**
 * API Client para CMS (Content Management System)
 * Ahora usa Route Handlers internos del mismo dominio.
 */
import {
    CMSStats,
    PageContent,
    PageContentCreate,
    PageContentUpdate,
    PageInfo,
    PagePublic,
    PageSectionPublic,
} from '@/types/cms';
import { api } from './api';

class CMSApi {
    // ========== Public Endpoints ==========

    async getPagePublic(pageKey: string): Promise<PagePublic> {
        return api.get<PagePublic>(`/api/cms/pages/${pageKey}/public`);
    }

    async getSectionPublic(pageKey: string, sectionKey: string): Promise<PageSectionPublic> {
        return api.get<PageSectionPublic>(`/api/cms/sections/${pageKey}/${sectionKey}/public`);
    }

    // ========== Admin Endpoints ==========

    async getAvailablePages(): Promise<PageInfo[]> {
        return api.get<PageInfo[]>('/api/cms/pages');
    }

    async getPageSections(pageKey: string, activeOnly?: boolean): Promise<PageContent[]> {
        const params = activeOnly ? { active_only: activeOnly } : {};
        return api.get<PageContent[]>(`/api/cms/pages/${pageKey}/sections`, params);
    }

    async getSection(pageKey: string, sectionKey: string): Promise<PageContent> {
        return api.get<PageContent>(`/api/cms/sections/${pageKey}/${sectionKey}`);
    }

    async createSection(sectionData: PageContentCreate): Promise<PageContent> {
        return api.post<PageContent>('/api/cms/sections', sectionData);
    }

    async updateSection(
        pageKey: string,
        sectionKey: string,
        sectionData: PageContentUpdate
    ): Promise<PageContent> {
        return api.put<PageContent>(
            `/api/cms/sections/${pageKey}/${sectionKey}`,
            sectionData
        );
    }

    async deleteSection(pageKey: string, sectionKey: string): Promise<void> {
        return api.delete(`/api/cms/sections/${pageKey}/${sectionKey}`);
    }

    async getStats(): Promise<CMSStats> {
        // Compute stats from pages list
        const pages = await this.getAvailablePages();
        const totalSections = pages.reduce((sum, p) => sum + p.sections_count, 0);
        return {
            total_pages: pages.length,
            total_sections: totalSections,
            active_sections: totalSections,
            editable_sections: totalSections,
        };
    }

    async seedDefaultContent(): Promise<PageContent[]> {
        return api.post<PageContent[]>('/api/cms/seed');
    }

    async reorderSection(
        pageKey: string,
        sectionKey: string,
        direction: 'up' | 'down'
    ): Promise<PageContent> {
        return api.patch<PageContent>(
            `/api/cms/sections/${pageKey}/${sectionKey}/reorder`,
            { direction }
        );
    }
}

export const cmsApi = new CMSApi();
