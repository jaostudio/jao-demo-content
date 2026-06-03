import type { VerticalContent } from '@jaostudio/engine/types'

export const realEstate: VerticalContent = {
  slug: 'real-estate',
  name: 'Real Estate',
  tagline: 'Find Your Next Chapter.',
  description: 'Residential and commercial real estate services with local expertise.',
  theme: { primary: 'emerald', accent: 'teal' },
  sections: [
    {
      type: 'hero',
      data: {
        title: 'Your Dream Property Is Closer Than You Think',
        subtitle: 'Exclusive listings, market insights, and a team that knows every neighborhood.',
        cta: { label: 'Search Listings', href: '/real-estate/listings' },
        secondaryCta: { label: 'Sell Your Home', href: '/real-estate/sell' },
      },
    },
    {
      type: 'proof',
      data: {
        headline: 'Local market leaders',
        items: [
          { value: '$2.5B', label: 'Total Sales Volume' },
          { value: '1,200+', label: 'Properties Sold' },
          { value: '30+', label: 'Neighborhoods Covered' },
        ],
      },
    },
    {
      type: 'services',
      data: {
        headline: 'What We Offer',
        items: [
          { title: 'Home Buying', description: 'Personalized home searches, neighborhood tours, and negotiation strategy.' },
          { title: 'Home Selling', description: 'Staging, professional photography, open houses, and closing support.' },
          { title: 'Commercial Real Estate', description: 'Office, retail, and industrial leasing, acquisition, and disposition.' },
          { title: 'Property Management', description: 'Tenant screening, maintenance, rent collection, and financial reporting.' },
          { title: 'Market Analysis', description: 'Comparative market analysis, investment projections, and trend reports.' },
          { title: 'Relocation Services', description: 'City orientation, school research, temporary housing, and moving coordination.' },
        ],
      },
    },
    {
      type: 'case-studies',
      data: {
        headline: 'Success Stories',
        studies: [
          {
            title: 'Waterfront Condo Sold in 6 Days',
            challenge: 'Seller needed to relocate cross-country within two weeks and wanted to avoid a contingency sale.',
            solution: 'Priced competitively with a targeted digital campaign, virtual tours, and private showings.',
            outcome: 'Multiple offers received; sold for $45K above asking with a 14-day close.',
          },
        ],
      },
    },
    {
      type: 'process',
      data: {
        headline: 'The Buying Process',
        steps: [
          { title: 'Consultation', description: 'We learn your needs, budget, and timeline to refine your search.' },
          { title: 'Search & Tour', description: 'Curated listings, private showings, and neighborhood walkthroughs.' },
          { title: 'Offer & Negotiate', description: 'Data-backed offer strategy and skilled negotiation on your behalf.' },
          { title: 'Close & Move', description: 'Escrow coordination, inspection, and keys in hand on schedule.' },
        ],
      },
    },
    {
      type: 'contact',
      data: {
        headline: 'Let\'s Find Your Perfect Property',
        subtitle: 'Free consultation with no obligation. We\'ll craft a personalized search plan.',
        cta: 'Schedule a Call',
        email: 'homes@jaostudio.com',
        phone: '(555) 456-7890',
      },
    },
  ],
}
