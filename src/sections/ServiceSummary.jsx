import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const ServiceSummary = () => {

  // Array que define los servicios y sus propiedades de animación.
  // Esta estructura centraliza la configuración, haciendo que añadir,
  // modificar o eliminar animaciones sea mucho más sencillo.
  const services = [
    { id: "#title-service-1", xPercent: 20 },
    { id: "#title-service-2", xPercent: -30 },
    { id: "#title-service-3", xPercent: 100 },
    { id: "#title-service-4", xPercent: -100 },
  ];

  useGSAP(() => {
    // Iteramos sobre el array de servicios para crear una animación para cada uno.
    // Esto evita repetir el mismo bloque de código `gsap.to()` para cada elemento.
    services.forEach((service) => {          // La animación va DESDE el estado inicial en el HTML/CSS HACIA el estado definido aquí.
      gsap.to(service.id, {                  // El selector del elemento a animar
        xPercent: service.xPercent,          // El porcentaje de movimiento horizontal (Estado final)
        scrollTrigger: {
          trigger: service.id,               // El elemento que dispara la animación al entrar en el viewport.
          scrub: true,                       // Vincula el progreso de la animación directamente con el scroll. 
        },
      });
    });
  });
  
  return (
    <section className="mt-20 overflow-hidden font-light leading-snug text-center mb-42 contact-text-responsive">
      <div id="title-service-1">
        <p>Architucture</p>
      </div>

      <div
        id="title-service-2"
        className="flex items-center justify-center gap-3 translate-x-16"
      >
        <p className="font-normal">Development</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p>Deployment</p>
      </div>

      <div
        id="title-service-3"
        className="flex items-center justify-center gap-3 -translate-x-48"
      >
        <p>APIs</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p className="italic">Frontends</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p>Scalability</p>
      </div>

      <div id="title-service-4" className="translate-x-48">
        <p>Databases</p>
      </div>
    </section>
  );
};

export default ServiceSummary;