import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useAuth } from '../context/AuthContext'
import VideoSection from '../components/ui/VideoSection'
import PlansSection from '../components/ui/PlansSection'
import Carousel from '../components/ui/Carousel'
import useLenis from '../hooks/useLenis'
import api from '../api/axios'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Keyed by id_plan to match DB exactly
const planAssets = {
  1: {
    img: 'delicious-grain-bowl-with-chicken-and-vegetables-2026-03-19-01-52-11-utc.webp',
    imgAlt: 'Healthy Bowl',
    featured: false,
  },
  2: {
    img: 'healthy-chicken-salad-with-fresh-vegetables-2026-03-18-15-10-01-utc.webp',
    imgAlt: 'Chicken Meal',
    featured: true,
  },
  3: {
    img: 'rice-bowl-with-tomatoes-radishes-spinach-and-mea-2026-03-23-18-01-58-utc.webp',
    imgAlt: 'Avocado Salad',
    featured: false,
  },
}

export default function Home() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])

  useLenis()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/api/plans')
        const combined = response.data.plans.map((p) => {
          const asset = planAssets[p.id_plan] ?? planAssets[1]
          return {
            id: p.id_plan,
            name: p.nombre_plan,
            price: Number(p.precio_mensual) === 0 ? 'GRATIS' : `${p.precio_mensual} € /mes`,
            features: p.caracteristicas ? p.caracteristicas.split(',') : [],
            ...asset,
          }
        })
        setPlans(combined)
      } catch (error) {
        console.error('Error fetching plans:', error)
      }
    }
    fetchPlans()
  }, [])

  const handlePlanClick = (plan) => {
    if (!isAuthenticated) {
      navigate('/register')
      return
    }
    navigate(`/suscripcion?planId=${plan.id}`, { state: { plan } })
  }

  return (
    <div className="bg-black text-white">
      <VideoSection />
      <PlansSection plans={plans} onPlanClick={handlePlanClick} />
      <Carousel />
    </div>
  )
}
