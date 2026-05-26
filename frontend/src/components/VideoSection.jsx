import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './VideoSection.css'

const FRAME_COUNT = 168
const SCROLL_DISTANCE = 10080

function frameUrl(i) {
  return `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`
}

export default function VideoSection() {
  const sectionRef   = useRef(null)
  const canvasRef    = useRef(null)
  const imagesRef    = useRef([])
  const currentFrame = useRef(0)

  const draw = useRef((index) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = imagesRef.current[index]
    if (!img?.complete || !img.naturalWidth) return

    const ctx = canvas.getContext('2d')
    const cw = canvas.width, ch = canvas.height
    const iw = img.naturalWidth, ih = img.naturalHeight
    const scale = Math.max(cw / iw, ch / ih)
    const x = (cw - iw * scale) / 2
    const y = (ch - ih * scale) / 2

    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, x, y, iw * scale, ih * scale)
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      draw.current(currentFrame.current)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    const imgs = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image()
      img.src = frameUrl(i)
      if (i === 0) img.onload = () => draw.current(0)
      return img
    })
    imagesRef.current = imgs
  }, [])

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.5 })

    tl.fromTo(
      '.hero-title',
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power2.inOut' }
    )

    tl.fromTo(
      '.hero-word',
      { y: '110%' },
      { y: '0%', duration: 1, stagger: 0.1, ease: 'power3.out' },
      '-=0.9'
    )
  }, { scope: sectionRef })

  useGSAP(() => {
    const obj = { frame: 0 }

    gsap.to(obj, {
      frame: FRAME_COUNT - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${SCROLL_DISTANCE}`,
        pin: true,
        scrub: 1,
        onUpdate: () => {
          const f = Math.round(obj.frame)
          if (f !== currentFrame.current) {
            currentFrame.current = f
            draw.current(f)
          }
        },
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="video-section">
      <canvas ref={canvasRef} className="video-canvas" />

      <h1 className="hero-title">
        {['Ruta', 'de', 'fitness', null, 'perfecta', null, 'con', 'Fitmeal'].map((word, i) =>
          word === null
            ? <span key={i} className="hero-break" />
            : (
              <span key={i} className="hero-word-mask">
                <span className={`hero-word${word === 'Fitmeal' ? ' hero-accent' : ''}`}>
                  {word}
                </span>
              </span>
            )
        )}
      </h1>

      <div className="video-overlay">
        <p className="scroll-hint">Scroll para avanzar</p>
      </div>
    </section>
  )
}
