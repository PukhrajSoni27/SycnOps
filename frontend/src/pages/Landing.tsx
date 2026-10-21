import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Command,
  Shield,
  Sparkles,
  Zap,
  Activity,
  Menu,
  X,
  GitBranch,
  Cpu
} from 'lucide-react'

// Background canvas
function PlasmaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0

    const updateBounds = () => {
      if (!canvas || !canvas.parentElement) return
      const rect = canvas.parentElement.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    updateBounds()
    window.addEventListener('resize', updateBounds)

    let time = 0

    const animate = () => {
      time += 0.014
      ctx.clearRect(0, 0, width, height)


      const grad = ctx.createRadialGradient(width * 0.7, height * 0.45, 30, width * 0.7, height * 0.45, width * 0.6)
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.18)')
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)


      const tendrils = 4
      for (let t = 0; t < tendrils; t++) {
        ctx.beginPath()
        ctx.strokeStyle = t % 2 === 0 ? 'rgba(16, 185, 129, 0.75)' : 'rgba(6, 182, 212, 0.75)'
        ctx.lineWidth = t === 0 ? 2 : 1

        const startX = width * 0.6 + Math.sin(time + t * 1.5) * 25
        const startY = 30 + t * 35

        ctx.moveTo(startX, startY)

        const steps = 16
        for (let i = 0; i < steps; i++) {
          const progress = i / steps
          const n1 = Math.sin(time * 2.2 + i * 0.8 + t * 1.2) * 32
          const n2 = Math.cos(time * 1.6 + i * 0.6) * 24

          const currentX = startX + n1 + Math.sin(i * 2.5 + time) * 10
          const currentY = startY + progress * (height * 0.85) + n2

          ctx.lineTo(currentX, currentY)
        }
        ctx.stroke()
      }


      for (let p = 0; p < 20; p++) {
        const px = (width * 0.35) + (Math.sin(p * 7 + time * 1.4) * 0.5 + 0.5) * (width * 0.6)
        const py = (Math.cos(p * 5 + time * 0.9) * 0.5 + 0.5) * height
        const radius = Math.sin(time * 2.5 + p) * 1.2 + 1.8

        ctx.beginPath()
        ctx.fillStyle = p % 2 === 0 ? 'rgba(16, 185, 129, 0.85)' : 'rgba(56, 189, 248, 0.85)'
        ctx.arc(px, py, Math.max(0.5, radius), 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', updateBounds)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        transform: 'translateZ(0)'
      }}
    />
  )
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    )

    const revealElements = document.querySelectorAll('.reveal-block')
    revealElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      title: 'Automated Pipeline Engine',
      desc: 'Orchestrate CI/CD builds, automated code reviews, and full-stack environment provisioning seamlessly.'
    },
    {
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      title: 'Real-Time Telemetry',
      desc: 'Track repository pull requests, active issues, and build velocity with continuous live analytics.'
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      title: 'Zero-Trust Security',
      desc: 'SOC2 compliant RBAC infrastructure, encrypted auth tokens, and automated code vulnerability scanning.'
    }
  ]

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$0',
      period: '/ month',
      desc: 'Perfect for solo developers & open-source projects.',
      features: ['Up to 5 Repositories', 'Standard AI Pipeline', 'Automated PR Checks', 'Community Support'],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/ month',
      desc: 'For high-velocity engineering teams & startups.',
      features: ['Unlimited Repositories', 'Priority AI Engine', 'Real-time Telemetry Dashboard', 'SOC2 Compliant Logs', 'Dedicated Support'],
      cta: 'Get Pro Access',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'Custom infrastructure & dedicated SLA guarantees.',
      features: ['On-Premise / Private Cloud', 'Custom Model Fine-tuning', '24/7 SLA Guarantee', 'Dedicated Solutions Architect'],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <div className="s-landing-root">
      {/* Background Grid Pattern */}
      <div className="s-grid-bg" />

      {/* Plasma Background Layer */}
      <div className="s-plasma-container">
        <PlasmaCanvas />
      </div>

      {/* Top Navbar */}
      <header className="s-nav-super">
        <div className="s-nav-super__inner">
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span className="s-logo-box">
              <Command style={{ width: '16px', height: '16px', color: '#ffffff' }} />
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 500, color: '#ffffff', letterSpacing: '-0.02em' }}>
              SycnOps<span style={{ color: '#10B981' }}>.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#features" className="s-nav__link">Features</a>
            <a href="#manifesto" className="s-nav__link">Manifesto</a>
            <a href="#pricing" className="s-nav__link">Pricing</a>
            <a href="#changelog" className="s-nav__link">Changelog</a>
          </nav>

          {/* Right Action Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/login" className="hidden md:flex" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
              Log in
            </Link>
            <Link to="/register" className="s-btn-white-pill">
              Get Early Access
            </Link>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 10, paddingTop: '140px', paddingBottom: '80px', paddingLeft: 'var(--pad-x)', paddingRight: 'var(--pad-x)', minHeight: '92vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)', gap: '48px', alignItems: 'center' }}>

          {/* Left Column Content */}
          <div>
            {/* Tag / Category */}
            <div className="reveal-block" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', '--reveal-delay': '0.05s' } as any}>
              <span className="s-pulse-dot" />
              <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#10B981' }}>
                01_DEVOPS_AUTOMATION •
              </span>
            </div>

            {/* Headline */}
            <h1 className="s-hero-cyan-heading reveal-block" style={{ '--reveal-delay': '0.1s' } as any}>
              The AI Ops<br />
              <span className="s-hero-cyan-accent">Platform.</span>
            </h1>

            {/* Description Paragraph */}
            <p className="reveal-block" style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, color: 'rgba(235, 235, 235, 0.7)', marginBottom: '36px', maxWidth: '460px', '--reveal-delay': '0.15s' } as any}>
              Automate code reviews, CI/CD pipelines, repository telemetry, and full-stack deployments. SycnOps orchestrates your engineering workflows with autonomous AI intelligence.
            </p>

            {/* Buttons */}
            <div className="reveal-block" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px', '--reveal-delay': '0.2s' } as any}>
              <Link to="/register" className="s-btn-white-pill">
                Initialize <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#manifesto" className="s-btn-dark-pill">
                View Documentation
              </a>
            </div>

            {/* Compliance Badges */}
            <div className="reveal-block" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', '--reveal-delay': '0.25s' } as any}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em' }}>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> SOC2 COMPLIANT
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em' }}>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> NO CREDIT CARD REQUIRED
              </div>
            </div>
          </div>

          {/* Right Column Visual (IDE Window + Floating Badges) */}
          <div className="reveal-block" style={{ '--reveal-delay': '0.2s' } as any}>
            <div className="s-ide-container">

              {/* Floating Badge Top Right: STATUS Active */}
              <div className="s-floating-badge" style={{ top: '-18px', right: '-12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-tech)', fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                      STATUS
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
                      System Healthy
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge Middle Right: Circle Accent */}
              <div style={{ position: 'absolute', right: '-24px', top: '40%', zIndex: 25 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Floating Badge Bottom Left: STACK Info */}
              <div className="s-floating-badge" style={{ bottom: '-18px', left: '-12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GitBranch className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-tech)', fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                      STACK
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
                      Node / React / Mongo
                    </div>
                  </div>
                </div>
              </div>

              {/* IDE Window Frame */}
              <div className="s-ide-window">
                {/* Header bar with 3 dots */}
                <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                </div>

                {/* Window Body Mockup */}
                <div style={{ padding: '24px', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {/* Skeleton Code Tabs */}
                  <div>
                    <div style={{ height: '12px', width: '140px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '16px' }} />
                    <div style={{ height: '8px', width: '80%', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', marginBottom: '8px' }} />
                    <div style={{ height: '8px', width: '60%', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', marginBottom: '8px' }} />
                  </div>

                  {/* Terminal Console Output */}
                  <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.7 }}>
                    <div style={{ color: '#06B6D4' }}>&gt; sycnops_init --cluster=production</div>
                    <div style={{ color: '#10B981' }}>&gt; analyzing repository health... [OK]</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      &gt; automated AI pipelines active... <span className="s-pulse-dot" style={{ display: 'inline-block', width: '6px', height: '6px' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Scroll to Explore Indicator */}
        <div style={{ margin: '48px auto 0 auto', textAlign: 'center' }}>
          <div className="s-scroll-indicator">
            <span>SCROLL TO EXPLORE</span>
            <div className="s-scroll-line" />
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" style={{ position: 'relative', zIndex: 10, padding: '100px var(--pad-x)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="s-inner">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="s-overline">CORE CAPABILITIES</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 300, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Designed for Autonomous Operations
            </h2>
          </div>

          <div className="s-feature-grid">
            {features.map((f, i) => (
              <div key={i} className="s-feature-card s-spotlight">
                <div className="s-feature-card__icon">
                  {f.icon}
                </div>
                <h3 className="s-feature-card__title">{f.title}</h3>
                <p className="s-feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto / Workflow Section */}
      <section id="manifesto" className="s-draw">
        <div className="s-draw__inner">
          <div>
            <span className="s-overline">OUR MANIFESTO</span>
            <h2 className="s-draw__h2">
              Engineering Velocity. <br />
              <span className="s-draw__h2-em">AI Precision.</span>
            </h2>
            <p className="s-draw__lede">
              We believe operations should be continuous, automated, and effortless. SycnOps bridges human developer strategy with autonomous execution.
            </p>

            <ul className="s-draw__deflist">
              <li className="s-draw__defrow">
                <span className="s-draw__deflabel">01_EXEC</span>
                <span className="s-draw__defdesc">Sub-second telemetry &amp; automated build triggers</span>
                <span className="s-draw__defval">99.99% UPTIME</span>
              </li>
              <li className="s-draw__defrow">
                <span className="s-draw__deflabel">02_SYNC</span>
                <span className="s-draw__defdesc">Real-time GitHub repository &amp; PR synchronization</span>
                <span className="s-draw__defval">LIVE</span>
              </li>
              <li className="s-draw__defrow">
                <span className="s-draw__deflabel">03_SECU</span>
                <span className="s-draw__defdesc">Granular auth, token security &amp; encrypted storage</span>
                <span className="s-draw__defval">ENCRYPTED</span>
              </li>
            </ul>
          </div>

          {/* Interactive Code Spec Graphic */}
          <div className="s-draw__svg-wrap s-spotlight">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: '#10B981', letterSpacing: '0.2em' }}>
                ARCHITECTURE_SPEC
              </span>
              <span className="s-pulse-dot" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
              <div><span style={{ color: '#10B981' }}>const</span> ops = <span style={{ color: '#38BDF8' }}>new</span> SycnOpsEngine({'{'}</div>
              <div style={{ paddingLeft: '16px' }}>cluster: <span style={{ color: '#F59E0B' }}>'Production'</span>,</div>
              <div style={{ paddingLeft: '16px' }}>aiAssistant: <span style={{ color: '#38BDF8' }}>true</span>,</div>
              <div style={{ paddingLeft: '16px' }}>telemetry: <span style={{ color: '#F59E0B' }}>'Real-time'</span></div>
              <div>{'}'});</div>
              <div style={{ marginTop: '12px', color: '#10B981' }}>await ops.deployWorkflow(); // Success ⚡</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ position: 'relative', zIndex: 10, padding: '100px var(--pad-x)', background: '#050505', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="s-inner">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="s-overline">PRICING TIERS</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 300, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Transparent Plans for Every Scale
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={tier.popular ? 's-feature-card s-spotlight' : 's-panel'}
                style={{
                  padding: '40px',
                  borderRadius: '24px',
                  background: 'rgba(255,255,255,0.02)',
                  border: tier.popular ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                  position: 'relative'
                }}
              >
                {tier.popular && (
                  <span style={{ position: 'absolute', top: '20px', right: '20px', fontFamily: 'var(--font-tech)', fontSize: '9px', color: '#10B981', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', padding: '4px 10px', borderRadius: '999px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    MOST POPULAR
                  </span>
                )}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#ffffff', marginBottom: '8px' }}>{tier.name}</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', minHeight: '38px' }}>{tier.desc}</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', fontWeight: 300, color: '#ffffff' }}>{tier.price}</span>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{tier.period}</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
                      <Check className="w-4 h-4 text-emerald-400" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={tier.popular ? 's-btn-white-pill' : 's-btn-dark-pill'}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="changelog" style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.08)', padding: '60px var(--pad-x) 40px var(--pad-x)', background: '#050505' }}>
        <div className="s-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="s-logo-box">
              <Command style={{ width: '16px', height: '16px', color: '#ffffff' }} />
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: '#ffffff' }}>
              SycnOps<span style={{ color: '#10B981' }}>.</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
            <span className="s-pulse-dot" /> ALL SYSTEMS OPERATIONAL
          </div>

          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} SycnOps Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
