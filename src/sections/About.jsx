import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import AnimatedTextLines from "../components/AnimatedTextLines";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";

const About = () => {

  // Texto para la cabecera animada.
  const text = `Passionate about clean architecture
    I build scalable, high-performance solutions
    from prototype to production`;

  // Texto principal de la sección, que se animará línea por línea.
  const aboutText = `Obsessed with building fast, intuitive apps—from pixel-perfect React UIs to bulletproof serverless backends. Every line of code is a promise: quality that users feel.
  When I’m not shipping:
⚡️ Open-sourcing my latest experiment (or hacking on yours)
🎥 Teaching devs on Twitch/YouTube—because rising tides lift all ships
🧗 Rock climbing (problem-solving with real stakes)
🎸 Strumming chords while CI pipelines pass (multitasking at its finest)`;

  const imgRef = useRef(null);

  useGSAP(() => {
    // Animación 1: Escala toda la sección a medida que el usuario hace scroll.
    gsap.to("#about", {
      scale: 0.95,                // Reduce el tamaño de la sección al 95%.
      scrollTrigger: {
        trigger: "#about",        // El disparador es la propia sección.
        start: "bottom 80%",      // La animación comienza cuando el 80% inferior de la sección es visible.
        end: "bottom 20%",        // La animación termina cuando el 20% inferior es visible.
        scrub: true,              // Vincula el progreso de la animación directamente con la posición del scroll.
        markers: false,           // Desactiva los marcadores de depuración de ScrollTrigger.
      },
      ease: "power1.inOut",
    });

    // Animación 2: Revela la imagen con un efecto de "wipe" o "cortinilla".
    // Primero, se establece el estado inicial de la imagen: completamente oculta.
    gsap.set(imgRef.current, {
      // clip-path define una máscara. Este polígono es una línea en la parte inferior, por lo que la imagen no es visible.
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    // Luego, se anima la imagen para que sea completamente visible.
    gsap.to(imgRef.current, {
      // Se anima el clip-path a un polígono que cubre toda el área de la imagen, revelándola.
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 2,
      ease: "power4.out",
      scrollTrigger: { trigger: imgRef.current }, // La animación se dispara cuando la imagen entra en el viewport.
    });
  });

  return (
    // La sección tiene un ID para ser el objetivo de la animación de escala y la navegación.
    <section id="about" className="min-h-screen bg-black rounded-b-4xl">
      <AnimatedHeaderSection
        subTitle={"Cod with purpose, Built to scale"}
        title={"About"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true} // Activa la animación de scroll para la cabecera.
      />
      <div className="flex flex-col items-center justify-between gap-16 px-10 pb-16 text-xl font-light tracking-wide lg:flex-row md:text-2xl lg:text-3xl text-white/60">
        <img
          ref={imgRef}
          src="images/man.jpg"
          alt="man"
          className="w-md rounded-3xl"
        />
        {/* Componente que anima el texto 'aboutText' línea por línea. */}
        <AnimatedTextLines text={aboutText} className={"w-full"} />
      </div>
    </section>
  )
}

export default About