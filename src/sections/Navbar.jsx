import { useEffect, useRef, useState } from "react";
import { socials } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-scroll";



const Navbar = () => {

  const navRef = useRef(null); 
  const linksRef = useRef([]);
  const contactRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const iconTl = useRef(null);          // No se usa para hacer referencia a un elemento del dom sino para guardar la instancia de la linea de tiempo GSAP
  const tl = useRef(null);              // Idem 
  const [isOpen, setIsOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(true);

  useGSAP(() => {
    gsap
      .set(navRef.current, { xPercent: 100 })         // Pone el <nav> completo 100% a la derecha, fuera de la pantalla.
    gsap
      .set([linksRef.current, contactRef.current], {  // Pone los links y la sección de contacto invisibles 
        autoAlpha: 0,                                 // con autoAlpha: 0
        x: -20,                                       // y ligeramente desplazados a la izquierda x:-20
      })
    
    tl.current = gsap
      .timeline({ paused: true })                     // La timeline se crea pausada.
 
      .to(navRef.current, {                           // 1. Anima el menú para que entre en la pantalla
        xPercent: 0,                                  // Lo mueve de xPercent: 100 a xPercent: 0
        duration: 1,
        ease: "power3.out"
      })

      .to(linksRef.current, {                         // 2. Anima los links para que aparezcan
        autoAlpha: 1,                                 // Los hace visibles
        x: 0,                                         // Los mueve a su posición final
        stagger: 0.1,                                 // Anima cada link con 0.1s de retraso
        duration: 0.5,
        ease: "power2.out",
      },
        "<"                                           // Parámetro de posición: empieza al mismo tiempo que la animación anterior
      )

      .to(contactRef.current, {                       // 3. Anima la sección de contacto para que aparezca
        autoAlpha: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out"
      },
        "<+0.2"                                       // Parámetro de posición: empieza 0.2s después del inicio de la timeline
      );

    iconTl.current = gsap
      .timeline({ paused: true })
      .to(topLineRef.current, {
        rotate: 45,                                   // Gira la línea 45 grados en sentido horario
        y: 3.3,                                       // La mueve 3.3px hacia abajo
        duration: 0.3,
        ease: "power2.inOut",
      })
      .to(
        bottomLineRef.current,
        {
          rotate: -45,                                 // Gira la línea 45 grados en sentido anti-horario.
          y: -3.3,                                     // La mueve 3.3px hacia arriba
          duration: 0.3,
          ease: "power2.inOut",
        },
        "<"                          // Inicia esta animación de la línea inferior al mismo tiempo 
      );
  },[]);

  useEffect(() => {
    let lastScrollY = window.scrollY;                                      // Crea una variable para almacenar la posición vertical del scroll en el momento en que el componente se carga.
    const handleScroll = () => {                                           // Esta función se ejecutara cada vez que el usuario haga scroll
      const currentScrollY = window.scrollY;                               // Obtiene la posición actual del scroll

      setShowBurger(                                                       // Establece el estado de showBurger en true si:
        currentScrollY <= lastScrollY ||                                   // Si el usuario está desplazándose hacia arriba.
        currentScrollY < 10                                                // O si el usuario está en la parte superior de la página.
      ); 

      lastScrollY = currentScrollY;                                        // Actualiza la variable lastScrollY con la posición actual del scroll.
    };
    window.addEventListener("scroll", handleScroll, {                      // Añade un event listener para el evento scroll
      passive: true,
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    if (isOpen) {
      tl.current.reverse();   // Reproduce la línea de tiempo en reversa, ocultando el menú 
      iconTl.current.reverse();
    } else {
      tl.current.play();      // Reproduce la línea de tiempo hacia adelante, 
      iconTl.current.play();
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav
        ref={navRef}
        className='fixed z-50 flex flex-col justify-between w-full h-full px-10 uppercase bg-black text-white/80 py-28 gap-y-10 md:w-1/2 md:left-1/2'
      >
        <div className="flex flex-col text-5xl gap-y-2 md:text-6xl lg:text-8xl">
          {["home", "services", "about", "work", "contact"].map(
            (section, index) => (
              <div 
                key={index} 
                ref={(el) => (linksRef.current[index] = el)}>
                <Link
                  to={`${section}`}
                  spy={true}
                  smooth
                  offset={0}
                  duration={2000}
                  activeClass="text-yellow-500" // Esta clase se aplicará cuando el link esté activo
                  className="tansition-all duration-300 cursor-pointer hover:text-white"
                >
                  {section}
                </Link>
              </div>
          ))}
        </div>

        <div
          ref={contactRef}
          className="flex flex-col flex-wrap justify-between gap-8 md:flex-row"
        >
          <div className="font-light">
            <p className="tracking-wider text-white/50">Email</p>
            <p className="text-xl tracking-widest lovercase text-pretty">JohnDoe@gmail.com</p>
          </div>

          <div className="font-light">
            <p className="tracking-wider text-white/50">Social Media</p>
            <div className="flex flex-col flex-wrap md:flex-row gap-x-2">
              {socials.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  className="text-sm leading-loose tracking-widest uppercase hover:text-white transition-colors duration-300"  
                >
                  {"{ "}
                  {social.name}
                  {" }"}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div
        onClick={toggleMenu} 
        className="fixed top-4 right-10 z-50 flex flex-col items-center justify-center gap-1 transition-all duration-300 bg-black rounded-full cursor-pointer w-14 h-14 md:w-20 md:h-20"
        style={
          showBurger
            ? { clipPath: "circle(50% at 50% 50%)" } // Muestra un círculo completo, revelando el botón.
            : { clipPath: "circle(0% at 50% 50%)" }  // Muestra un círculo de radio 0, ocultando el botón.
        }
      >
        <span ref={topLineRef} className="block w-8 h-0.5 bg-white rounded-full origin-center"></span>
        <span ref={bottomLineRef} className="block w-8 h-0.5 bg-white rounded-full origin-center"></span>
      </div>
    </>
  )
}

export default Navbar