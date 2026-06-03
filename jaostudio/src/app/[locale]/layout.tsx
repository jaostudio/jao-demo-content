export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'tl' }]
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
