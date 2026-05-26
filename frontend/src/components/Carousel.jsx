import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Carousel.css'

const SLIDES = [
  {
    image: '/delicious-grain-bowl-with-chicken-and-vegetables-2026-03-19-01-52-11-utc.webp',
    tag: 'Nutrición',
    title: 'Energía real para\ntu rendimiento',
    text: 'Planes de alimentación diseñados por nutricionistas expertos para asegurar que obtengas los macros y micronutrientes que tu cuerpo necesita para rendir al máximo.',
    cta: { label: 'Ver recetas', to: '/recetas' },
  },
  {
    image: '/healthy-chicken-salad-with-fresh-vegetables-2026-03-18-15-10-01-utc.webp',
    tag: 'Recetas',
    title: 'Sabor sin\ncompromisos',
    text: 'Más de 100 recetas saludables elaboradas para que comer sano nunca sea aburrido. Variedad, sabor y nutrición en cada plato, adaptados a tus objetivos.',
    cta: { label: 'Explorar recetas', to: '/recetas' },
  },
  {
    image: '/rice-bowl-with-tomatoes-radishes-spinach-and-mea-2026-03-23-18-01-58-utc.webp',
    tag: 'Productos',
    title: 'Ingredientes que\nmarcan la diferencia',
    text: 'Suplementación de alta calidad para complementar tu dieta y llevar tu rendimiento al siguiente nivel. Productos verificados, sin compromisos.',
    cta: { label: 'Ver productos', to: '/products' },
  },
]

function SplitWords({ text, className }) {
  return (
    <p className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="word-wrap">
          <span className="word">{word}&nbsp;</span>
        </span>
      ))}
    </p>
  )
}

export default function Carousel() {
  const wrapperRef = useRef(null)
  const stripRef   = useRef(null)
  const tweenRef   = useRef(null)

  useGSAP(() => {
    const slides = gsap.utils.toArray('.carousel-slide')

    tweenRef.current = gsap.to(stripRef.current, {
      xPercent: -100 * (SLIDES.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapperRef.current,
        pin: true,
        start: 'top top',
        end: () => `+=${window.innerWidth * (SLIDES.length - 1)}`,
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    })

    slides.forEach((slide, i) => {
      const title = slide.querySelector('.slide-title')
      const words = slide.querySelectorAll('.word')
      const tag   = slide.querySelector('.slide-tag')

      const trigger = i === 0
        ? { trigger: wrapperRef.current, start: 'top 80%' }
        : {
            containerAnimation: tweenRef.current,
            trigger: slide,
            start: 'left 70%',
          }

      gsap.fromTo(tag,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { ...trigger } }
      )

      gsap.fromTo(title,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1,
          scrollTrigger: { ...trigger } }
      )

      gsap.fromTo(words,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: 'power2.out',
          delay: 0.25,
          scrollTrigger: { ...trigger },
        }
      )
    })
  }, { scope: wrapperRef })

  return (
    <section ref={wrapperRef} className="carousel-wrapper">
      <div ref={stripRef} className="carousel-strip">
        {SLIDES.map((slide, i) => (
          <div key={i} className={`carousel-slide slide-${i}`}>
            <div className="slide-content">
              <span className="slide-tag">{slide.tag}</span>
              <h3 className="slide-title">{slide.title}</h3>
              <SplitWords text={slide.text} className="slide-body" />
              {slide.cta && (
                <Link to={slide.cta.to} className="slide-cta">
                  {slide.cta.label}
                  <span className="slide-cta__arrow">→</span>
                </Link>
              )}
            </div>

            <div className="slide-image-wrap">
              <img
                src={slide.image}
                alt={slide.title}
                className="slide-image"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-counter">
        {SLIDES.map((_, i) => (
          <span key={i} className="dot" />
        ))}
      </div>
    </section>
  )
}
