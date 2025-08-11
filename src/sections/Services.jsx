import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { servicesData } from "../constants";
import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Services = () => {

  const text = `I build secure, high-performance full-stack apps
    with smooth UX to drive growth 
    not headaches.`;
  const serviceRefs = useRef([]);                         // Su propósito es guardar una referencia a cada una de las tarjetas de servicio.                        
  const isDesktop = useMediaQuery({ minWidth: "48rem" }); // 768px

  useGSAP(() => {
    
    serviceRefs.current.forEach((el) => {                 // Itera sobre cada tarjeta de servicio para aplicarle una animación de entrada.
      if (!el) return;                                    // Guarda para evitar errores si un elemento no existe.

      gsap.from(el, {                                     // Anima cada tarjeta   
        y: 200,                                           // DESDE una posición 200px más abajo HACIA su posición final.
        
        scrollTrigger: {                                  // La animación se dispara con el scroll.
          trigger: el,                                    // El disparador es la propia tarjeta.
          start: "top 80%",                               // La animación empieza cuando el 80% superior de la tarjeta es visible.
        },
        duration: 1,
        ease: "circ.out",
      });
    });
  }, []);                                                 // El array vacío asegura que esto solo se ejecute una vez.

  return (
    <section 
      id="services" 
      className="min-h-screen bg-black rounded-t-4xl"
    >
      {/* Componente de cabecera que se anima al hacer scroll hasta él */}
      <AnimatedHeaderSection
        subTitle={"Behind the scene, Beyond the screen"}
        title={"Service"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true} // <-- Prop clave para activar la animación por scroll.
      />
      {/* Mapea los datos de los servicios para crear las tarjetas */}
      {servicesData.map((service, index) => (
        <div
          ref={(el) => (serviceRefs.current[index] = el)} // Por cada servicio se crea una referencia
          key={index}
          // La clase 'sticky' es la base del efecto de apilamiento.
          className="sticky px-10 pt-6 pb-12 text-white bg-black border-t-2 border-white/30"
          style={
            isDesktop
              ? {
                // Cada tarjeta se "pega" (sticky) un poco más abajo que la anterior, creando el apilamiento.
                // Top define donde se "pega". 10vh es la base para index=0 -> se pegará a un 10% de la altura del viewport
                // ${index * 5}em: Esta es la parte que cambia. Por cada tarjeta nueva, se añaden 5em adicionales a la distancia top.
                top: `calc(10vh + ${index * 5}em)`,
                // Se añade margen inferior para dar espacio de scroll y que el efecto funcione.
                marginBottom: `${(servicesData.length - index - 1) * 5}rem`,
              }
              : { top: 0 } // En móvil, no hay efecto de apilamiento.
          }
        >
          <div className="flex items-center justify-between gap-4 font-light">
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl lg:text-5xl">{service.title}</h2>
              <p className="text-xl leading-relaxed tracking-widest lg:text-2xl text-white/60 text-pretty">
                {service.description}
              </p>
              <div className="flex flex-col gap-2 text-2xl sm:gap-4 lg:text-3xl text-white/80">
                {service.items.map((item, itemIndex) => (
                  <div key={`item-${index}-${itemIndex}`}>
                    <h3 className="flex">
                      <span className="mr-12 text-lg text-white/30">
                        0{itemIndex + 1}
                      </span>
                      {item.title}
                    </h3>
                    {itemIndex < service.items.length - 1 && (
                      <div className="w-full h-px my-2 bg-white/30" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Services;
