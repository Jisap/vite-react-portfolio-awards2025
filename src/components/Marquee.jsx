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
      // Para cada elemento GSAP ejecutará esta función 
      // xPercent es una propiedad especial de GSAP que mueve un elemento un porcentaje de su propio ancho.
      // Indicara pues cuanto se mueve el elemento respecto al ancho total de la línea de tiempo.
      xPercent: (i, el) => { 
        // 1. Calcula y guarda el ancho del elemento para usarlo después
        let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));

        xPercents[i] = snap(
          (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
          gsap.getProperty(el, "xPercent")
        );
        // 2. Devuelve el valor calculado para que GSAP lo aplique al elemento.
        return xPercents[i];
      },
    });
    
    // 3. Reinicia la propiedad 'x' (translateX) a 0.
    //    Esto asegura que la posición horizontal solo sea controlada por 'xPercent',
    //    evitando conflictos y creando un estado limpio para la animación.
    gsap.set(items, { x: 0 });
    
    // 4. Calcula el ancho total de todos los elementos juntos.
    //    Esto es crucial para que el bucle sea perfecto.
    totalWidth =
      items[length - 1].offsetLeft +                             // Obtiene la distancia en píxeles desde el borde izquierdo del contenedor (containerRef) hasta el borde izquierdo del último elemento de la marquesina.
      (xPercents[length - 1] / 100) * widths[length - 1] -       // calcula cuánto se ha movido el último elemento a través de xPercent y lo suma a la posición.
      startX +                                                   // startX guarda la posición inicial del primer elemento. Al restarlo estamos calculando la distancia neta entre el inicio del primer elemento y el inicio del último. Esto nos da el ancho que ocupan todos los elementos, excepto el ancho del último.
      items[length - 1].offsetWidth *                            // Añade el ancho completo del último elemento.
      gsap.getProperty(items[length - 1], "scaleX") +            // Considera su escala.
      (parseFloat(config.paddingRight) || 0);                    // Añade un padding extra para evitar saltos.

    // 5. Bucle para crear la animación de cada elemento.
    for (i = 0; i < length; i++) {
      item = items[i];
      curX = (xPercents[i] / 100) * widths[i];                   // Posición X actual del elemento.
      distanceToStart = item.offsetLeft + curX - startX;         // Distancia desde el inicio del contenedor.
      distanceToLoop =
        distanceToStart + widths[i] * gsap.getProperty(item, "scaleX"); // Distancia que debe recorrer para salir de la pantalla.
      
      // 6. Crea la animación principal para cada elemento.
      tl.to(
        item,
        {
          // Mueve el elemento hacia la izquierda hasta que desaparece.
          xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
          duration: distanceToLoop / pixelsPerSecond, // La duración se basa en la velocidad constante.
        },
        0 // Todas las animaciones 'to' empiezan al mismo tiempo (posición 0 en la timeline).
      )
        // 7. Crea la animación de "reaparición" para el mismo elemento.
        .fromTo(
          item,
          {
            // Lo "teletransporta" inmediatamente a la derecha, fuera de la pantalla.
            xPercent: snap(
              ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
            ),
          },
          {
            // Lo anima de vuelta a su posición original.
            xPercent: xPercents[i],
            duration:
              (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false,
          },
          distanceToLoop / pixelsPerSecond // Esta animación empieza justo cuando la anterior termina.
        )
        // 8. Añade una etiqueta a la línea de tiempo para cada elemento.
        .add("label" + i, distanceToStart / pixelsPerSecond);
      times[i] = distanceToStart / pixelsPerSecond; // Guarda el tiempo de la etiqueta.
    }
    
    // --- Funciones de control  ---
    function toIndex(index, vars) {                      // Función para animar a un índice específico.
      vars = vars || {};
      Math.abs(index - curIndex) > length / 2 &&
        (index += index > curIndex ? -length : length);  // Va por el camino más corto.
      let newIndex = gsap.utils.wrap(0, length, index),
        time = times[newIndex];
      if (time > tl.time() !== index > curIndex) {
        // Ajusta el tiempo si se necesita dar la vuelta completa a la timeline.
        vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }
      curIndex = newIndex;
      vars.overwrite = true;
      return tl.tweenTo(time, vars);
    }
    
    // --- Métodos de ayuda adjuntos a la línea de tiempo ---
    tl.next = (vars) => toIndex(curIndex + 1, vars);            // Va al siguiente elemento.
    tl.previous = (vars) => toIndex(curIndex - 1, vars);        // Va al elemento anterior.
    tl.current = () => curIndex;                                // Devuelve el índice actual.
    tl.toIndex = (index, vars) => toIndex(index, vars);         // Va a un índice específico.
    tl.times = times;                                           // Expone los tiempos de las etiquetas.

    // 9. Pre-renderiza la animación para un mejor rendimiento inicial.
    //    Salta al final y luego al principio para que todos los estados iniciales se calculen.
    tl.progress(1, true).progress(0, true); 
    
    // 10. Si se especifica, invierte la dirección de la animación.
    if (config.reversed) {
      tl.vars.onReverseComplete();
      tl.reverse();
    }
    return tl;
  }

  // --- Hook de React para ejecutar la lógica de la animación ---
  useEffect(() => {
    // 1. Inicia el bucle horizontal con los elementos del DOM.
    const tl = horizontalLoop(itemsRef.current, {
      repeat: -1,             // Repetición infinita.
      paddingRight: 30,       // Padding extra para que no haya saltos.
      reversed: reverse,      // Dirección de la marquesina.
    });

    // 2. Crea un observador para la interacción del scroll.
    Observer.create({
      // Se ejecuta cada vez que el usuario hace scroll vertical.
      onChangeY(self) {
        // Acelera o decelera la animación basándose en la dirección del scroll.
        let factor = 2.5;
        // Invierte el factor si la marquesina va en reversa o el scroll es hacia arriba.
        if ((!reverse && self.deltaY < 0) || (reverse && self.deltaY > 0)) {
          factor *= -1;
        }
        // 3. Crea una pequeña animación para la velocidad (timeScale).
        gsap
          .timeline({
            defaults: {
              ease: "none",
            },
          })
          // Acelera bruscamente.
          .to(tl, { timeScale: factor * 2.5, duration: 0.2, overwrite: true })
          // Vuelve suavemente a la velocidad normal.
          .to(tl, { timeScale: factor / 2.5, duration: 1 }, "+=0.3");
      },
    });
    // 4. Función de limpieza: detiene la animación cuando el componente se desmonta.
    return () => tl.kill();
  }, [items, reverse]); // Se vuelve a ejecutar si los items o la dirección cambian.

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