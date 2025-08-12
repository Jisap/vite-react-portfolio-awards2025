import React from "react";
import { useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import AnimatedTextLines from "./AnimatedTextLines";

const AnimatedHeaderSection = ({
  subTitle,
  title,
  text,
  textColor,
  withScrollTrigger = false,       // Prop para decidir si la animación se activa con el scroll. Por defecto es false.
}) => {

  const contextRef = useRef(null); // Ref para el contenedor principal, usado como trigger del scroll.
  const headerRef = useRef(null);  // Ref para el contenido del encabezado (subtítulo y título).

  // Lógica para dividir el título en palabras si contiene espacios.
  const shouldSplitTitle = title.includes(" ");
  const titleParts = shouldSplitTitle ? title.split(" ") : [title];

  useGSAP(() => {
    
    const tl = gsap.timeline({                            // Se crea una línea de tiempo para secuenciar las animaciones.
      
      scrollTrigger: withScrollTrigger                    // El scrollTrigger solo se configura si withScrollTrigger es true.
        ? {
          trigger: contextRef.current,                    // El contenedor principal dispara la animación.
        }
        : undefined,
    });

    // 1. Primera animación en la timeline: el contenedor principal se desliza hacia arriba.
    tl.from(contextRef.current, {
      y: "50vh",                                          // Estado inicial: 50% de la altura del viewport hacia abajo. Hace que todo el bloque aparezca deslizándose desde abajo hacia arriba.
      duration: 1,
      ease: "circ.out",
    });

    // 2. Segunda animación: el contenido del encabezado aparece.
    tl.from(
      headerRef.current,
      {
        opacity: 0,                                       // Estado inicial: invisible.
        y: "200",                                         // Estado inicial: 200px más abajo de su posición final.
        duration: 1,
        ease: "circ.out",
      },
      "<+0.2" // Parámetro de posición: empieza 0.2s después del inicio de la animación anterior.
    );
  }, []); // El array de dependencias vacío asegura que la animación se configure solo una vez.

  return (
    // El ref del contenedor principal se asigna aquí.
    <div ref={contextRef}>
      {/* Este div con clip-path actúa como una máscara para el contenido que se anima desde abajo. */}
      <div style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
        <div
          ref={headerRef} // El ref del encabezado se asigna aquí.
          className="flex flex-col justify-center gap-12 pt-16 sm-gap-16"
        >
          <p
            className={`text-sm font-light tracking-[0.5rem] uppercase px-10 ${textColor}`}
          >
            {subTitle}
          </p>
          <div className="px-10">
            <h1
              className={`flex flex-col gap-12 uppercase banner-text-responsive sm:gap-16 md:block mb-2 ${textColor}`}
            >
              {/* Mapea las partes del título para renderizarlas. */}
              {titleParts.map((part, index) => (
                <span key={index}>{part} </span>
              ))}
            </h1>
          </div>
        </div>
      </div>
      <div className={`relative px-10 ${textColor}`}>
        <div className="absolute inset-x-0 border-t-2" />
        <div className="py-12 sm:py-16 text-end">
          {/* El componente AnimatedTextLines se encarga de animar el texto principal. */}
          <AnimatedTextLines
            text={text}
            className={`font-light uppercase value-text-responsive ${textColor}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedHeaderSection;
