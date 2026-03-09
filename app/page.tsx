import InvitationClient from '@/components/InvitationClient'

export const dynamic = 'force-dynamic'

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3002'
}

interface PageProps {
  searchParams: Promise<{ name?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { name } = await searchParams
  const guest = name ? decodeURIComponent(name).trim() : ''

  const title = guest
    ? `${guest} — приглашение на Sofia's день рождения`
    : `Приглашение на Sofia's день рождения`

  const description = guest
    ? `${guest}, тебя ждёт особенный вечер у моря 🩵`
    : 'Особенный вечер у моря — приглашение на день рождения'

  const base = getBaseUrl()
  const ogImage = `${base}/api/og${guest ? `?name=${encodeURIComponent(guest)}` : ''}`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <InvitationClient name={guest} />
    </>
  )
}
