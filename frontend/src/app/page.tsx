import { FeaturedProjects } from '@/components/public/FeaturedProjects';
import { HeroSection } from '@/components/public/HeroSection';
import { Footer } from '@/components/shared/Footer';
import { Header } from '@/components/shared/Header';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedProjects />
      </main>
      <Footer />
    </>
  );
}
