
import ReactLenis from "lenis/react";
import About from "./sections/About"
import Contact from "./sections/Contact"
import ContactSummary from "./sections/ContactSummary"
import Hero from "./sections/Hero"
import Navbar from "./sections/Navbar"
import Services from "./sections/Services"
import ServiceSummary from "./sections/ServiceSummary"
import Works from "./sections/Works"
import { useProgress } from "@react-three/drei";
import { useState, useEffect } from "react";

// Lenis se encarga de implementar un smooth scroll en toda la aplicación

const App = () => {

  const { progress } = useProgress();               // Obtiene el progreso de carga de los modelos 3d
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {                                 // Cuando el progreso de carga sea 100, se activa el estado isReady
    if (progress === 100) {
      setIsReady(true);
    }
  }, [progress]);

  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-auto">
      {/* Mientras carga el modelo 3d, se muestra un div con un progreso circular */}
      {!isReady && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black text-white transition-opacity duration-700 font-light">
          <p className="mb-4 text-xl tracking-widest animate-pulse">
            Loading {Math.floor(progress)}%
          </p>
          <div className="relative h-1 overflow-hidden rounded w-60 bg-white/20">
            <div
              className="absolute top-0 left-0 h-full transition-all duration-300 bg-white"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      <div
        className={`
          ${isReady 
            ? "opacity-100" 
            : "opacity-0"
          } transition-opacity duration-1000 delay-500`
        }
      >
        <Navbar />
        <Hero />
        <ServiceSummary />
        <Services />
        <About />
        <Works />
        <ContactSummary />
        <Contact />
      </div>
    </ReactLenis>
  )
}

export default App