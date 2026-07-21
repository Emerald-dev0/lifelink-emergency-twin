import { Hero } from '@/components/landing/hero';
import { ProblemSection } from '@/components/landing/problem-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { TechnologySection } from '@/components/landing/technology-section';
import { SecuritySection } from '@/components/landing/security-section';
import { CTASection } from '@/components/landing/cta-section';
import { Nav } from '@/components/layout/nav';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <TechnologySection />
        <SecuritySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
