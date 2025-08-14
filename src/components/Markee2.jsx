import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { Icon } from '@iconify-icon/react';

// Registramos el plugin Observer de GSAP para poder usarlo.
gsap.registerPlugin(Observer);

/**
 * Un componente Marquee más simple que utiliza GSAP para la animación y la interacción.
 * @param {string[]} items - Array de textos para mostrar en la marquesina.
 * @param {number} speed - Duración de la animación en segundos. Un número más alto es más lento.
 * @param {boolean} reverse - Si la animación debe ir en reversa.
 * @param {string} className - Clases CSS para el contenedor principal.
 * @param {string} icon - El icono a mostrar junto a cada texto.
 * @param {string} iconClassName - Clases CSS para el icono.
 */
const Marquee2 = ({
  items,
  speed = 40,
  reverse = false,
  className = "text-white bg-black",
  icon = "mdi:star-four-points",
  iconClassName = "",
}) => {
  const marqueeRef = useRef(null);
  const animation = useRef(null);

  // Para que el bucle sea perfecto, duplicamos el contenido.
  // Esto asegura que siempre haya contenido para mostrar mientras el original se desplaza.
  const repeatedItems = items.length > 0 ? [...items, ...items] : [];

  useGSAP(() => {
    if (!marqueeRef.current || repeatedItems.length === 0) return;

    // Ancho total de la mitad del contenido (el set original de items).
    const totalWidth = marqueeRef.current.scrollWidth / 2;

    // Animación de GSAP para el bucle.
    animation.current = gsap.to(marqueeRef.current, {
      x: reverse       // x representa el destino final del movimiento
        ? totalWidth   // reverse es true: Mueve el contenedor hacia la derecha. Empezamos en 0 y vamos hacia +totalWidth. 
        : -totalWidth, // reverse es false: Mueve el contenedor hacia la izquierda. Empezamos en 0 y vamos hacia -totalWidth. 
      duration: speed,
      ease: 'none',
      repeat: -1,
      modifiers: { 
        // El modifier intercepta y procesa el valor de 'x' en cada frame
        // Cuando el valor de 'x' llega al final, lo "envuelve" y lo reinicia desde el principio.
        x: gsap.utils.unitize( // Le da una unidad de medida como px o %. Por defecto es px.
          gsap.utils.wrap(     // Vigila que el valor de x se encuentra dos valores min y max. Cuando se sobrepasa uno de esos valores se reinicia y lo "envuelve" al otro extremo del rango
              reverse 
                ? 0 
                : -totalWidth, // si reverse es false el valor mínimo -totalWidth
              reverse 
                ? totalWidth 
                : 0            // si reverse es false el valor máximo es 0
            )),
      },
    });

    // Control de velocidad con el scroll usando Observer.
    const observer = Observer.create({
      onChangeY(self) {
        const timeScaleFactor = 1 + Math.abs(self.deltaY) / 100;
        const directionFactor = self.deltaY < 0 ? 1 : -1;
        
        // Acelera o decelera suavemente la animación.
        gsap.to(animation.current, {
          timeScale: timeScaleFactor * directionFactor * (reverse ? -1 : 1),
          duration: 0.2,
          onComplete: () => {
            // Vuelve a la velocidad normal después de la interacción.
            gsap.to(animation.current, { timeScale: reverse ? -1 : 1, duration: 1, ease: "power1.inOut" });
          }
        });
      },
    });

    // Función de limpieza: se ejecuta cuando el componente se desmonta.
    return () => {
      observer.kill();
      animation.current.kill();
    };

  }, { dependencies: [items, speed, reverse], scope: marqueeRef });

  return (
    <div className={`w-full overflow-hidden flex items-center ${className}`}>
      <div 
        ref={marqueeRef} 
        className="flex whitespace-nowrap"
      >
        {repeatedItems.map((text, index) => (
          <span 
            key={index} 
            className="flex items-center px-16 marquee-text-responsive font-light uppercase shrink-0 gap-x-32"
          >
            {text} <Icon icon={icon} className={iconClassName} />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee2;