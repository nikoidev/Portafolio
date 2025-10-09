/**
 * Google Analytics Event Tracking Utilities
 */

// Declare gtag function for TypeScript
declare global {
    interface Window {
        gtag?: (
            command: 'config' | 'event' | 'js' | 'set',
            targetId: string | Date,
            config?: Record<string, any>
        ) => void;
    }
}

/**
 * Track a pageview
 */
export const trackPageView = (url: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'page_view', {
            page_path: url,
        });
    }
};

/**
 * Track CV download
 */
export const trackCVDownload = () => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'download_cv', {
            event_category: 'engagement',
            event_label: 'CV Downloaded',
            value: 1,
        });
    }
};

/**
 * Track project view
 */
export const trackProjectView = (projectId: string | number, projectTitle: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'view_project', {
            event_category: 'engagement',
            event_label: projectTitle,
            project_id: projectId,
        });
    }
};

/**
 * Track contact attempt
 */
export const trackContactAttempt = (method: 'email' | 'phone' | 'linkedin' | 'github' | 'other') => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'contact_attempt', {
            event_category: 'conversion',
            event_label: `Contact via ${method}`,
            contact_method: method,
        });
    }
};

/**
 * Track email copy
 */
export const trackEmailCopy = (email: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'copy_email', {
            event_category: 'engagement',
            event_label: 'Email copied to clipboard',
        });
    }
};

/**
 * Track external link click
 */
export const trackExternalLink = (url: string, linkName: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'click_external_link', {
            event_category: 'outbound',
            event_label: linkName,
            url: url,
        });
    }
};

/**
 * Track social media click
 */
export const trackSocialClick = (platform: string, url: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'social_click', {
            event_category: 'social',
            event_label: platform,
            url: url,
        });
    }
};

/**
 * Track file download (generic)
 */
export const trackFileDownload = (fileName: string, fileType: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'file_download', {
            event_category: 'downloads',
            event_label: fileName,
            file_type: fileType,
        });
    }
};

/**
 * Track form submission
 */
export const trackFormSubmission = (formName: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'form_submission', {
            event_category: 'conversion',
            event_label: formName,
        });
    }
};

/**
 * Track search (if you have a search feature)
 */
export const trackSearch = (searchTerm: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'search', {
            event_category: 'engagement',
            search_term: searchTerm,
        });
    }
};

/**
 * Track time on page (call this when user leaves)
 */
export const trackTimeOnPage = (pageName: string, seconds: number) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'time_on_page', {
            event_category: 'engagement',
            event_label: pageName,
            value: seconds,
        });
    }
};

