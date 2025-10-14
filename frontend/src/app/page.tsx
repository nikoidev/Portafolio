import { Navbar } from '@/components/layout/Navbar';
import { DynamicCMSSections } from '@/components/public/DynamicCMSSections';
import { FeaturedProjects } from '@/components/public/FeaturedProjects';
import { HeroSection } from '@/components/public/HeroSection';
import { Footer } from '@/components/shared/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProjects />
        {/* Secciones dinámicas desde el CMS (Roadmap, CTAs, etc.) */}
        <DynamicCMSSections pageKey="home" />
      </main>
      <Footer />
    </>
  );
}
