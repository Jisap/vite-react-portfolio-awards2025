import { Icon } from '@iconify-icon/react/dist/iconify.js';
import React, { useRef } from 'react'

const Marquee = ({
  items, 
  className="text-white bg-black",
  icon = "mdi:star-four-points",
  iconClassName = "",
  reverse = false,
}) => {

  const containerRef = useRef(null);
  const itemsRef = useRef([]);

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