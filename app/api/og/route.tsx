import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

async function loadGoogleFont(font: string, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (resource) {
    const response = await fetch(resource[1])
    if (response.status === 200) return response.arrayBuffer()
  }

  throw new Error('failed to load font data')
}

function CornerOrnament() {
  return (
    <svg width="70" height="70" viewBox="0 0 70 70">
      <path d="M 4 4 L 34 4"  stroke="#6b8fa8" strokeWidth="0.8" opacity="0.65" fill="none" />
      <path d="M 4 4 L 4 34"  stroke="#6b8fa8" strokeWidth="0.8" opacity="0.65" fill="none" />
      <path d="M 4 4 Q 10 10 18 10 Q 26 10 26 18" stroke="#6b8fa8" strokeWidth="0.55" fill="none" opacity="0.4" />
      <ellipse cx="9" cy="9" rx="4.5" ry="3" stroke="#c4a46b" strokeWidth="0.6"
        fill="none" opacity="0.55" transform="rotate(-45 9 9)" />
      <path d="M 7 11 Q 9 7.5 11 11" stroke="#c4a46b" strokeWidth="0.4"
        fill="none" opacity="0.4" transform="rotate(-45 9 9)" />
    </svg>
  )
}

function ShellAccent({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <ellipse cx="13" cy="13" rx="11" ry="7.5" stroke="#6b8fa8" strokeWidth="0.7"
        fill="rgba(107,143,168,0.06)" />
      <path d="M 2 13 Q 7 8.5 13 10 Q 19 11.5 24 13" stroke="#6b8fa8" strokeWidth="0.5" fill="none" opacity="0.6" />
      <path d="M 2 13 Q 7 17.5 13 16 Q 19 14.5 24 13" stroke="#6b8fa8" strokeWidth="0.5" fill="none" opacity="0.6" />
      <circle cx="13" cy="13" r="1.2" fill="#c4a46b" opacity="0.5" />
    </svg>
  )
}

export async function GET(request: NextRequest) {
  try {
  const { searchParams } = new URL(request.url)
  const rawName = searchParams.get('name') ?? ''
  const guest = rawName.slice(0, 28).trim()

  const italicText = `${guest}приглашение на день рождение Софии Греческий ресторан «DIA»`
  const normalTextBase = 'день рождения · 28 марта Суббота, 28 марта · 18:00'
  const normalText = normalTextBase + normalTextBase.toUpperCase()

  type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  const [fontItalic, fontNormal] = await Promise.all([
    loadGoogleFont('Cormorant+Garamond:ital,wght@1,300', italicText),
    loadGoogleFont('Cormorant+Garamond:ital,wght@0,400', normalText),
  ])
  const fonts: { name: string; data: ArrayBuffer; style: 'normal' | 'italic'; weight: Weight }[] = [
    { name: 'Cormorant Garamond', data: fontItalic, style: 'italic', weight: 300 },
    { name: 'Cormorant Garamond', data: fontNormal, style: 'normal', weight: 400 },
  ]

  const imgResponse = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#f0e8d8',
          position: 'relative',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(210,175,110,0.10) 0%, transparent 70%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 28,
            border: '1px solid rgba(107,143,168,0.55)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 40,
            border: '0.5px solid rgba(107,143,168,0.3)',
          }}
        />

        <div style={{ position: 'absolute', top: 34, left: 34, display: 'flex' }}>
          <CornerOrnament />
        </div>
        <div style={{ position: 'absolute', top: 34, right: 34, display: 'flex', transform: 'scaleX(-1)' }}>
          <CornerOrnament />
        </div>
        <div style={{ position: 'absolute', bottom: 34, left: 34, display: 'flex', transform: 'scaleY(-1)' }}>
          <CornerOrnament />
        </div>
        <div style={{ position: 'absolute', bottom: 34, right: 34, display: 'flex', transform: 'scale(-1)' }}>
          <CornerOrnament />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          <div style={{ width: 56, height: 1, background: 'rgba(107,143,168,0.38)' }} />
          <ShellAccent size={22} />
          <div style={{ width: 56, height: 1, background: 'rgba(107,143,168,0.38)' }} />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 50,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          <div style={{ width: 56, height: 1, background: 'rgba(107,143,168,0.38)' }} />
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#c4a46b', opacity: 0.65,
            display: 'flex',
          }} />
          <div style={{ width: 56, height: 1, background: 'rgba(107,143,168,0.38)' }} />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '70px 110px',
            gap: 0,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#c4a46b',
              marginBottom: guest ? 22 : 32,
              fontWeight: 400,
              fontStyle: 'normal',
            }}
          >
            день рождения · 28 марта 
          </div>

          {guest && (
            <div
              style={{
                fontSize: 74,
                color: '#6b8fa8',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.1,
                marginBottom: 18,
                maxWidth: 860,
              }}
            >
              {guest}
            </div>
          )}

          <div
            style={{
              fontSize: guest ? 33 : 50,
              color: '#2a5068',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.45,
              marginBottom: 4,
            }}
          >
            приглашение на
          </div>

          <div
            style={{
              fontSize: guest ? 33 : 50,
              color: '#2a5068',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.45,
              marginBottom: 30,
            }}
          >
            день рождение Софии
          </div>

          {/* Separator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              marginBottom: 26,
            }}
          >
            <div style={{ width: 64, height: 1, background: 'rgba(107,143,168,0.45)' }} />
            <div style={{ color: '#c4a46b', fontSize: 15 }}>✦</div>
            <div style={{ width: 64, height: 1, background: 'rgba(107,143,168,0.45)' }} />
          </div>

          {/* Date */}
          <div
            style={{
              fontSize: 19,
              color: '#5a6a6a',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 400,
              fontStyle: 'normal',
            }}
          >
            Суббота, 28 марта · 18:00
          </div>

          {/* Venue */}
          <div
            style={{
              fontSize: 17,
              color: '#5a6a6a',
              fontStyle: 'italic',
              fontWeight: 300,
              marginTop: 7,
            }}
          >
             Греческий ресторан «DIA»
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts }
  )
  const buf = await imgResponse.arrayBuffer()
  return new Response(buf, { headers: { 'Content-Type': 'image/png' } })
  } catch (e) {
    console.error('OG image generation failed:', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
