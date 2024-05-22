import style from './LandingStyle/style.module.css'
import { useEffect, useRef } from 'react';
import Lottie from 'lottie-react'
import { motion, useInView, useAnimation } from 'framer-motion'
import ContractAni from '../../src/animations/house2.json'
import { perspective } from '../animations/anim';
import { Globe, Handshake, LockIcon } from 'lucide-react';

export default function About() {
  const mainControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });





  const aboutVariant = {
    hidden: { opacity: 0, x: '-100%' },
    visible: { opacity: 1, x: 0, transition: { duration: 1 } }
  };

  const TextVariant = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0, transition: { duration: 1 } }
  };

  const defaultAnimations = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
    }
  }
  const TextMotion1 = "How it works - RENTER"
  const TextMotion2 = "Step-1"
  return (
    <motion.div
      className={style.About}

      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <motion.div className={style.columnContainer}





      >
        <motion.div className={style.columnLeft}
        >
          <Lottie animationData={ContractAni} style={{ height: '100%', width: '100%' }} />
        </motion.div>
        <motion.div className={style.columnRight}

        >
          <motion.span

            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            aria-hidden
            transition={{ staggerChildren: 0.1 }}
            ref={ref}
          >
            {TextMotion1.split('').map((char, i) => (

              <motion.span key={i} variants={defaultAnimations} className={style.Heading}>{char}</motion.span>

            ))}</motion.span>

          <motion.div>
            <motion.span

              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              aria-hidden
              transition={{ staggerChildren: 0.1, }}
              ref={ref}
            >
              {TextMotion2.split('').map((char, i) => (

                <motion.span key={i} variants={defaultAnimations} className="">{char}</motion.span>

              ))}</motion.span>
          </motion.div>

          <p className='opacity-65'>We strive to be easy and give you the best deals out there. Book your vaction today!</p>
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={defaultAnimations}
            transition={{ delay: 0.5 }}>
            <ul>
              <li>1. REGISTER AN ACCOUNT</li>
              <li>2. FIND YOUR VENUE</li>
              <li>3. SET A DATE AND HOW MANY PEOPLE</li>
              <li>4. Easy overview and Booking conformation instantly</li>
              <li>5. Create memories</li>
            </ul>
          </motion.div>


          <div className={style.CircleCon}>
            <div className={style.Circle}>
              <div className={style.Holder}>
                <span className=''>Fast and secure</span>
                <LockIcon strokeWidth={1.2} />
              </div>
            </div>
            <div className={style.Circle}>
              <div className={style.Holder}>
                <span className=''>Great rates guaranteed!</span>
                <Handshake strokeWidth={1.2} />
              </div>
            </div>
            <div className={style.Circle}>
              <div className={style.Holder}>
                <span className=''>Modern  platform</span>
                <Globe strokeWidth={1.2} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
