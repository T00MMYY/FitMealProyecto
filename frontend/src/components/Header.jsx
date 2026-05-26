import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import './Header.css'

const NAV_ITEMS = ['Workouts', 'Recetas', 'Productos', 'Contacto']

export default function Header() {
  const headerRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 })

    // Header slides down and fades in
    tl.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
    )

    // Nav links stagger in after header arrives
    tl.fromTo(
      '.nav-link',
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
      '-=0.3'
    )
  }, { scope: headerRef })

  return (
    <header ref={headerRef} className="header">
      <div className="header-inner">

        {/* Left — logo image */}
        <img src="/FitMeal_logoblanco.png" alt="FitMeal" className="logo-img" />

        {/* Center — nav */}
        <nav>
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a href="#" className="nav-link">{item}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right — cart + login */}
        <div className="header-left">
          <button className="cart-btn" aria-label="Carrito">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
          <a href="#" className="login-btn nav-link">Login</a>
        </div>

      </div>
    </header>
  )
}
