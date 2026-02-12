import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero/Hero'
import Inventory from '../components/Inventory/Inventory'
import SellYourCar from '../components/SellYourCar/SellYourCar'
import Contact from '../components/Contact/Contact'
import AboutUs from '../components/AboutUs/AboutUs'

export default function HomePage() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash])

  return (
    <>
      <Hero />
      <Inventory />
      <SellYourCar />
      <Contact />
      <AboutUs />
    </>
  )
}
