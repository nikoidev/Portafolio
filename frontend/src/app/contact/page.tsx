import { Navbar } from '@/components/layout/Navbar';
import ContactClient from '@/components/pages/ContactClient';
import { Footer } from '@/components/shared/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description: '¿Tienes un proyecto en mente? ¿Quieres colaborar? Contacta conmigo a través del formulario o mis redes sociales. Respondo en 24-48 horas.',
  openGraph: {
    title: 'Contacto | Portfolio Personal',
    description: '¿Tienes un proyecto en mente? ¿Quieres colaborar? Contacta conmigo y hablemos de tu próximo proyecto.',
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

