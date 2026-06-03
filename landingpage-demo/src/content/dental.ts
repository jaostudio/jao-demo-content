import type { VerticalContent } from '@jaostudio/engine/types'

export const dental: VerticalContent = {
  slug: 'dental',
  name: 'Dental',
  tagline: 'Your Smile, Our Priority.',
  description: 'Gentle, modern dentistry for the whole family.',
  theme: { primary: 'cyan', accent: 'sky' },
  sections: [
    {
      type: 'hero',
      data: {
        title: 'Comprehensive Dental Care in a Comfortable Setting',
        subtitle: 'From routine cleanings to full-mouth restoration — same-day appointments available.',
        cta: { label: 'Book an Appointment', href: '/dental/book' },
        secondaryCta: { label: 'Our Services', href: '/dental/services' },
      },
    },
    {
      type: 'proof',
      data: {
        headline: 'Trusted by the community',
        items: [
          { value: '5,000+', label: 'Patients Served' },
          { value: '4.9', label: 'Star Rating' },
          { value: '15 min', label: 'Average Wait Time' },
        ],
      },
    },
    {
      type: 'services',
      data: {
        headline: 'Full-Service Dentistry',
        items: [
          { title: 'Preventive Care', description: 'Cleanings, exams, fluoride treatments, and sealants for all ages.' },
          { title: 'Restorative Dentistry', description: 'Fillings, crowns, bridges, implants, and dentures.' },
          { title: 'Cosmetic Dentistry', description: 'Teeth whitening, veneers, bonding, and smile makeovers.' },
          { title: 'Orthodontics', description: 'Invisalign clear aligners and traditional braces for teens and adults.' },
          { title: 'Periodontics', description: 'Gum disease treatment, scaling and root planing, and laser therapy.' },
          { title: 'Emergency Care', description: 'Same-day emergency appointments for toothaches, fractures, and trauma.' },
        ],
      },
    },
    {
      type: 'testimonials',
      data: {
        headline: 'Patient Stories',
        items: [
          { quote: 'I used to dread the dentist. Now I actually look forward to my cleanings.', author: 'James K.', role: 'Patient', company: '' },
          { quote: 'They stayed open late to see my son after a sports accident. Exceptional care.', author: 'Maria G.', role: 'Parent', company: '' },
          { quote: 'My Invisalign results are incredible. The team made the whole process easy.', author: 'David L.', role: 'Patient', company: '' },
        ],
      },
    },
    {
      type: 'process',
      data: {
        headline: 'Your First Visit',
        steps: [
          { title: 'Check-In', description: 'Complete our online intake form from your phone before you arrive.' },
          { title: 'Exam & X-Rays', description: 'Comprehensive exam, digital X-rays, and oral cancer screening.' },
          { title: 'Treatment Plan', description: 'We review findings, discuss options, and provide a clear cost estimate.' },
          { title: 'Care', description: 'Same-day treatment when possible, or schedule your next appointment.' },
        ],
      },
    },
    {
      type: 'contact',
      data: {
        headline: 'Schedule Your Visit',
        subtitle: 'New patients welcome. Most insurance plans accepted.',
        cta: 'Book Online',
        email: 'smiles@jaostudio.com',
        phone: '(555) 345-6789',
      },
    },
  ],
}
