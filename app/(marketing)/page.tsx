import { MarketingNav } from '@/components/marketing/marketing-nav'
import { HeroSection } from '@/components/marketing/hero-section'
import { StatsSection } from '@/components/marketing/stats-section'
import { FeaturesSection } from '@/components/marketing/features-section'
import { PricingSection } from '@/components/marketing/pricing-section'
import { CtaSection } from '@/components/marketing/cta-section'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
      </main>
      <MarketingFooter />
    </div>
  )
}
