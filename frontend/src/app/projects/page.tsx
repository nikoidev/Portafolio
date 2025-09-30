import { Navbar } from '@/components/layout/Navbar';
import ProjectsClient from '@/components/pages/ProjectsClient';
import { Footer } from '@/components/shared/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Explora mi colección de proyectos de desarrollo web, aplicaciones móviles y más. Cada proyecto representa un desafío único y una oportunidad de aprendizaje.',
  openGraph: {
    title: 'Mis Proyectos | Portfolio Personal',
    description: 'Explora mi colección de proyectos de desarrollo web, aplicaciones móviles y más.',
  },
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <ProjectsClient />
      <Footer />
    </>
  );
}
