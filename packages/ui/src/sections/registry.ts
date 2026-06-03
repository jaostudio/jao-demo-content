import { HeroSection } from './hero'
import { ProofSection } from './proof'
import { ServicesSection } from './services'
import { CaseStudiesSection } from './case-studies'
import { TestimonialsSection } from './testimonials'
import { ProcessSection } from './process'
import { ContactSection } from './contact'

export const defaultSectionComponents = {
  hero: HeroSection,
  proof: ProofSection,
  services: ServicesSection,
  'case-studies': CaseStudiesSection,
  testimonials: TestimonialsSection,
  process: ProcessSection,
  contact: ContactSection,
} as const
