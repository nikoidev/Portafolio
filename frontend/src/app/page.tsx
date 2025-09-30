import { Navbar } from '@/components/layout/Navbar';
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
      </main>
      <Footer />
    </>
  );
}
