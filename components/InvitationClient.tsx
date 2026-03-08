'use client'

import { useEffect, useRef } from 'react'

export default function InvitationClient({ name }: { name: string }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Dynamic import — safe on client, avoids SSR issues
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)

      /* ── 1. HERO FRAME DRAW-IN ── */
      const framePath  = document.querySelector<SVGPathElement>('.frame-path')
      const frameInner = document.querySelector<SVGPathElement>('.frame-inner')
      if (framePath)  gsap.to(framePath,  { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', delay: 0.2 })
      if (frameInner) gsap.to(frameInner, { strokeDashoffset: 0, duration: 2.8, ease: 'power2.inOut', delay: 0.5 })

      gsap.to('.corner-ornament', { opacity: 1, duration: 1, stagger: 0.15, delay: 1.8, ease: 'power2.out' })

      /* ── 2. HERO TEXT STAGGER ── */
      const heroTl = gsap.timeline({ delay: 0.8 })
      heroTl
        .to('#heroOverline', { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' })
        .to('#heroScript',   { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.5')
        .to('#heroName',     { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, '-=0.7')
        .to('#heroSep',      { opacity: 1,       duration: 0.8, ease: 'power2.out' }, '-=0.4')
        .to('#heroSub',      { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, '-=0.5')
        .to('#scrollHint',   { opacity: 1,       duration: 0.8, ease: 'power2.out' }, '-=0.3')

      /* ── 3. SHELL FLOAT ── */
      gsap.to(['#shellLeft', '#shellRight'], { opacity: 1, duration: 1.5, delay: 2.2, ease: 'power2.out' })
      gsap.to('#shellLeft',  { y: -8, x: -4, duration: 4,   yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 3 })
      gsap.to('#shellRight', { y:  8, x:  4, duration: 4.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 3.2 })

      document.querySelectorAll('.micro-shell').forEach((el, i) => {
        gsap.to(el, {
          y: `${(i % 2 === 0 ? -1 : 1) * 10}`,
          x: `${(i % 3 === 0 ? -1 : 1) * 5}`,
          duration: 4 + i * 0.7,
          yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.5,
        })
      })

      /* ── 4. SEAL SECTION — INIT STROKE LENGTHS ── */
      function initStrokes(sel: string) {
        document.querySelectorAll<SVGGeometryElement>(sel).forEach(el => {
          const len = el.getTotalLength?.() ?? 300
          el.style.strokeDasharray  = String(len)
          el.style.strokeDashoffset = String(len)
        })
      }
      initStrokes('.seal-frame-outer')
      initStrokes('.seal-frame-inner')
      initStrokes('.seal-orn-path')
      initStrokes('.ribbon-path')

      /* ── 5. SPAWN PARTICLES ── */
      const wrap = document.getElementById('particlesWrap')
      if (wrap) {
        const COLORS = [
          'rgba(196,164,107,0.5)',
          'rgba(107,143,168,0.35)',
          'rgba(210,190,150,0.4)',
          'rgba(255,255,255,0.45)',
        ]
        for (let i = 0; i < 26; i++) {
          const p   = document.createElement('div')
          p.className = 'particle'
          const sz  = Math.random() * 3.5 + 1.2
          const x   = Math.random() * 92 + 4
          const y   = Math.random() * 80 + 10
          const dur = Math.random() * 8 + 7
          const del = Math.random() * 5
          const col = COLORS[Math.floor(Math.random() * COLORS.length)]
          p.style.cssText = `width:${sz}px;height:${sz}px;left:${x}%;top:${y}%;background:${col};animation:particleDrift ${dur}s ${del}s ease-in-out infinite;`
          wrap.appendChild(p)
        }
      }

      /* ── 6. SEAL SEQUENCE (scroll-triggered, plays once) ── */
      let sealPlayed = false
      ScrollTrigger.create({
        trigger: '#seal-section',
        start: 'top 60%',
        onEnter: () => {
          if (sealPlayed) return
          sealPlayed = true

          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
          tl.to('#sealBgGlow',     { opacity: 1, duration: 1.2, ease: 'power2.inOut' }, 0)
          tl.to('#sealFrame',      { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.inOut', transformOrigin: 'center center' }, 0.05)
          tl.to('.seal-frame-outer', { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 0.1)
          tl.to('.seal-frame-inner', { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.25)
          tl.to('.seal-orn-path',    { strokeDashoffset: 0, duration: 0.7, stagger: 0.06, ease: 'power2.inOut' }, 0.5)
          tl.to('#ribbonWrap',     { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.3)',
            transform: 'translateX(-50%) translateY(0)' }, 0.9)
          tl.to('.ribbon-path',    { strokeDashoffset: 0, duration: 0.7, stagger: 0.05, ease: 'power2.inOut' }, 1.0)
          tl.to('#sealMessage',    { opacity: 1, y: 0, duration: 0.7 }, 1.5)
          tl.to('#pearlSeal',      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, 2.0)
          tl.to('#pearlGlow',      { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 2.1)
          tl.call(() => {
            gsap.to('#pearlGlow', { scale: 1.12, opacity: 0.7, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' })
          }, [], 3.0)
          tl.to('#sealInfo',      { opacity: 1, y: 0, duration: 0.7 }, 2.3)
          tl.to('#sealInfoDiv',   { width: 60, duration: 0.5, ease: 'power2.inOut' }, 2.5)
          tl.to('.particle',      { opacity: 1, stagger: { amount: 1.2, from: 'random' }, duration: 1.0 }, 1.8)
        },
      })

      /* ── 7. RAF LOOP — shell open + atmosphere reveal ── */
      let atmDone = false
      let smoothY = 0
      const EASE = 0.09
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t

      let rafId: number
      const tick = () => {
        rafId = requestAnimationFrame(tick)
        smoothY = lerp(smoothY, window.scrollY, EASE)
        const sy = smoothY

        const heroH   = document.getElementById('hero')?.offsetHeight ?? window.innerHeight
        const heroExit = Math.max(0, Math.min(1, sy / heroH))
        const sl = document.getElementById('shellLeft')
        const sr = document.getElementById('shellRight')
        if (sl) sl.style.transform = `translate(calc(-110% - ${heroExit * 140}px), -50%)`
        if (sr) sr.style.transform = `translate(calc(10%  + ${heroExit * 140}px), -50%)`

        const atm = document.getElementById('atmosphere')
        if (atm && !atmDone) {
          const prog = Math.max(0, Math.min(1,
            (sy - atm.offsetTop + window.innerHeight * 0.75) / atm.offsetHeight))
          if (prog > 0) {
            atmDone = true
            gsap.to('.atm-eyebrow', { opacity: 1, duration: 0.9, ease: 'power2.out' })
            document.querySelectorAll('.atm-line').forEach((line, i) => {
              gsap.to(line, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: i * 0.18 })
            })
            gsap.to('#atmRule', { opacity: 1, width: 60, duration: 0.8, ease: 'power2.out', delay: 0.9 })
            gsap.to('#atmSig',  { opacity: 1, duration: 1, ease: 'power2.out', delay: 1.1 })
          }
        }
      }
      tick()

      return () => {
        cancelAnimationFrame(rafId)
        ScrollTrigger.getAll().forEach(t => t.kill())
      }
    })
  }, [])

  return (
    <>
      {/* ═══════════════ SECTION 1 — HERO ═══════════════ */}
      <section id="hero">

        {/* Decorative outer frame */}
        <svg className="frame-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="frame-path" d="M 2,2 L 98,2 L 98,98 L 2,98 Z" />
          <path className="frame-inner" d="M 4,4 L 96,4 L 96,96 L 4,96 Z" />
          <line className="frame-inner" x1="20" y1="4"  x2="80" y2="4" />
          <line className="frame-inner" x1="20" y1="96" x2="80" y2="96" />
        </svg>

        {/* Corner ornaments */}
        <div className="corner-ornament tl">
          <svg viewBox="0 0 80 80" fill="none">
            <path d="M 4 4 L 36 4" stroke="#6b8fa8" strokeWidth="0.8" opacity="0.7" />
            <path d="M 4 4 L 4 36" stroke="#6b8fa8" strokeWidth="0.8" opacity="0.7" />
            <path d="M 4 4 Q 12 12 20 12 Q 28 12 28 20" stroke="#6b8fa8" strokeWidth="0.6" fill="none" opacity="0.45" />
            <ellipse cx="10" cy="10" rx="5" ry="3.5" stroke="#c4a46b" strokeWidth="0.6" fill="none" opacity="0.5" transform="rotate(-45 10 10)" />
            <path d="M 7 12 Q 10 8 13 12" stroke="#c4a46b" strokeWidth="0.5" fill="none" opacity="0.4" transform="rotate(-45 10 10)" />
          </svg>
        </div>
        <div className="corner-ornament tr">
          <svg viewBox="0 0 80 80" fill="none">
            <path d="M 4 4 L 36 4" stroke="#6b8fa8" strokeWidth="0.8" opacity="0.7" />
            <path d="M 4 4 L 4 36" stroke="#6b8fa8" strokeWidth="0.8" opacity="0.7" />
            <path d="M 4 4 Q 12 12 20 12 Q 28 12 28 20" stroke="#6b8fa8" strokeWidth="0.6" fill="none" opacity="0.45" />
            <ellipse cx="10" cy="10" rx="5" ry="3.5" stroke="#c4a46b" strokeWidth="0.6" fill="none" opacity="0.5" transform="rotate(-45 10 10)" />
          </svg>
        </div>
        <div className="corner-ornament bl">
          <svg viewBox="0 0 80 80" fill="none">
            <path d="M 4 4 L 36 4" stroke="#6b8fa8" strokeWidth="0.8" opacity="0.7" />
            <path d="M 4 4 L 4 36" stroke="#6b8fa8" strokeWidth="0.8" opacity="0.7" />
            <path d="M 4 4 Q 12 12 20 12 Q 28 12 28 20" stroke="#6b8fa8" strokeWidth="0.6" fill="none" opacity="0.45" />
            <ellipse cx="10" cy="10" rx="5" ry="3.5" stroke="#c4a46b" strokeWidth="0.6" fill="none" opacity="0.5" transform="rotate(-45 10 10)" />
          </svg>
        </div>
        <div className="corner-ornament br">
          <svg viewBox="0 0 80 80" fill="none">
            <path d="M 4 4 L 36 4" stroke="#6b8fa8" strokeWidth="0.8" opacity="0.7" />
            <path d="M 4 4 L 4 36" stroke="#6b8fa8" strokeWidth="0.8" opacity="0.7" />
            <path d="M 4 4 Q 12 12 20 12 Q 28 12 28 20" stroke="#6b8fa8" strokeWidth="0.6" fill="none" opacity="0.45" />
            <ellipse cx="10" cy="10" rx="5" ry="3.5" stroke="#c4a46b" strokeWidth="0.6" fill="none" opacity="0.5" transform="rotate(-45 10 10)" />
          </svg>
        </div>

        {/* Shell opening elements */}
        <div className="shell-left" id="shellLeft">
          <svg viewBox="0 0 90 90" fill="none">
            <path d="M 75 45 Q 60 15 30 20 Q 8 25 10 45 Q 8 65 30 70 Q 60 75 75 45 Z"
              fill="rgba(107,143,168,0.07)" stroke="#6b8fa8" strokeWidth="0.8" />
            <path d="M 75 45 Q 55 35 35 38 Q 20 40 18 45" stroke="#82a5be" strokeWidth="0.5" fill="none" opacity="0.5" />
            <path d="M 75 45 Q 55 42 35 46 Q 20 48 18 45" stroke="#82a5be" strokeWidth="0.5" fill="none" opacity="0.5" />
            <path d="M 75 45 Q 55 50 35 54 Q 20 54 18 45" stroke="#82a5be" strokeWidth="0.5" fill="none" opacity="0.5" />
            <path d="M 75 45 Q 57 56 38 62 Q 25 64 18 45" stroke="#82a5be" strokeWidth="0.5" fill="none" opacity="0.3" />
            <circle cx="75" cy="45" r="3" fill="#c4a46b" opacity="0.5" />
          </svg>
        </div>
        <div className="shell-right" id="shellRight">
          <svg viewBox="0 0 90 90" fill="none">
            <path d="M 15 45 Q 30 15 60 20 Q 82 25 80 45 Q 82 65 60 70 Q 30 75 15 45 Z"
              fill="rgba(107,143,168,0.07)" stroke="#6b8fa8" strokeWidth="0.8" />
            <path d="M 15 45 Q 35 35 55 38 Q 70 40 72 45" stroke="#82a5be" strokeWidth="0.5" fill="none" opacity="0.5" />
            <path d="M 15 45 Q 35 42 55 46 Q 70 48 72 45" stroke="#82a5be" strokeWidth="0.5" fill="none" opacity="0.5" />
            <path d="M 15 45 Q 35 50 55 54 Q 70 54 72 45" stroke="#82a5be" strokeWidth="0.5" fill="none" opacity="0.5" />
            <circle cx="15" cy="45" r="3" fill="#c4a46b" opacity="0.5" />
          </svg>
        </div>

        {/* Main content */}
        <div className="hero-content">
          <p className="hero-overline" id="heroOverline">
            Sofia&apos;s 18th Birthday Party
          </p>
          <span className="hero-script" id="heroScript">Please join me</span>
          <span className="hero-name" id="heroName">
            {name ? name : ''}
          </span>
          <div className="hero-separator" id="heroSep">
            <span className="sep-icon">✦</span>
          </div>
          <p className="hero-sub" id="heroSub">
            Приглашаю отпраздновать мое совершеннолетие<br />
            вместе в уголке средиземноморского тепла<br />
            и греческого гостеприимства!
          </p>
        </div>

        <div className="hero-scroll-hint" id="scrollHint">
          <div className="scroll-arrow" />
        </div>
        <div className="hero-divider" />
      </section>

      {/* ═══════════════ SECTION 2 — INVITATION SEAL ═══════════════ */}
      <section id="seal-section">

        {/* Re-drawing ornament flourishes */}
        <svg className="seal-ornaments-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
          <path className="seal-orn-path" d="M 58 58 Q 82 42 116 48 Q 138 52 148 66" stroke="#6b8fa8" strokeWidth="0.9" fill="none" opacity="0.5" />
          <path className="seal-orn-path" d="M 58 58 Q 58 82 73 98 Q 81 108 96 114"  stroke="#6b8fa8" strokeWidth="0.9" fill="none" opacity="0.5" />
          <path className="seal-orn-path" d="M 60 60 Q 92 80 88 114"                 stroke="#c4a46b" strokeWidth="0.65" fill="none" opacity="0.38" />
          <ellipse className="seal-orn-path" cx="72" cy="72" rx="7" ry="4.5"
            stroke="#c4a46b" strokeWidth="0.65" fill="none" opacity="0.45" transform="rotate(-38 72 72)" />

          <path className="seal-orn-path" d="M 742 58 Q 718 42 684 48 Q 662 52 652 66" stroke="#6b8fa8" strokeWidth="0.9" fill="none" opacity="0.5" />
          <path className="seal-orn-path" d="M 742 58 Q 742 82 727 98 Q 719 108 704 114" stroke="#6b8fa8" strokeWidth="0.9" fill="none" opacity="0.5" />
          <path className="seal-orn-path" d="M 740 60 Q 708 80 712 114"                   stroke="#c4a46b" strokeWidth="0.65" fill="none" opacity="0.38" />
          <ellipse className="seal-orn-path" cx="728" cy="72" rx="7" ry="4.5"
            stroke="#c4a46b" strokeWidth="0.65" fill="none" opacity="0.45" transform="rotate(38 728 72)" />

          <path className="seal-orn-path" d="M 58 542 Q 82 558 116 552 Q 138 548 148 534"    stroke="#6b8fa8" strokeWidth="0.9" fill="none" opacity="0.45" />
          <path className="seal-orn-path" d="M 58 542 Q 58 518 73 502 Q 81 492 96 486"       stroke="#6b8fa8" strokeWidth="0.9" fill="none" opacity="0.45" />
          <path className="seal-orn-path" d="M 742 542 Q 718 558 684 552 Q 662 548 652 534"  stroke="#6b8fa8" strokeWidth="0.9" fill="none" opacity="0.45" />
          <path className="seal-orn-path" d="M 742 542 Q 742 518 727 502 Q 719 492 704 486"  stroke="#6b8fa8" strokeWidth="0.9" fill="none" opacity="0.45" />

          <path className="seal-orn-path" d="M 346 50  Q 370 44 400 46  Q 430 44 454 50"  stroke="#6b8fa8" strokeWidth="0.75" fill="none" opacity="0.42" />
          <path className="seal-orn-path" d="M 346 550 Q 370 556 400 554 Q 430 556 454 550" stroke="#6b8fa8" strokeWidth="0.75" fill="none" opacity="0.42" />
        </svg>

        {/* Ribbon / bow */}
        <div className="ribbon-wrap" id="ribbonWrap">
          <svg className="ribbon-svg" viewBox="0 0 200 96" fill="none">
            <path className="ribbon-path"
              d="M 100 48 C 80 20, 36 10, 24 32 C 12 54, 56 64, 100 48 Z"
              stroke="#6b8fa8" strokeWidth="1.1" fill="rgba(107,143,168,0.05)" />
            <path className="ribbon-path"
              d="M 100 48 C 120 20, 164 10, 176 32 C 188 54, 144 64, 100 48 Z"
              stroke="#6b8fa8" strokeWidth="1.1" fill="rgba(107,143,168,0.05)" />
            <path className="ribbon-path" d="M 93 52 C 80 66, 68 76, 56 86"    stroke="#6b8fa8" strokeWidth="1.1" fill="none" />
            <path className="ribbon-path" d="M 107 52 C 120 66, 132 76, 144 86" stroke="#6b8fa8" strokeWidth="1.1" fill="none" />
            <ellipse className="ribbon-path" cx="100" cy="48" rx="7.5" ry="5.5"
              stroke="#6b8fa8" strokeWidth="1.1" fill="rgba(107,143,168,0.18)" />
            <path className="ribbon-path" d="M 100 48 C 82 32, 48 26, 36 36"   stroke="#82a5be" strokeWidth="0.55" fill="none" opacity="0.55" />
            <path className="ribbon-path" d="M 100 48 C 118 32, 152 26, 164 36" stroke="#82a5be" strokeWidth="0.55" fill="none" opacity="0.55" />
          </svg>
        </div>

        {/* Center composition */}
        <div className="seal-center" id="sealCenter">
          <p className="seal-message" id="sealMessage">
            See you<br />by the sea
          </p>
          <div className="pearl-seal" id="pearlSeal">
            <div className="pearl-inner" />
            <div className="pearl-glow" id="pearlGlow" />
          </div>
          <div className="seal-info" id="sealInfo">
            <p className="seal-date">Суббота, 28 марта</p>
            <p className="seal-time">18 : 00</p>
            <div className="seal-info-div" id="sealInfoDiv" />
            <p className="seal-venue">Греческий ресторан «DIA»</p>
            <p className="seal-address">Профсоюзная улица, 10/14</p>
          </div>
        </div>

        <div className="particles-wrap" id="particlesWrap" />
      </section>

      {/* ═══════════════ SECTION 3 — ATMOSPHERE ═══════════════ */}
      <section id="atmosphere">

        <div className="seal-bg-glow" id="sealBgGlow" />

        {/* Converging outer frame */}
        <svg className="seal-frame" id="sealFrame" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect className="seal-frame-outer" x="1.5" y="1.5" width="97" height="97"
            fill="none" stroke="#6b8fa8" strokeWidth="0.65" opacity="0.6" />
          <rect className="seal-frame-inner" x="3.5" y="3.5" width="93" height="93"
            fill="none" stroke="#6b8fa8" strokeWidth="0.35" opacity="0.4" />
          <line className="seal-frame-inner" x1="15"   y1="3.5"  x2="85"   y2="3.5"
            stroke="#6b8fa8" strokeWidth="0.35" opacity="0.35" />
          <line className="seal-frame-inner" x1="15"   y1="96.5" x2="85"   y2="96.5"
            stroke="#6b8fa8" strokeWidth="0.35" opacity="0.35" />
          <line className="seal-frame-inner" x1="3.5"  y1="20"   x2="3.5"  y2="80"
            stroke="#6b8fa8" strokeWidth="0.35" opacity="0.35" />
          <line className="seal-frame-inner" x1="96.5" y1="20"   x2="96.5" y2="80"
            stroke="#6b8fa8" strokeWidth="0.35" opacity="0.35" />
        </svg>

        <div className="micro-shell" style={{ top: '12%', left: '8%', transform: 'rotate(-20deg)' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <ellipse cx="16" cy="16" rx="12" ry="8" stroke="#6b8fa8" strokeWidth="0.8" fill="rgba(107,143,168,0.06)" />
            <path d="M 4 16 Q 10 10 16 12 Q 22 14 28 16" stroke="#6b8fa8" strokeWidth="0.5" fill="none" />
            <path d="M 4 16 Q 10 18 16 20 Q 22 20 28 16" stroke="#6b8fa8" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        <div className="micro-shell" style={{ top: '70%', right: '6%', transform: 'rotate(15deg)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <ellipse cx="12" cy="12" rx="9" ry="6" stroke="#c4a46b" strokeWidth="0.7" fill="rgba(196,164,107,0.05)" />
            <path d="M 3 12 Q 7 8 12 9 Q 17 10 21 12" stroke="#c4a46b" strokeWidth="0.4" fill="none" />
          </svg>
        </div>
        <div className="micro-shell" style={{ bottom: '15%', left: '12%', transform: 'rotate(30deg)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <ellipse cx="10" cy="10" rx="8" ry="5" stroke="#6b8fa8" strokeWidth="0.6" fill="none" />
            <path d="M 2 10 Q 6 7 10 8 Q 14 9 18 10" stroke="#6b8fa8" strokeWidth="0.4" fill="none" />
            <path d="M 2 10 Q 6 13 10 12 Q 14 11 18 10" stroke="#6b8fa8" strokeWidth="0.4" fill="none" />
          </svg>
        </div>

        <div className="atm-card" id="atmCard">
          <p className="atm-eyebrow">an intimate gathering</p>
          <p className="atm-line">A <em>beautiful evening</em> by the sea,</p>
          <p className="atm-line">warm air and soft golden light,</p>
          <p className="atm-line">the kind of night that stays with you —</p>
          <p className="atm-line">and the people <em>closest to my heart.</em></p>
          <div className="atm-rule" id="atmRule" />
          <p className="atm-signature" id="atmSig">with love</p>
        </div>
      </section>
    </>
  )
}
