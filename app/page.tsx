import { Metadata } from 'next';
import { WebsiteNavbar } from '@/components/website/navbar';
import { WebsiteHero } from '@/components/website/hero-section';
import { WebsiteFeatures } from '@/components/website/features-grid';
import { WebsiteShowcase } from '@/components/website/product-showcase';
import { WebsitePricing } from '@/components/website/pricing-section';
import { WebsiteTestimonials } from '@/components/website/testimonials-section';
import { WebsiteFAQ } from '@/components/website/faq-section';
import { WebsiteCTA } from '@/components/website/cta-banner';
import { WebsiteFooter } from '@/components/website/footer';

export const metadata: Metadata = {
  title: 'Strata — Engineering & Revenue Operations Platform',
  description:
    'Real-time financial analytics, Kanban sprint delivery, fine-grained RBAC permissions, and automated invoicing in a unified workspace.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-indigo-500/20 selection:text-indigo-600">
      <WebsiteNavbar />
      <main className="flex-1">
        <WebsiteHero />
        <WebsiteFeatures />
        <WebsiteShowcase />
        <WebsitePricing />
        <WebsiteTestimonials />
        <WebsiteFAQ />
        <WebsiteCTA />
      </main>
      <WebsiteFooter />
    </div>
  );
}
