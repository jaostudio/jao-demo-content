import { getTranslations } from 'next-intl/server'

export async function ContactFAQ() {
  const t = await getTranslations('contactPage')
  const faqs = [
    { q: t('faq1Question'), a: t('faq1Answer') },
    { q: t('faq2Question'), a: t('faq2Answer') },
    { q: t('faq3Question'), a: t('faq3Answer') },
    { q: t('faq4Question'), a: t('faq4Answer') },
    { q: t('faq5Question'), a: t('faq5Answer') },
  ]

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((item) => (
        <details
          key={item.q}
          className="group rounded-xl border border-border-subtle bg-bg-surface transition-colors open:border-border-active"
        >
          <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-text-primary transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="ml-2 text-xs text-text-tertiary transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="border-t border-border-subtle px-5 pb-4 pt-3">
            <p className="text-sm leading-relaxed text-text-secondary">{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  )
}
