import {
  HeroSection,
  StatsBar,
  OverviewSection,
  CategoriesSection,
  BefragungSection,
  DistributionChart,
  TechnicalSection,
  ToneMethodologySection,
  GenderAnalysisSection,
  ZwischenrufeSection,
  SignatureWordsSection,
  SpeakerWrappedSection,
  LimitationsSection,
  DocFooter,
} from './dokumentation';
import { SEO } from '@/components/seo/SEO';
import { PAGE_META } from '@/components/seo/constants';

export function DokumentationPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Bundestag Wrapped 2025 - Methodik und Dokumentation',
    description: PAGE_META.documentation.description,
    author: {
      '@type': 'Person',
      name: 'Moritz Wachter',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bundestag Wrapped',
    },
    inLanguage: 'de-DE',
  };

  return (
    <>
      <SEO
        title={PAGE_META.documentation.title}
        description={PAGE_META.documentation.description}
        canonicalUrl="/dokumentation"
        structuredData={articleSchema}
      />
      <div className="min-h-screen bg-[#fafaf9] pt-14">
      <HeroSection />
      <StatsBar />
      <OverviewSection />
      <CategoriesSection />
      <BefragungSection />
      <DistributionChart />
      <TechnicalSection />
      <ToneMethodologySection />
      <GenderAnalysisSection />
      <ZwischenrufeSection />
      <SignatureWordsSection />
      <SpeakerWrappedSection />
      <LimitationsSection />
      <DocFooter />
      </div>
    </>
  );
}
