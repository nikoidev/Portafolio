import { Navbar } from '@/components/layout/Navbar';
import ContactClient from '@/components/pages/ContactClient';
import { Footer } from '@/components/shared/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description: '¿Tienes un proyecto en mente? Contacta conmigo directamente por email, LinkedIn o GitHub. Respondo en menos de 24 horas.',
  openGraph: {
    title: 'Contacto | Portfolio Personal',
    description: 'Contacta conmigo directamente. Email, LinkedIn, GitHub y más canales de comunicación disponibles.',
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactClient />
      <Footer />
    </>
  );
}

