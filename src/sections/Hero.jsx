import { useRef } from "react"
import AnimatedTextLines from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";


const Hero = () => {

  const contextRef = useRef(null);
  const headerRef = useRef(null);

  const aboutText = `I help growing brands and startups gain an 
  unfair advantage through 
  premium results driven webs/apps`

  useGSAP(() => {
    
    const tl = gsap.timeline();            // Se crea una línea de tiempo para secuenciar las animaciones de entrada.

    
    tl.from(contextRef.current, {          // 1. Anima el contenedor principal para que se deslice hacia arriba. 
      y: "50vh",                           // Empieza 50% de la altura del viewport hacia abajo.
      duration: 1,
      ease: "circ.out"
    });

    
    tl.from(headerRef.current, {           // 2. Anima el encabezado para que aparezca con un efecto de revelado.
      opacity: 0,                          // Empieza invisible.
      y: 200,                              // Empieza 200px más abajo de su posición final.
      duration: 3,
      ease: "circ.out"
    }, 
      "<+0.2"                              // Parámetro de posición: empieza 0.2s después del inicio de la animación anterior.
    );
  },[])

  return (
    <section 
      id="home"
      className="flex flex-col justify-end min-h-screen" 
    >
      <div ref={contextRef}>
        {/* El clip-path engloba el <p> y el <h1> */}
        <div style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
          <div
            ref={headerRef} 
            className="flex flex-col justify-center gap-12 pt-16 sm:gap-16 mt-20"
          >
            <p className="text-sm font-light tracking-[0.5rem] uppercase px-10 text-black">
              404 No Bugs Found
            </p>
            <div className="px-10">
              <h1 className="flex flex-col gap-12 text-black uppercase banner-text-responsive sm:gap-16 md:block mb-1 md:mb-2">
                Jisap Dev
              </h1>
            </div>
          </div>
        </div>

        <div className="relative px-10 text-black">
          <div className="absolute inset-x-0 border-t-2"/>
          <div className="py-12 sm:py-16 text-end">
            <AnimatedTextLines 
              className="font-light uppercase value-text-responsive" 
              text={aboutText}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero