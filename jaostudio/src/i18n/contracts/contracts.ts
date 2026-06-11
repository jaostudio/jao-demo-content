export interface NavbarContract {
  work: string
  services: string
  process: string
  studio: string
  cta: string
  toggleMenu: string
  closeMenu: string
  themeDark: string
  themeLight: string
}

export interface HeroContract {
  badge: string
  headline: string
  subtitle: string
  availability: string
  ctaPrimary: string
  ctaSecondary: string
  systemTopology: string
  live: string
  metaTitle: string
  metaDescription: string
  notForEveryoneBadge: string
  notForEveryoneDetail: string
}

export interface FooterContract {
  brand: string
  tagline: string
  contact: string
  github: string
  linkedin: string
  credit: string
}

export interface ProjectsContract {
  badge: string
  heading: string
  description: string
  pageHeading: string
  pageDescription: string
}

export interface CapabilitiesContract {
  badge: string
  heading: string
  description: string
  card1Title: string
  card1Desc: string
  card2Title: string
  card2Desc: string
  card3Title: string
  card3Desc: string
  card4Title: string
  card4Desc: string
}

export interface ProcessContract {
  badge: string
  heading: string
  description: string
  step1Name: string
  step1Summary: string
  step1Detail: string
  step2Name: string
  step2Summary: string
  step2Detail: string
  step3Name: string
  step3Summary: string
  step3Detail: string
  step4Name: string
  step4Summary: string
  step4Detail: string
  step5Name: string
  step5Summary: string
  step5Detail: string
  cta: string
}

export interface TechContract {
  badge: string
  heading: string
  badge2: string
  heading2: string
  description: string
  pipeline1: string
  pipeline2: string
  pipeline3: string
  pipeline4: string
  pipeline5: string
  timeline: string
  bullet1: string
  bullet2: string
  bullet3: string
  bullet4: string
  bullet5: string
  bullet6: string
}

export interface ContactContract {
  badge: string
  heading: string
  description: string
  business: string
  projectType: string
  select: string
  selectOther: string
  specifyLabel: string
  specifyPlaceholder: string
  budget: string
  timeline: string
  priority: string
  source: string
  goal: string
  message: string
  cta: string
  ctaSending: string
  thanks: string
  thanksDesc: string
  browseProjects: string
  budgetRanges: string[]
  timelines: string[]
  priorities: string[]
  sources: Record<string, string>
  responseTitle1: string
  responseDesc1: string
  responseTitle2: string
  responseDesc2: string
  responseTitle3: string
  responseDesc3: string
  errorProjectType: string
  errorBudget: string
  errorTimeline: string
  errorPriority: string
  errorSource: string
  errorOther: string
  errorSubmit: string
  placeholderGoal: string
  placeholderMessage: string
  skeletonBadge: string
  skeletonHeading: string
}

export interface StudioContract {
  badge: string
  heading: string
  description: string
  principle1Label: string
  principle1Implication: string
  principle1Outcome: string
  principle2Label: string
  principle2Implication: string
  principle2Outcome: string
  principle3Label: string
  principle3Implication: string
  principle3Outcome: string
  principle4Label: string
  principle4Implication: string
  principle4Outcome: string
  principle5Label: string
  principle5Implication: string
  principle5Outcome: string
  principle6Label: string
  principle6Implication: string
  principle6Outcome: string
  cta: string
  metaTitle: string
  metaDescription: string
}

export interface ServicesContract {
  heroBadge: string
  heroTitle: string
  heroDesc: string
  stage1: string
  stage1Timeline: string
  stage1Output: string
  stage1Input: string
  stage2: string
  stage2Timeline: string
  stage2Output: string
  stage2Input: string
  stage3: string
  stage3Timeline: string
  stage3Output: string
  stage3Input: string
  stage4: string
  stage4Timeline: string
  stage4Output: string
  stage4Input: string
  stage5: string
  stage5Timeline: string
  stage5Output: string
  stage5Input: string
  model1Title: string
  model1Desc: string
  model2Title: string
  model2Desc: string
  model3Title: string
  model3Desc: string
  model4Title: string
  model4Desc: string
  processBadge: string
  deliveryStages: string
  engagementBadge: string
  engagementModel: string
  workingStyle: string
  candidBadge: string
  candidNote: string
  service1Title: string
  service1Desc: string
  service2Title: string
  service2Desc: string
  service3Title: string
  service3Desc: string
  service4Title: string
  service4Desc: string
  exampleScopes: string
  exampleScopesBadge: string
  example1Title: string
  example1Timeline: string
  example1Scope: string
  example2Title: string
  example2Timeline: string
  example2Scope: string
  example3Title: string
  example3Timeline: string
  example3Scope: string
  availabilityBadge: string
  availabilityNote: string
  availabilityIntro: string
  availabilityNote1: string
  availabilityNote2: string
  availabilityNote3: string
  output: string
  fromYou: string
  ctaSubtitle: string
  ctaButton: string
  cta: string
  metaTitle: string
  metaDescription: string
}

