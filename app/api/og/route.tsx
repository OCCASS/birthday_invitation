import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// ── Fetch a Google Font as TTF (needed by Satori / ImageResponse) ────────────
async function fetchGoogleFont(
  family: string,
  weight: number,
  style: 'normal' | 'italic' = 'normal'
): Promise<ArrayBuffer | null> {
  const ital = style === 'italic' ? 1 : 0
  const api = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:ital,wght@${ital},${weight}`

  try {
    const css = await fetch(api, {
      headers: {
        // older UA → Google returns TTF instead of WOFF2
        'User-Agent':
          'Mozilla/5.0 (Windows NT 5.1; rv:40.0) Gecko/20100101 Firefox/40.1',
      },
    }).then((r) => r.text())

    const match = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]?truetype['"]?\)/)
    if (!match) {
      // fallback: grab any url() present
      const anyUrl = css.match(/url\(([^)]+\.ttf[^)]*)\)/)
      if (!anyUrl) return null
      return fetch(anyUrl[1]).then((r) => r.arrayBuffer())
    }
    return fetch(match[1]).then((r) => r.arrayBuffer())
  } catch {
    return null
  }
}

// ── Corner ornament SVG (reused × 4 with transforms) ─────────────────────────
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

// ── Small shell illustration ──────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rawName = searchParams.get('name') ?? ''
  // Sanitise: max 28 chars to prevent overflow
  const guest = rawName.slice(0, 28).trim()

  // Load fonts (best-effort; if either fails, ImageResponse falls back to
  // the system serif which still looks elegant)
  const [fontItalic, fontRegular] = await Promise.all([
    fetchGoogleFont('Cormorant Garamond', 300, 'italic'),
    fetchGoogleFont('Cormorant Garamond', 400, 'normal'),
  ])

  // Weight must match Satori's `Weight` union type (100 | 200 | 300 | 400 | …)
  type W = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  type FontEntry = { name: string; data: ArrayBuffer; style: 'normal' | 'italic'; weight: W }
  const fonts: FontEntry[] = []
  if (fontItalic)  fonts.push({ name: 'Cormorant Garamond', data: fontItalic,  style: 'italic', weight: 300 as W })
  if (fontRegular) fonts.push({ name: 'Cormorant Garamond', data: fontRegular, style: 'normal', weight: 400 as W })

  return new ImageResponse(
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
        {/* Subtle warm vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(210,175,110,0.10) 0%, transparent 70%)',
          }}
        />

        {/* ── Outer border frame ── */}
        <div
          style={{
            position: 'absolute',
            inset: 28,
            border: '1px solid rgba(107,143,168,0.55)',
          }}
        />
        {/* Inner border frame */}
        <div
          style={{
            position: 'absolute',
            inset: 40,
            border: '0.5px solid rgba(107,143,168,0.3)',
          }}
        />

        {/* ── Corner ornaments ── */}
        {/* TL */}
        <div style={{ position: 'absolute', top: 34, left: 34, display: 'flex' }}>
          <CornerOrnament />
        </div>
        {/* TR */}
        <div style={{ position: 'absolute', top: 34, right: 34, display: 'flex', transform: 'scaleX(-1)' }}>
          <CornerOrnament />
        </div>
        {/* BL */}
        <div style={{ position: 'absolute', bottom: 34, left: 34, display: 'flex', transform: 'scaleY(-1)' }}>
          <CornerOrnament />
        </div>
        {/* BR */}
        <div style={{ position: 'absolute', bottom: 34, right: 34, display: 'flex', transform: 'scale(-1)' }}>
          <CornerOrnament />
        </div>

        {/* ── Top center decoration ── */}
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

        {/* ── Bottom center decoration ── */}
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

        {/* ── Main content column ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '70px 110px',
            gap: 0,
            textAlign: 'center',
          }}
        >
          {/* Overline */}
          <div
            style={{
              fontSize: 13,
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              color: '#c4a46b',
              marginBottom: guest ? 22 : 32,
              fontWeight: 400,
              fontStyle: 'normal',
            }}
          >
            день рождения · 12 июля
          </div>

          {/* Guest name (if present) */}
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
                overflow: 'hidden',
              }}
            >
              {guest},
            </div>
          )}

          {/* Invitation line 1 */}
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
            {guest ? 'ты приглашена на' : 'приглашение на'}
          </div>

          {/* Invitation line 2 */}
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
            день рождения Sofii
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
            Суббота, 12 июля · 19:00
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
            Restaurant Paros, Santorini
          </div>
        </div>
      </div>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { width: 1200, height: 630, fonts } as any
  )
}
