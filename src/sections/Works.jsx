
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { projects } from "../constants";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Icon } from "@iconify-icon/react/dist/iconify.js";

const Works = () => {

  // --- Refs y Estado ---
  const previewRef = useRef(null);                          // Ref para el contenedor de la imagen de previsualización flotante.
  const overlayRefs = useRef([]);                           // Array de refs para las capas de superposición de cada proyecto.

  const [currentIndex, setCurrentIndex] = useState(null);   // Estado para saber qué proyecto está en hover.

  // Texto para el encabezado de la sección.
  const text = `Featured projects that have been meticulously
    crafted with passion to drive
    results and impact.`;

  // --- Lógica de Animación ---
  const mouse = useRef({ x: 0, y: 0 });                     // Ref para almacenar las coordenadas del mouse.
  const moveX = useRef(null);                               // Ref para la función de animación GSAP en el eje X.
  const moveY = useRef(null);                               // Ref para la función de animación GSAP en el eje Y.

  useGSAP(() => {
    // Inicializa las animaciones que seguirán al cursor. 
    // `quickTo` es ideal para un rendimiento óptimo.
    moveX.current = gsap.quickTo(previewRef.current, "x", { // Mueve el preview en el eje X.
      duration: 1.5,
      ease: "power3.out",
    });
    moveY.current = gsap.quickTo(previewRef.current, "y", {
      duration: 2,
      ease: "power3.out",
    });

    // Animación de entrada para cada proyecto cuando se hace scroll.
    gsap.from("#project", {
      y: 100,
      opacity: 0,
      delay: 0.5,
      duration: 1,
      stagger: 0.3,
      ease: "back.out",
      scrollTrigger: {
        trigger: "#project",
      },
    });
  }, []);

  // --- Manejadores de Eventos del Mouse ---

  // Se activa cuando el cursor entra en un elemento de proyecto.
  const handleMouseEnter = (index) => {
    if (window.innerWidth < 768) return;                                 // Desactiva el efecto en pantallas pequeñas.
    setCurrentIndex(index);                                              // Actualiza el estado para mostrar la imagen correcta.

    const el = overlayRefs.current[index];                               // accede al div específico de la superposición para el proyecto sobre el que se está haciendo hover. 
    if (!el) return;
    gsap.killTweensOf(el);                                               // Detiene las animaciones si se sale rapidamente de un elemento permitiendo que la nueva se ejecute.  
    gsap.fromTo(                                                         // Anima el 'clip-path' del overlay para revelarlo.
      el,
      {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",       // Estado inicial: El polígono es una línea en el borde inferior (invisible).
      },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",            // Estado final: El polígono cubre todo el div (100% visible).
        duration: 0.15,
        ease: "power2.out",
      }
    );

    // Anima la aparición de la imagen de previsualización.
    gsap.to(previewRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // Se activa cuando el cursor sale de un elemento de proyecto.
  const handleMouseLeave = (index) => {
    if (window.innerWidth < 768) return;                                   // Desactiva el efecto en pantallas pequeñas.
    setCurrentIndex(null);                                                 // Oculta la imagen de previsualización.

    const el = overlayRefs.current[index];
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.to(el, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      duration: 0.2,
      ease: "power2.in",
    });

    
    gsap.to(previewRef.current, {                                          // Anima la desaparición de la imagen de previsualización.
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // Actualiza la posición del preview para que siga al cursor.
  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return; // Desactiva el efecto en pantallas pequeñas.
    mouse.current.x = e.clientX + 24;
    mouse.current.y = e.clientY + 24;
    moveX.current(mouse.current.x);
    moveY.current(mouse.current.y);
  };

  return (
    <section id="work" className="flex flex-col min-h-screen">
      {/* Encabezado animado de la sección */}
      <AnimatedHeaderSection
        subTitle={"Logic meets Aesthetics, Seamlessly"}
        title={"Works"}
        text={text}
        textColor={"text-black"}
        withScrollTrigger={true}
      />
      
      <div 
        // Contenedor principal que escucha el movimiento del mouse para el efecto flotante.
        className="relative flex flex-col font-light"
        onMouseMove={handleMouseMove}  
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            id="project"
            className="relative flex flex-col gap-1 py-5 cursor-pointer group md:gap-0"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            {/* 
              Capa de superposición que se anima en hover (solo en escritorio). 
              Produce el efecto de cortinilla en cada framework cambiando el fondo a color negro
            */}
            <div
              ref={(el) => {
                overlayRefs.current[index] = el;
              }}
              className="absolute inset-0 hidden md:block duration-200 bg-black -z-10 clip-path"
            />

            {/* Título del proyecto y el icono de flecha */}
            <div className="flex justify-between px-10 text-black transition-all duration-500 md:group-hover:px-12 md:group-hover:text-white">
              <h2 className="lg:text-[32px] text-[26px] leading-none">
                {project.name}
              </h2>
              <Icon icon="lucide:arrow-up-right" className="md:size-6 size-5" />
            </div>
            
            {/* Línea divisoria */}
            <div className="w-full h-0.5 bg-black/80" />

            {/* Lista de frameworks o tecnologías usadas */}
            <div className="flex px-10 text-xs leading-loose uppercase transition-all duration-500 md:text-sm gap-x-5 md:group-hover:px-12">
              {project.frameworks.map((framework) => (
                <p
                  key={framework.id}
                  className="text-black transition-colors duration-500 md:group-hover:text-white"
                >
                  {framework.name}
                </p>
              ))}
            </div>

            {/* Previsualización de la imagen para dispositivos móviles (oculto en escritorio) */}
            <div className="relative flex items-center justify-center px-10 md:hidden h-[400px]">
              <img
                src={project.bgImage}
                alt={`${project.name}-bg-image`}
                className="object-cover w-full h-full rounded-md brightness-50"
              />
              <img
                src={project.image}
                alt={`${project.name}-image`}
                className="absolute bg-center px-14 rounded-xl"
              />
            </div>
          </div>
        ))}

        {/* Contenedor de la imagen de previsualización flotante (solo en escritorio) */}
        <div
          ref={previewRef}
          className="fixed -top-2/6 left-0 z-50 overflow-hidden border-8 border-black pointer-events-none w-[960px] md:block hidden opacity-0"
        >
          {currentIndex !== null && (
            <img
              src={projects[currentIndex].image}
              alt="preview"
              className="object-cover w-full h-full"
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default Works