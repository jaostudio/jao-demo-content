import type {
  SectionData,
  HeroData,
  ProofData,
  ServiceData,
  TestimonialData,
  CaseStudyData,
  ProcessData,
  ContactData,
} from './section'

export type SectionType = SectionData["type"]

export const SectionType: { [K in SectionType]: K } = {
  hero: "hero",
  proof: "proof",
  services: "services",
  testimonials: "testimonials",
  "case-studies": "case-studies",
  process: "process",
  contact: "contact",
}

export type SiteComposition = {
  hero: HeroData
  proof: ProofData
  services: ServiceData
  testimonials?: TestimonialData
  caseStudies?: CaseStudyData
  process: ProcessData
  contact: ContactData
  heroStats?: { value: string; label: string }[]
  assets: {
    hero: string
    gallery: string[]
  }
}
