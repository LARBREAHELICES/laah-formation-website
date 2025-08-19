import FeaturedFormations from '@/components/DetailFormation'
import AboutSection      from '@/components/AboutUs'

import Divider           from '@/components/Divider'
import TestimonialSection from '@/components/TestimonialSection'
import ContactSection from '@/components/Contact'
import HeroSection from '@/components/HeroSection'


export default function App() {
  return (
    <>
      <HeroSection/>
      <Divider/>
      <FeaturedFormations />  
      <Divider />
      <AboutSection />
      <Divider />
      <TestimonialSection />
      <Divider />
      <ContactSection/>
    </>
  )
}