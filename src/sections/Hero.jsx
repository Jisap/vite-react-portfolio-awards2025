import { useRef } from "react"
import AnimatedTextLines from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { Canvas } from "@react-three/fiber";
import { Planet } from "../components/Planet";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";



const Hero = () => {

  const isMobile = useMediaQuery({ maxWidth: 853 });
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

      <figure 
        className="absolute inset-0 -z-50"
        style={{
          width: "100vw", height: "100vh",
        }}  
      >
        <Canvas                                                          // Se crea un lienzo 3D gracias a Three.js
          shadows                                                        // Activa el renderizado de sombras  
          camera={{position: [0, 0, -10], fov: 17.5, near: 1, far: 20}}  // Configura la cámara virtual a traves de la cual vemos la escena 
        >  
          {/* Añade una luz ambiental que ilumina todos los objetos */}
          <ambientLight intensity={0.5} />
          {/* Hace que cualquier objeto que envuelva a sus hijo flote suavemente */}
          <Float speed={0.5}>
            <Planet scale={isMobile ? 0.7 : 1} />
          </Float>

          {/* Componente que añade efectos de iluminación realistas */}
          <Environment resolution={256}>
            <group rotation={[-Math.PI / 3, 4, 1]}>
              <Lightformer 
                form={"circle"}
                intensity={2}
                position={[0, 5, -9]}
                scale={10}
              />
              <Lightformer
                form={"circle"}
                intensity={2}
                position={[0, 3, 1]}
                scale={10}
              />
              <Lightformer
                form={"circle"}
                intensity={2}
                position={[-5, -1, -1]}
                scale={10}
              />
              <Lightformer
                form={"circle"}
                intensity={2}
                position={[10, 1, 0]}
                scale={16}
              />
            </group>
          </Environment>
        </Canvas>

      </figure>
    </section>
  )
}

export default Hero