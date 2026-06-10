import { getLang } from '@/lib/lang'

export const dynamic = 'force-dynamic'

export default async function TermsPage() {
  const lang = await getLang()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-[var(--font-display)] text-3xl font-bold">
        {lang === 'tl' ? 'Mga Tuntunin ng Paggamit' : 'Terms of Service'}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {lang === 'tl' ? 'Huling na-update: Hunyo 2026' : 'Last updated: June 2026'}
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            {lang === 'tl' ? 'Pagkilala' : 'Acknowledgment'}
          </h2>
          <p>
            {lang === 'tl'
              ? 'Sa paggamit ng website na ito, kinikilala mo na ito ay isang demo lamang. Walang tunay na produkto ang ibinebenta, walang tunay na pagbabayad ang kinokolekta, at walang tunay na transaksyon ang nagaganap.'
              : 'By using this website, you acknowledge that it is a demo only. No real products are sold, no real payments are collected, and no real transactions occur.'}
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            {lang === 'tl' ? 'Pag-aari ng Intelektwal' : 'Intellectual Property'}
          </h2>
          <p>
            {lang === 'tl'
              ? 'Ang mga pangalan ng produkto at tatak na ipinapakita sa website na ito ay pag-aari ng kani-kanilang mga may-ari. Ginagamit lamang ang mga ito para sa demonstrasyon. Ang Sari-Sari ay hindi kaakibat ng anumang tatak na ipinapakita.'
              : 'Product names and brands displayed on this website are the property of their respective owners. They are used for demonstration purposes only. Sari-Sari is not affiliated with any brand shown.'}
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            {lang === 'tl' ? 'Limitasyon ng Pananagutan' : 'Limitation of Liability'}
          </h2>
          <p>
            {lang === 'tl'
              ? 'Ang Sari-Sari ay hindi mananagot sa anumang pinsala na dulot ng paggamit ng website na ito. Ito ay isang demo lamang at walang warranty, tahasan o ipinahiwatig.'
              : 'Sari-Sari shall not be liable for any damages arising from the use of this website. It is a demo only and is provided without warranty, express or implied.'}
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            {lang === 'tl' ? 'Pag-reset ng Datos' : 'Data Reset'}
          </h2>
          <p>
            {lang === 'tl'
              ? 'Ang lahat ng datos sa website na ito ay nire-reset pana-panahon. Ang anumang account na gagawin mo ay maaaring tanggalin nang walang abiso. Huwag maglagay ng tunay o sensitibong impormasyon.'
              : 'All data on this website is reset periodically. Any account you create may be deleted without notice. Do not enter real or sensitive information.'}
          </p>
        </section>
      </div>
    </div>
  )
}
