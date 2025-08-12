import { Icon } from '@iconify-icon/react/dist/iconify.js';
import React, { useEffect, useRef } from 'react'
import gsap from "gsap";
import { Observer } from "gsap/all";

gsap.registerPlugin(Observer);

const Marquee = ({
  items, 
  className="text-white bg-black",
  icon = "mdi:star-four-points",
  iconClassName = "",
  reverse = false,
}) => {

  const containerRef = useRef(null);       // Ref para el contenedor principal.
  const itemsRef = useRef([]);             // Ref para guardar un array de los elementos de la marquesina.

  function horizontalLoop(items, config) { // Motor de la animación
    
    items = gsap.utils.toArray(items);                          // Convierte los elementos del DOM en un array que GSAP pueda manejar. 
    config = config || {};

    let tl = gsap.timeline({                                    // Crea la linea de tiempo principal de la animación  
      repeat: config.repeat,                                    // Añade a dicha linea las props necesarias. Repeat indica cuantas veces se repite (-1 infinito).
      paused: config.paused,                                    // Si la animación debe empezar pausada o no.
      defaults: { ease: "none" },                               // Para que el movimiento sea lineal y constante sin aceleraciones ni frenadas
      onReverseComplete: () =>                                  // Función que se ejecuta al terminar la animación en sentido inverso.
        tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
      length = items.length,                                    // Se definen acontinuación las variables necesarias para la función horizontalLoop
      startX = items[0].offsetLeft,                             // La posición horizontal inicial del primer elemento.
      times = [],                                               // array para guardar los tiempos de inicio de la animación de cada elemento.
      widths = [],                                              // array para guardar el ancho en píxeles de cada elemento
      xPercents = [],                                           // array para guardar la posición x de cada elemento como un porcentaje
      curIndex = 0,
      pixelsPerSecond = (config.speed || 1) * 100,              // Calcula la velocidad de la animación en píxeles por segundo.
      snap =
        config.snap === false                                   // Una función de utilidad de GSAP para redondear valores y evitar saltos de píxeles en algunos navegadores.
          ? (v) => v 
          : gsap.utils.snap(config.snap || 1),   
      totalWidth,                                               // variable que guardará el ancho total de todos los elementos juntos. 
      curX,                                                     // El resto de variables temporales se usan dentro del bucle for para los cálculos de cada elemento individual.  
      distanceToStart,
      distanceToLoop,
      item,
      i;
    gsap.set(items, {
      // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
      xPercent: (i, el) => {
        let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
        xPercents[i] = snap(
          (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
          gsap.getProperty(el, "xPercent")
        );
        return xPercents[i];
      },
    });
    gsap.set(items, { x: 0 });
    totalWidth =
      items[length - 1].offsetLeft +
      (xPercents[length - 1] / 100) * widths[length - 1] -
      startX +
      items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], "scaleX") +
      (parseFloat(config.paddingRight) || 0);
    for (i = 0; i < length; i++) {
      item = items[i];
      curX = (xPercents[i] / 100) * widths[i];
      distanceToStart = item.offsetLeft + curX - startX;
      distanceToLoop =
        distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
      tl.to(
        item,
        {
          xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
          duration: distanceToLoop / pixelsPerSecond,
        },
        0
      )
        .fromTo(
          item,
          {
            xPercent: snap(
              ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
            ),
          },
          {
            xPercent: xPercents[i],
            duration:
              (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false,
          },
          distanceToLoop / pixelsPerSecond
        )
        .add("label" + i, distanceToStart / pixelsPerSecond);
      times[i] = distanceToStart / pixelsPerSecond;
    }
    function toIndex(index, vars) { // Función que pone en marcha el horizontalLoop
      vars = vars || {};
      Math.abs(index - curIndex) > length / 2 &&
        (index += index > curIndex ? -length : length); // always go in the shortest direction
      let newIndex = gsap.utils.wrap(0, length, index),
        time = times[newIndex];
      if (time > tl.time() !== index > curIndex) {
        // if we're wrapping the timeline's playhead, make the proper adjustments
        vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }
      curIndex = newIndex;
      vars.overwrite = true;
      return tl.tweenTo(time, vars);
    }
    tl.next = (vars) => toIndex(curIndex + 1, vars);
    tl.previous = (vars) => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
      tl.vars.onReverseComplete();
      tl.reverse();
    }
    return tl;
  }

  useEffect(() => {
    const tl = horizontalLoop(itemsRef.current, {
      repeat: -1,
      paddingRight: 30,
      reversed: reverse,
    });

    Observer.create({
      onChangeY(self) {
        let factor = 2.5;
        if ((!reverse && self.deltaY < 0) || (reverse && self.deltaY > 0)) {
          factor *= -1;
        }
        gsap
          .timeline({
            defaults: {
              ease: "none",
            },
          })
          .to(tl, { timeScale: factor * 2.5, duration: 0.2, overwrite: true })
          .to(tl, { timeScale: factor / 2.5, duration: 1 }, "+=0.3");
      },
    });
    return () => tl.kill();
  }, [items, reverse]);

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden w-full h-20 md:h-[100px] flex items-center marquee-text-responsive font-light uppercase whitespace-nowrap ${className}`}
    >
      <div className='flex'>
        {items.map((text, index) => (
          <span 
            key={index}
            ref={(el) => (itemsRef.current[index] = el)}
            className='flex items-center px-16 gap-x-32'
          >
            {text} <Icon icon={icon} className={iconClassName} /> 
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee