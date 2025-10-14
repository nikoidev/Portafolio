/**
 * Plantillas predefinidas para el CMS
 */

export type FieldType = 'text' | 'textarea' | 'number' | 'url' | 'email' | 'array' | 'object';

export interface TemplateField {
    key: string;
    label: string;
    type: FieldType;
    defaultValue: any;
    placeholder?: string;
    description?: string;
}

export interface SectionTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'hero' | 'content' | 'list' | 'media' | 'cta' | 'custom';
    fields: TemplateField[];
}

// Plantillas predefinidas
export const SECTION_TEMPLATES: SectionTemplate[] = [
    {
        id: 'hero-simple',
        name: 'Hero Simple',
        description: 'Sección principal con título, descripción y botones',
        icon: '🎯',
        category: 'hero',
        fields: [
            { key: 'title', label: 'Título', type: 'text', defaultValue: '', placeholder: 'Tu título aquí' },
            { key: 'subtitle', label: 'Subtítulo', type: 'text', defaultValue: '', placeholder: 'Tu subtítulo aquí' },
            { key: 'description', label: 'Descripción', type: 'textarea', defaultValue: '', placeholder: 'Descripción detallada' },
            { key: 'button_text', label: 'Texto del Botón', type: 'text', defaultValue: 'Saber más', placeholder: 'Texto del botón' },
            { key: 'button_url', label: 'URL del Botón', type: 'url', defaultValue: '#', placeholder: '/ruta-o-url' },
        ]
    },
    {
        id: 'text-simple',
        name: 'Texto Simple',
        description: 'Sección de texto con título y contenido',
        icon: '📝',
        category: 'content',
        fields: [
            { key: 'title', label: 'Título', type: 'text', defaultValue: '', placeholder: 'Título de la sección' },
            { key: 'content', label: 'Contenido', type: 'textarea', defaultValue: '', placeholder: 'Escribe tu contenido aquí...' },
        ]
    },
    {
        id: 'list-with-icons',
        name: 'Lista con Iconos',
        description: 'Lista de elementos con iconos, texto y enlaces',
        icon: '📋',
        category: 'list',
        fields: [
            { key: 'title', label: 'Título', type: 'text', defaultValue: '', placeholder: 'Título de la lista' },
            {
                key: 'items', label: 'Elementos', type: 'array', defaultValue: [
                    { text: 'Elemento 1', url: '#', icon: '' }
                ], description: 'Lista de elementos con texto, URL e icono'
            },
        ]
    },
    {
        id: 'image-gallery',
        name: 'Galería de Imágenes',
        description: 'Galería de imágenes con títulos y descripciones',
        icon: '🖼️',
        category: 'media',
        fields: [
            { key: 'title', label: 'Título', type: 'text', defaultValue: '', placeholder: 'Título de la galería' },
            {
                key: 'images', label: 'Imágenes', type: 'array', defaultValue: [
                    { url: '', alt: '', title: '', description: '' }
                ], description: 'Lista de imágenes con URL, alt text, título y descripción'
            },
        ]
    },
    {
        id: 'testimonials',
        name: 'Testimonios',
        description: 'Sección de testimonios o reseñas',
        icon: '💬',
        category: 'content',
        fields: [
            { key: 'title', label: 'Título', type: 'text', defaultValue: 'Testimonios', placeholder: 'Título de la sección' },
            {
                key: 'testimonials', label: 'Testimonios', type: 'array', defaultValue: [
                    { name: '', role: '', company: '', message: '', avatar: '' }
                ], description: 'Lista de testimonios con nombre, rol, empresa, mensaje y avatar'
            },
        ]
    },
    {
        id: 'cta-section',
        name: 'Call to Action',
        description: 'Sección de llamada a la acción',
        icon: '🎬',
        category: 'cta',
        fields: [
            { key: 'title', label: 'Título', type: 'text', defaultValue: '', placeholder: '¿Listo para empezar?' },
            { key: 'description', label: 'Descripción', type: 'textarea', defaultValue: '', placeholder: 'Descripción motivadora' },
            { key: 'primary_button_text', label: 'Botón Principal', type: 'text', defaultValue: 'Comenzar', placeholder: 'Texto del botón' },
            { key: 'primary_button_url', label: 'URL Botón Principal', type: 'url', defaultValue: '#', placeholder: '/ruta' },
            { key: 'secondary_button_text', label: 'Botón Secundario (opcional)', type: 'text', defaultValue: '', placeholder: 'Texto del botón' },
            { key: 'secondary_button_url', label: 'URL Botón Secundario', type: 'url', defaultValue: '', placeholder: '/ruta' },
        ]
    },
    {
        id: 'stats-section',
        name: 'Estadísticas',
        description: 'Sección con números y estadísticas',
        icon: '📊',
        category: 'content',
        fields: [
            { key: 'title', label: 'Título', type: 'text', defaultValue: '', placeholder: 'Nuestros Números' },
            {
                key: 'stats', label: 'Estadísticas', type: 'array', defaultValue: [
                    { label: 'Proyectos', value: '50+', icon: '' }
                ], description: 'Lista de estadísticas con etiqueta, valor e icono'
            },
        ]
    },
    {
        id: 'roadmap',
        name: 'Roadmap de Skills',
        description: 'Tu trayectoria de aprendizaje con categorías y habilidades',
        icon: '🚀',
        category: 'content',
        fields: [
            { key: 'title', label: 'Título', type: 'text', defaultValue: 'Mi Trayectoria de Aprendizaje', placeholder: 'Título del roadmap' },
            { key: 'description', label: 'Descripción', type: 'textarea', defaultValue: 'Un vistazo a las tecnologías que domino, las que estoy aprendiendo y mis próximos objetivos', placeholder: 'Descripción del roadmap' },
            {
                key: 'categories', label: 'Categorías de Skills', type: 'array', defaultValue: [
                    {
                        name: 'Frontend',
                        icon: '💻',
                        description: 'Tecnologías de interfaz de usuario',
                        skills: [
                            { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', proficiency: 85, status: 'completed' },
                            { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', proficiency: 70, status: 'learning' }
                        ]
                    }
                ], description: 'Categorías con sus skills. Status: completed (✅), learning (🔥), planned (🎯)'
            },
        ]
    },
    {
        id: 'custom',
        name: 'Personalizado',
        description: 'Crea una sección desde cero con campos personalizados',
        icon: '⚙️',
        category: 'custom',
        fields: []
    }
];

// Obtener template por ID
export function getTemplateById(id: string): SectionTemplate | undefined {
    return SECTION_TEMPLATES.find(t => t.id === id);
}

// Obtener templates por categoría
export function getTemplatesByCategory(category: SectionTemplate['category']): SectionTemplate[] {
    return SECTION_TEMPLATES.filter(t => t.category === category);
}

