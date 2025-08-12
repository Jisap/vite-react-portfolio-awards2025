import React, { useRef } from 'react'

const ContactSummary = () => {

  const conainerRef = useRef(null);

  return (
    <section 
      ref={conainerRef}
      className='flex flex-col items-center justify-between min-h-screen gap-12 mt-16'
    >
      {/* Marquee */}
      <div className='overflow-hidden font-light text-center contact-text-responsive'>
        <p>
          " Let's build a <br />
          <span className='font-normal'>memorable</span> &{" "}
          <span className='italic'>inspiring</span> <br/>
          web application <span className='text-gold'>together</span> "
        </p>
      </div>
    </section>
  )
}

export default ContactSummary