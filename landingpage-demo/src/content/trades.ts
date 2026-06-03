import type { VerticalContent } from '@jaostudio/engine/types'

export const trades: VerticalContent = {
  slug: 'trades',
  name: 'Trades',
  tagline: 'Licensed. Insured. Reliable.',
  description: 'Skilled trade services — electrical, plumbing, HVAC, and more.',
  theme: { primary: 'orange', accent: 'amber' },
  sections: [
    {
      type: 'hero',
      data: {
        title: 'Expert Tradespeople When You Need Them Most',
        subtitle: '24/7 emergency service, upfront pricing, and work backed by a 100% satisfaction guarantee.',
        cta: { label: 'Book a Service', href: '/trades/book' },
        secondaryCta: { label: 'Emergency? Call Now', href: 'tel:+15555678901' },
      },
    },
    {
      type: 'proof',
      data: {
        headline: 'Why homeowners choose us',
        items: [
          { value: '10K+', label: 'Jobs Completed' },
          { value: '4.8', label: 'Average Rating' },
          { value: '60 min', label: 'Average Response Time' },
        ],
      },
    },
    {
      type: 'services',
      data: {
        headline: 'Our Trade Services',
        items: [
          { title: 'Electrical', description: 'Wiring, panel upgrades, lighting installation, and troubleshooting.' },
          { title: 'Plumbing', description: 'Pipe repair, drain cleaning, water heaters, and fixture installation.' },
          { title: 'HVAC', description: 'Installation, maintenance, and repair of heating and cooling systems.' },
          { title: 'Carpentry', description: 'Custom shelving, trim work, door installation, and framing.' },
          { title: 'Painting', description: 'Interior and exterior painting, staining, and drywall repair.' },
          { title: 'Handyman', description: 'Minor repairs, assembly, and general home maintenance.' },
        ],
      },
    },
    {
      type: 'testimonials',
      data: {
        headline: 'What Our Customers Say',
        items: [
          { quote: 'They fixed a burst pipe on Christmas Eve. I can\'t thank them enough.', author: 'Patricia M.', role: 'Homeowner', company: '' },
          { quote: 'Fair price, showed up on time, and cleaned up after themselves. Rare these days.', author: 'Tom S.', role: 'Homeowner', company: '' },
          { quote: 'Rewired our entire 1920s house. The work is beautiful and fully up to code.', author: 'Lisa & Rob T.', role: 'Homeowners', company: '' },
        ],
      },
    },
    {
      type: 'process',
      data: {
        headline: 'How It Works',
        steps: [
          { title: 'Describe the Issue', description: 'Tell us what needs fixing — text, call, or book online.' },
          { title: 'Get a Quote', description: 'We provide upfront pricing before any work begins.' },
          { title: 'We Fix It', description: 'Licensed tech arrives on schedule with all necessary parts.' },
          { title: 'Enjoy Peace of Mind', description: 'All work comes with a satisfaction guarantee and warranty.' },
        ],
      },
    },
    {
      type: 'contact',
      data: {
        headline: 'Need a Pro?',
        subtitle: 'Same-day service available in most areas. No after-hours markup.',
        cta: 'Book a Service',
        email: 'fixit@jaostudio.com',
        phone: '(555) 567-8901',
      },
    },
  ],
}
