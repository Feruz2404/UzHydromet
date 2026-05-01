import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { WeatherSection } from '../components/WeatherSection'
import { About } from '../components/About'
import { Services } from '../components/Services'
import { Leadership } from '../components/Leadership'
import { ReceptionSchedule } from '../components/ReceptionSchedule'
import { LocationMap } from '../components/LocationMap'
import { AppointmentForm } from '../components/AppointmentForm'
import { News } from '../components/News'
import { Footer } from '../components/Footer'
import { BackToTop } from '../components/BackToTop'

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1">
        <Hero />
        <WeatherSection />
        <About />
        <Services />
        <Leadership />
        <ReceptionSchedule />
        <LocationMap />
        <AppointmentForm />
        <News />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
