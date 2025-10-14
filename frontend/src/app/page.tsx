import { Navbar } from '@/components/layout/Navbar';
import { DynamicCMSSections } from '@/components/public/DynamicCMSSections';
import { Footer } from '@/components/shared/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Todas las secciones (hero, featured_projects, roadmap, etc.) ahora se gestionan desde el CMS */}
        <DynamicCMSSections pageKey="home" />
      </main>
      <Footer />
    </>
  );
}
