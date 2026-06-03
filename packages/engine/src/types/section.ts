export interface HeroData {
  title: string
  subtitle: string
  cta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  image?: string
}

export interface ProofData {
  headline: string
  items: { value: string; label: string }[]
}

export interface ServiceData {
  headline: string
  items: { title: string; description: string; icon?: string }[]
}

export interface CaseStudyData {
  headline: string
  studies: {
    title: string
    challenge: string
    solution: string
    outcome: string
    image?: string
  }[]
}

export interface TestimonialData {
  headline: string
  items: { quote: string; author: string; role: string; company: string }[]
}

export interface ProcessData {
  headline: string
  steps: { title: string; description: string }[]
}

export interface ContactData {
  headline: string
  subtitle: string
  cta: string
  email?: string
  phone?: string
}

export type SectionData =
  | { type: 'hero'; data: HeroData }
  | { type: 'proof'; data: ProofData }
  | { type: 'services'; data: ServiceData }
  | { type: 'case-studies'; data: CaseStudyData }
  | { type: 'testimonials'; data: TestimonialData }
  | { type: 'process'; data: ProcessData }
  | { type: 'contact'; data: ContactData }

export interface VerticalContent {
  slug: string
  name: string
  tagline: string
  description: string
  theme: {
    primary: string
    accent: string
  }
  sections: SectionData[]
}
