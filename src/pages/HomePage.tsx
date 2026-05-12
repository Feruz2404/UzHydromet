import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { Services } from '../components/Services'
import { Leadership } from '../components/Leadership'
import { LocationMap } from '../components/LocationMap'
import { AppointmentForm } from '../components/AppointmentForm'
import { News } from '../components/News'
import { Footer } from '../components/Footer'
import { BackToTop } from '../components/BackToTop'

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Leadership />
        <LocationMap />
        <AppointmentForm />
        <News />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default HomePage
