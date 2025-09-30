import type { Metadata } from 'next';
import ContactClient from '@/components/pages/ContactClient';

export const metadata: Metadata = {
  title: 'Contacto',
  description: '¿Tienes un proyecto en mente? ¿Quieres colaborar? Contacta conmigo a través del formulario o mis redes sociales. Respondo en 24-48 horas.',
  openGraph: {
    title: 'Contacto | Portfolio Personal',
    description: '¿Tienes un proyecto en mente? ¿Quieres colaborar? Contacta conmigo y hablemos de tu próximo proyecto.',
  },
};

export default function ContactPage() {
    return <ContactClient />;
}

