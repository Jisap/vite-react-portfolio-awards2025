
import Hero from "./sections/Hero"
import Navbar from "./sections/Navbar"
import ServiceSummary from "./sections/ServiceSummary"



const App = () => {

  return (
    <div className="relative w-screen min-h-screen overflow-x-auto">
      <Navbar />
      <Hero />
      <ServiceSummary />
      <section className="min-h-screen" />
      <section className="min-h-screen" />
      <section className="min-h-screen" />
      <section className="min-h-screen" />
      <section className="min-h-screen" />
    </div>
  )
}

export default App