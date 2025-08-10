import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const AnimatedTextLines = ({ text, className }) => {

  const containerRef = useRef(null);
  const lineRefs = useRef([]);

  const lines = text.split("\n").filter(    // Dividimos el texto en linea en base a los saltos de linea
    (line) => line.trim() !== ""            // Eliminamos las lineas que esten vacías.
  );

  useGSAP(() => {
    if(lineRefs.current.length > 0){        // Solo se ejecuta si hay lineas
      gsap.from(lineRefs.current, {         // Se crea una animación "from" que define el estado inicial de las líneas.
        // Estado inicial
        yPercent: 100,                      // Mueve la línea 100% de su altura hacia abajo  
        opacity:0,                          // La hace completamente transparente
        // Configuración de la animación
        duration:1,                         // Dura 1 segundo 
        stagger:0.3,                        // Aplica un retraso de 0.3 segundo entre la animación de cada línea
        ease: "back.out",                   // Se usa la función de animación "back.out" para dar un efecto de retraso
        // Activa la animación
        scrollTrigger: {
          trigger: containerRef.current,    // Se activa la animación cuando el div "containerRef" se desplace
        }
      })
    }
  })

  return (
    <div 
      ref={containerRef}
      className={className}
    >
      {lines.map((line, index) => (
        // Gracias a overflow-hidden el texto no será visible hasta que entre en el area del div
        <div key={index} className="overflow-hidden">
          <span
            ref={(el) => (lineRefs.current[index] = el)}
            className="block leading-relaxed tracking-wide text-pretty"
          >
            {line}
          </span>
        </div>
      ))}
    </div>
  )
}

export default AnimatedTextLines