export interface ContactPageContract {
  heading: string
  description: string
  fitBadge: string
  fitDesc: string
  fit1: string
  fit2: string
  fit3: string
  fit4: string
  step1: string
  step2: string
  step3: string
  model1: string
  model1Desc: string
  model2: string
  model2Desc: string
  model3: string
  model3Desc: string
  model4: string
  model4Desc: string
  model5: string
  model5Desc: string
  model6: string
  model6Desc: string
  ctaDirect: string
  ctaEmail: string
  howItWorks: string
  howCollaborationWorks: string
  faq: string
  heroHeading: string
  faq1Question: string
  faq1Answer: string
  faq2Question: string
  faq2Answer: string
  faq3Question: string
  faq3Answer: string
  faq4Question: string
  faq4Answer: string
  faq5Question: string
  faq5Answer: string
}

export interface SocialProofContract {
  item1: string
  item2: string
  item3: string
  item4: string
  item5: string
  item6: string
}

export interface NotFoundContract {
  metaTitle: string
  heading: string
  description: string
  home: string
  projects: string
  contact: string
}

export interface ErrorPageContract {
  heading: string
  description: string
  retry: string
  home: string
}

export interface CommonContract {
  loading: string
  validationRequired: string
  validationInvalidEmail: string
  validationInvalidUrl: string
  fieldName: string
  fieldEmail: string
  fieldWebsite: string
  fieldMessage: string
  fieldMessageOptional: string
  fieldMessagePlaceholder: string
}

export interface CvContract {
  metaTitle: string
  metaDescription: string
  badge: string
  name: string
  role: string
  location: string
  employment: string
  technicalExpertise: string
  frontend: string
  infrastructure: string
  professional: string
  professionalSummary: string
  summary1: string
  summary2: string
  summary3: string
  projectHighlights: string
  viewProjects: string
  startProject: string
}

export interface AuditContract {
  badge: string
  heading: string
  description: string
  feature1Title: string
  feature1Desc: string
  feature2Title: string
  feature2Desc: string
  feature3Title: string
  feature3Desc: string
  feature4Title: string
  feature4Desc: string
  ctaRequest: string
  ctaSending: string
  successHeading: string
  successDesc: string
  successCta: string
  errorMessage: string
}

export interface ProjectDetailContract {
  backLink: string
  asideTimeline: string
  asideIndustry: string
  asideArchitecture: string
  asideSystemTopology: string
  asideConstraints: string
  asideKeyDecisions: string
  badgeProject: string
  badgeChallenge: string
  badgeBuilt: string
  badgeOutcome: string
  badgeInfrastructure: string
  badgeStack: string
  badgeMetrics: string
  sectionDeployment: string
  sectionBuiltWith: string
  sectionPerformance: string
  galleryEmptyTitle: string
  galleryEmptyDesc: string
  ctaViewLive: string
  ctaStartSimilar: string
  ctaStartProject: string
  ctaSimilarInterest: string
  metaRelatedProjects: string
  metricLabelLighthouse: string
  metricLabelLoadTime: string
  metricLabelSEO: string
  metricLabelResponsive: string
  metricValueYes: string
  metricLCP: string
  metricCLS: string
  metricINP: string
  metricBundle: string
  metricTTFB: string
}

export interface PlaygroundContract {
  metaTitle: string
  badge: string
  heading: string
  description: string
  demoComingSoon: string
  demo1Title: string
  demo1Description: string
  demo1Category: string
  demo2Title: string
  demo2Description: string
  demo2Category: string
  demo3Title: string
  demo3Description: string
  demo3Category: string
  demo4Title: string
  demo4Description: string
  demo4Category: string
  demo5Title: string
  demo5Description: string
  demo5Category: string
  demo6Title: string
  demo6Description: string
  demo6Category: string
  demo7Title: string
  demo7Description: string
  demo7Category: string
  demo8Title: string
  demo8Description: string
  demo8Category: string
}
