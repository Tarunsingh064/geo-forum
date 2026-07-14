import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { InfoSection } from '@/components/sections/InfoSection';
import { BackedBySection } from '@/components/sections/BackedBySection';
//import { UseCasesSection } from '@/components/sections/UseCasesSection';
import {AboutSection} from '@/components/sections/about';
import {UseCasesSection} from '@/components/sections/usecase';

export default function HomePage() {
  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden relative">
        <Navbar />
        <HeroSection />
      </div>
      
      <InfoSection />
      <BackedBySection />
      
      <AboutSection />
      <UseCasesSection />
    </>
  );
}