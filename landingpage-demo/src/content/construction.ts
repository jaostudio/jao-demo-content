import type { VerticalContent } from '@jaostudio/engine/types'

export const construction: VerticalContent = {
  slug: 'construction',
  name: 'Construction',
  tagline: 'Built to Last. Delivered on Time.',
  description: 'Premium construction services for commercial and residential projects.',
  theme: { primary: 'amber', accent: 'stone' },
  sections: [
    {
      type: 'hero',
      data: {
        title: 'Building the Future, One Project at a Time',
        subtitle: 'Over 200 completed projects across the Pacific Northwest with zero safety incidents.',
        cta: { label: 'Get a Quote', href: '/construction/contact' },
        secondaryCta: { label: 'Our Work', href: '/construction/projects' },
      },
    },
    {
      type: 'proof',
      data: {
        headline: 'By the numbers',
        items: [
          { value: '200+', label: 'Projects Completed' },
          { value: '15+', label: 'Years in Business' },
          { value: '99%', label: 'On-Time Delivery' },
        ],
      },
    },
    {
      type: 'services',
      data: {
        headline: 'What We Build',
        items: [
          { title: 'Commercial Construction', description: 'Office buildings, retail spaces, and mixed-use developments from ground up.' },
          { title: 'Residential Development', description: 'Custom homes, townhouses, and multifamily communities designed for modern living.' },
          { title: 'Renovation & Restoration', description: 'Historic restorations, tenant improvements, and structural retrofits.' },
          { title: 'Infrastructure', description: 'Roads, bridges, utilities, and site preparation for public and private sectors.' },
          { title: 'Project Management', description: 'End-to-end oversight from permitting through final inspection and handoff.' },
          { title: 'Consulting', description: 'Feasibility studies, cost estimation, and value engineering for early-stage planning.' },
        ],
      },
    },
    {
      type: 'case-studies',
      data: {
        headline: 'Featured Projects',
        studies: [
          {
            title: 'Downtown Tower Renovation',
            challenge: 'A 12-story office building needed full seismic retrofit and modern MEP systems while 40% of tenants remained operational.',
            solution: 'Phased construction with night/weekend work windows, temporary swing space, and real-time vibration monitoring.',
            outcome: 'Completed 3 weeks ahead of schedule with zero tenant complaints and LEED Gold certification.',
          },
        ],
      },
    },
    {
      type: 'testimonials',
      data: {
        headline: 'What Our Clients Say',
        items: [
          { quote: 'They delivered a 50,000 sq ft commercial build in 11 months. Unheard of in this market.', author: 'Sarah Chen', role: 'VP of Operations', company: 'Pinnacle Realty' },
          { quote: 'The level of transparency on budgets and timelines is unmatched.', author: 'Mark Rivera', role: 'Project Director', company: 'City Planning Dept' },
          { quote: 'Our historic renovation required delicate craftsmanship. They exceeded expectations.', author: 'Eleanor Hayes', role: 'Owner', company: 'Hayes Heritage Homes' },
        ],
      },
    },
    {
      type: 'process',
      data: {
        headline: 'How We Work',
        steps: [
          { title: 'Discovery', description: 'We learn your goals, site conditions, and budget to define the scope.' },
          { title: 'Design & Estimate', description: 'Architectural plans, material selection, and a fixed-price proposal.' },
          { title: 'Permitting', description: 'We handle all municipal permits, environmental reviews, and inspections.' },
          { title: 'Construction', description: 'Daily progress reports, weekly walkthroughs, and strict safety protocols.' },
          { title: 'Handoff', description: 'Final inspection, punch list resolution, and operations training for your team.' },
        ],
      },
    },
    {
      type: 'contact',
      data: {
        headline: 'Ready to Break Ground?',
        subtitle: 'Tell us about your project and we\'ll schedule a site visit within 48 hours.',
        cta: 'Request a Consultation',
        email: 'build@jaostudio.com',
        phone: '(555) 234-5678',
      },
    },
  ],
}
