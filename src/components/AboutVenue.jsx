import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import style from '../pages/LandingStyle/style.module.css';
import GraphAni from '../../src/animations/graph.json';
import Lottie, { useLottieInteractivity } from 'lottie-react';
import { slideIn } from '../animations/anim';
export default function ListVenue() {

  const controls = useAnimation();
  const ref = useRef()
  const isInView = useInView(ref, { amount: 0.5 })




  const defaultAnimations = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
    }
  }
  const TextMotion1 = "How it works - CREATER"
  const TextMotion2 = "Step-2"

  return (
    <div id="listVenue" className={style.About} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className={style.columnContainer}>
        <motion.div className={style.columnLeft}  >
          <motion.span
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            aria-hidden
            transition={{ staggerChildren: 0.1 }}
            ref={ref}>
            {TextMotion1.split('').map((char, i) => (

              <motion.span key={i} variants={defaultAnimations} className={style.Heading2}>{char}</motion.span>

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
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={defaultAnimations}
            transition={{ delay: 0.5 }}>
            <ul>
              <li>1. REGISTER AN ACCOUNT - Set to be a venue manager</li>
              <li>2. CREATE YOUR VENUE</li>
              <li>3. TELL US ABOUT YOUR PLACE</li>
              <li>4. LET MILLIONS VIEW AND BOOK YOUR VENUE INSTANTLY</li>
              <li>5. Create memories</li>
            </ul>
          </motion.div>
        </motion.div>
        <motion.div className={style.columnRight}  >
          <Lottie
            controls={isInView}

            animationData={GraphAni}
            style={{ height: '100%', width: '100%', display: "flex" }}
            autoplay={true}
            loop={false}

            initialSegment={[0, 60]} // Play only from frame 0 to frame 90 (adjust as needed)
          />
        </motion.div>
      </div>
    </div>
  );
}
