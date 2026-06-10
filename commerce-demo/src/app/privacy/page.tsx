import { getLang } from '@/lib/lang'

export const dynamic = 'force-dynamic'

export default async function PrivacyPage() {
  const lang = await getLang()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-[var(--font-display)] text-3xl font-bold">
        {lang === 'tl' ? 'Patakaran sa Pribasidad' : 'Privacy Policy'}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {lang === 'tl' ? 'Huling na-update: Hunyo 2026' : 'Last updated: June 2026'}
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            {lang === 'tl' ? 'Panimula' : 'Introduction'}
          </h2>
          <p>
            {lang === 'tl'
              ? 'Ang Sari-Sari ay isang demo website. Hindi kami nangongolekta, nag-iimbak, o nagpoproseso ng anumang personal na datos mula sa mga gumagamit. Lahat ng account, order, at impormasyon ay kathang-isip lamang at nire-reset pana-panahon.'
              : 'Sari-Sari is a demo website. We do not collect, store, or process any personal data from users. All accounts, orders, and information are fictional and reset periodically.'}
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            {lang === 'tl' ? 'Anong Datos ang Kinokolekta Namin' : 'What Data We Collect'}
          </h2>
          <p>
            {lang === 'tl'
              ? 'Wala. Ang website na ito ay purong demonstrasyon. Ang anumang email, password, o impormasyong inilagay mo ay gawa-gawa lamang at hindi ginagamit sa tunay na mundo.'
              : 'None. This website is purely demonstrational. Any email, password, or information you enter is fictional and not used in the real world.'}
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            {lang === 'tl' ? 'Mga Third-Party na Serbisyo' : 'Third-Party Services'}
          </h2>
          <p>
            {lang === 'tl'
              ? 'Gumagamit ang Sari-Sari ng Turso para sa database at Vercel para sa hosting. Ang mga serbisyong ito ay maaaring may kani-kaniyang patakaran sa pribasidad. Walang tunay na datos ng gumagamit ang ibinabahagi.'
              : 'Sari-Sari uses Turso for database hosting and Vercel for deployment. These services may have their own privacy policies. No real user data is shared.'}
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            {lang === 'tl' ? 'Pakikipag-ugnayan' : 'Contact'}
          </h2>
          <p>
            {lang === 'tl'
              ? 'Ito ay isang demo lamang. Kung may tanong ka, maaari kang makipag-ugnayan sa pamamagitan ng chat bubble sa website.'
              : 'This is a demo only. If you have questions, you can reach out via the chat bubble on the website.'}
          </p>
        </section>
      </div>
    </div>
  )
}
