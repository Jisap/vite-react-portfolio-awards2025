import { useRef } from "react"
import AnimatedTextLines from "../components/AnimatedTextLines";


const Hero = () => {

  const contextRef = useRef(null);
  const headerRef = useRef(null);

  const aboutText = `I help growing brands and startups gain an 
  unfair advantage through 
  premium results driven webs/apps`

  return (
    <section 
      id="home"
      className="flex flex-col justify-end min-h-screen" 
    >
      <div ref={contextRef}>
        <div style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
          <div
            ref={headerRef} 
            className="flex flex-col justify-center gap-12 pt-16 sm:gap-16"
          >
            <p className="text-sm font-light tracking-[0.5rem] uppercase px-10 text-black">
              404 No Bugs Found
            </p>
            <div className="px-10">
              <h1 className="flex flex-col gap-12 text-black uppercase banner-text-responsive sm:gap-16 md:block mb-1">
                Jisap Dev
              </h1>
            </div>
          </div>
        </div>

        <div className="relative px-10 text-black">
          <div className="absolute inset-x-0 border-t-2"/>
          <div className="py-12 sm:py-16 text-end">
            <AnimatedTextLines 
              className="font-light uppercase value-text-responsive" 
              text={aboutText}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero