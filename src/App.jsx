
import About from "./sections/About"
import Hero from "./sections/Hero"
import Navbar from "./sections/Navbar"
import Services from "./sections/Services"
import ServiceSummary from "./sections/ServiceSummary"
import Works from "./sections/Works"



const App = () => {

  return (
    <div className="relative w-screen min-h-screen overflow-x-auto">
      <Navbar />
      <Hero />
      <ServiceSummary />
      <Services />
      <About />
      <Works />
      <section className="min-h-screen" />
      <section className="min-h-screen" />
      <section className="min-h-screen" />
    </div>
  )
}

export default App