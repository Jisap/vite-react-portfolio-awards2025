import React, { useRef } from 'react'
import Marquee from '../components/Marquee';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Marquee2 from '../components/Markee2';

const ContactSummary = () => {

  const containerRef = useRef(null);
  const items = [
    "Innovation",
    "Precision",
    "Trust",
    "Collaboration",
    "Excellence",
  ];
  const items2 = [
    "contact us",
    "contact us",
    "contact us",
    "contact us",
    "contact us",
  ];

  useGSAP(() => {
    // Se crea una animación para el elemento <section> referenciado por containerRef.
    // No se animan propiedades como 'x' u 'opacity', porque el único propósito
    // de este tween es controlar el ScrollTrigger.
    gsap.to(containerRef.current, {

      // Aquí empieza el ScrollTrigger
      scrollTrigger: {

        // 1. El disparador de la animación
        // El elemento que GSAP observará para iniciar la animación.
        trigger: containerRef.current,

        // 2. Punto de inicio
        // La animación (el "pin") comienza cuando el CENTRO del 'trigger'
        // se encuentra con el CENTRO de la ventana (viewport).
        start: "center center",

        // 3. Punto final
        // La animación termina 800px DESPUÉS del punto de 'start'.
        // El usuario tendrá que hacer scroll 800px para que la sección se "despegue".
        end: "+=800 center",

        // 4. Vinculación con el scroll
        // Asocia el progreso de la animación directamente con la barra de scroll.
        // El valor 0.5 añade un pequeño suavizado para que no se sienta brusco.
        scrub: 0.5,

        // 5. ¡La clave del efecto!
        // Fija el elemento 'trigger' en su lugar durante el scroll.
        pin: true,

        // 6. Evita saltos de contenido
        // Cuando un elemento se "pina", se saca del flujo normal del documento.
        // 'pinSpacing: true' añade un espaciado para que el contenido siguiente
        // no salte bruscamente hacia arriba.
        pinSpacing: true,

        // 7. Marcadores de depuración
        // Si estuviera en 'true', verías unas marcas en la pantalla que te
        // ayudarían a visualizar los puntos de 'start' y 'end'. Está en 'false'
        // para producción.
        markers: false,
      },
    });
  }, []);

  return (
    <section 
      ref={containerRef}
      className='flex flex-col items-center justify-between min-h-screen gap-12 mt-16'
    >
      <Marquee2 items={items} />
      <div className='overflow-hidden font-light text-center contact-text-responsive'>
        <p>
          " Let's build a <br />
          <span className='font-normal'>memorable</span> &{" "}
          <span className='italic'>inspiring</span> <br/>
          web application <span className='text-gold'>together</span> "
        </p>
      </div>
      <Marquee2
        items={items2}
        reverse={true}
        className="text-black bg-transparent border-y-2"
        iconClassName="stroke-gold stroke-2 text-primary"
        icon="material-symbols-light:square"
      />
    </section>
  )
}

export default ContactSummary