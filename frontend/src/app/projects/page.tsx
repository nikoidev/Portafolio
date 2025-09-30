import type { Metadata } from 'next';
import ProjectsClient from '@/components/pages/ProjectsClient';

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Explora mi colección de proyectos de desarrollo web, aplicaciones móviles y más. Cada proyecto representa un desafío único y una oportunidad de aprendizaje.',
  openGraph: {
    title: 'Mis Proyectos | Portfolio Personal',
    description: 'Explora mi colección de proyectos de desarrollo web, aplicaciones móviles y más.',
  },
};

export default function ProjectsPage() {
    return <ProjectsClient />;
}
