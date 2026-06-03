import type { VerticalContent } from '@jaostudio/engine/types'

export const legal: VerticalContent = {
  slug: 'legal',
  name: 'Legal',
  tagline: 'Experienced Advocacy. Personal Attention.',
  description: 'Full-service law firm serving individuals and businesses.',
  theme: { primary: 'violet', accent: 'indigo' },
  sections: [
    {
      type: 'hero',
      data: {
        title: 'Legal Counsel You Can Trust',
        subtitle: 'Decades of combined experience across corporate, family, and criminal law.',
        cta: { label: 'Free Consultation', href: '/legal/consult' },
        secondaryCta: { label: 'Practice Areas', href: '/legal/practice-areas' },
      },
    },
    {
      type: 'proof',
      data: {
        headline: 'Track record',
        items: [
          { value: '5,000+', label: 'Cases Handled' },
          { value: '95%', label: 'Client Satisfaction' },
          { value: '40+', label: 'Years Combined Experience' },
        ],
      },
    },
    {
      type: 'services',
      data: {
        headline: 'Practice Areas',
        items: [
          { title: 'Business Law', description: 'Entity formation, contracts, mergers, acquisitions, and corporate governance.' },
          { title: 'Family Law', description: 'Divorce, child custody, adoption, and mediation services.' },
          { title: 'Criminal Defense', description: 'Misdemeanor and felony defense, DUI, and appeals.' },
          { title: 'Estate Planning', description: 'Wills, trusts, probate, and power of attorney documentation.' },
          { title: 'Real Estate Law', description: 'Title review, closing, landlord-tenant disputes, and zoning.' },
          { title: 'Intellectual Property', description: 'Trademark registration, copyright, licensing, and IP litigation.' },
        ],
      },
    },
    {
      type: 'case-studies',
      data: {
        headline: 'Notable Cases',
        studies: [
          {
            title: 'Multi-Million Dollar Contract Dispute',
            challenge: 'A medium-sized manufacturer was locked in a breach of contract dispute with a key supplier, threatening operations.',
            solution: 'We negotiated a confidential settlement that included revised payment terms and a continued supply agreement.',
            outcome: 'Client avoided litigation costs, maintained their supply chain, and secured favorable payment terms.',
          },
        ],
      },
    },
    {
      type: 'testimonials',
      data: {
        headline: 'Client Feedback',
        items: [
          { quote: 'They made a difficult divorce process manageable. Compassionate and sharp.', author: 'Jennifer A.', role: 'Client', company: '' },
          { quote: 'Saved my business with a well-structured partnership agreement.', author: 'Marcus W.', role: 'Small Business Owner', company: '' },
          { quote: 'Aggressive defense got my charges reduced. I\'m forever grateful.', author: 'Carlos D.', role: 'Client', company: '' },
        ],
      },
    },
    {
      type: 'process',
      data: {
        headline: 'Our Approach',
        steps: [
          { title: 'Initial Consultation', description: 'Free 30-minute call to understand your situation and discuss options.' },
          { title: 'Case Strategy', description: 'We develop a tailored legal strategy with clear timelines and fee structures.' },
          { title: 'Representation', description: 'Diligent advocacy, regular updates, and responsive communication throughout.' },
          { title: 'Resolution', description: 'We pursue the best outcome — whether through negotiation, mediation, or trial.' },
        ],
      },
    },
    {
      type: 'contact',
      data: {
        headline: 'Speak With an Attorney Today',
        subtitle: 'Initial consultations are always free and confidential.',
        cta: 'Schedule a Consultation',
        email: 'counsel@jaostudio.com',
        phone: '(555) 678-9012',
      },
    },
  ],
}
