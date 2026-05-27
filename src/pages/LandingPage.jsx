import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import ParticleField from '../components/landing/ParticleField'
import PenWriter from '../components/landing/PenWriter'
import '../landing.css'

const FEATURES = [
  { icon: '✦', title: 'AI Writing Assistant', desc: 'Claude rewrites your bullet points to be stronger, more impactful and ATS-optimized instantly.' },
  { icon: '◎', title: 'Live Preview', desc: 'See your resume update in real time as you type. Switch between 3 professional templates.' },
  { icon: '⬡', title: 'ATS Job Matcher', desc: 'Paste any job description and get a match score with the exact keywords you need to add.' },
  { icon: '↯', title: 'One-Click PDF', desc: 'Export a pixel-perfect A4 PDF with real selectable text that passes any ATS scanner.' },
  { icon: '◈', title: 'Cloud Saved', desc: 'Your resume saves automatically. Pick up exactly where you left off on any device.' },
  { icon: '✐', title: 'Cover Letter AI', desc: 'Generate a tailored cover letter for any job posting in seconds with Gemini AI.' },
]

const STATS = [
  { number: '3', label: 'Pro Templates' },
  { number: '7', label: 'AI Features' },
  { number: '∞', label: 'Free Forever' },
  { number: '60s', label: 'To First Resume' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [hovering, setHovering] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  // Intersection observer for fade-up sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('fade-up')
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.observe-me').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing">

      {/* Particles */}
      <ParticleField />

      {/* Background orbs */}
      <div className="orb w-96 h-96 top-0 left-1/4 opacity-20" style={{ background: '#4f6ef7' }} />
      <div className="orb w-80 h-80 top-20 right-1/4 opacity-15" style={{ background: '#a78bfa' }} />
      <div className="orb w-64 h-64 bottom-1/3 left-1/3 opacity-10" style={{ background: '#06b6d4' }} />

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #4f6ef7, #a78bfa)' }}>R</div>
          <span className="font-semibold text-white text-sm tracking-wide">Resume Buddy</span>
        </div>

        <div className="secure-badge">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          Secure Login
        </div>

        <motion.button
          onClick={() => navigate('/builder')}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cta-button text-sm py-2 px-6"
        >
          Open Builder →
        </motion.button>
      </motion.nav>

      {/* HERO SECTION */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 min-h-screen flex items-center pt-20"
      >
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="secure-badge mb-8 inline-flex"
            >
              ✦ AI-Powered Resume Builder
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hero-title mb-6"
            >
              Build Resumes<br />That Get You<br />
              <span style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg, #a78bfa, #4f6ef7)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                Hired.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="hero-subtitle mb-10 max-w-md"
            >
              AI-powered writing assistant, live preview, ATS optimization,
              and one-click PDF export. Free forever.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <motion.button
                onClick={() => navigate('/builder')}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cta-button"
              >
                <span>Start Building Free</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >→</motion.span>
              </motion.button>

              <p className="text-xs text-white/30 tracking-wide">No signup required to start</p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex gap-8 mt-12"
            >
              {STATS.map((stat, i) => (
                <div key={i}>
                  <div className="stat-number text-2xl">{stat.number}</div>
                  <div className="text-xs text-white/30 tracking-wide mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D Resume Animation */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <PenWriter />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator">
          <span className="text-xs text-white/30 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </motion.section>

      {/* GRADIENT DIVIDER */}
      <div className="gradient-line my-0 relative z-10" />

      {/* FEATURES SECTION */}
      <section className="relative z-10 py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 observe-me opacity-0">
          <p className="text-xs text-white/40 tracking-widest uppercase mb-4">Everything you need</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Built different.
          </h2>
          <p className="text-white/40 max-w-md mx-auto">
            Every feature designed to give you an unfair advantage in your job search.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className="feature-card"
            >
              <div className="text-2xl mb-4"
                style={{ background: 'linear-gradient(135deg, #4f6ef7, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {f.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-32 px-8 text-center">
        <div className="orb w-96 h-96 opacity-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
          style={{ background: '#4f6ef7' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <p className="text-xs text-white/40 tracking-widest uppercase mb-6">Get started today</p>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Your dream job<br />starts here.
          </h2>
          <p className="text-white/40 mb-10 max-w-md mx-auto">
            Join thousands building better resumes with AI.
            Free forever, no credit card required.
          </p>

          <motion.button
            onClick={() => navigate('/builder')}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-button mx-auto"
            style={{ fontSize: '16px', padding: '18px 48px' }}
          >
            Build My Resume — It's Free →
          </motion.button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t py-8 px-8 text-center"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-white text-xs"
            style={{ background: 'linear-gradient(135deg, #4f6ef7, #a78bfa)' }}>R</div>
          <span className="text-white/40 text-sm">Resume Buddy</span>
        </div>
        <p className="text-white/20 text-xs tracking-wide">
          Powered by Gemini AI · Built with React + Vite
        </p>
      </footer>
    </div>
  )
}
