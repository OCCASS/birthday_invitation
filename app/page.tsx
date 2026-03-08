import type { Metadata } from 'next'
import InvitationClient from '@/components/InvitationClient'

interface PageProps {
  searchParams: Promise<{ name?: string }>
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { name } = await searchParams
  const guest = name ? decodeURIComponent(name).trim() : ''

  const title = guest
    ? `${guest} — приглашение на Sofia's день рождения`
    : `Приглашение на Sofia's день рождения`

  const description = guest
    ? `${guest}, тебя ждёт особенный вечер у моря 🩵`
    : 'Особенный вечер у моря — приглашение на день рождения'

  const ogImage = `/api/og${guest ? `?name=${encodeURIComponent(guest)}` : ''}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Page({ searchParams }: PageProps) {
  const { name } = await searchParams
  const guest = name ? decodeURIComponent(name).trim() : ''
  return <InvitationClient name={guest} />
}
