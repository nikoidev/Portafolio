import { Navbar } from '@/components/layout/Navbar';
import AboutClient from '@/components/pages/AboutClient';
import { Footer } from '@/components/shared/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Mí',
  description: 'Conoce mi historia como desarrollador full stack, mi experiencia profesional, habilidades técnicas y pasión por crear soluciones tecnológicas innovadoras.',
  openGraph: {
    title: 'Sobre Mí | Portfolio Personal',
    description: 'Conoce mi historia como desarrollador full stack, mi experiencia profesional y habilidades técnicas.',
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutClient />
      <Footer />
    </>
  );
}

