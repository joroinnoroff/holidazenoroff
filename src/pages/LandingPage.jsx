import { useEffect, useRef, useState } from 'react';
import About from './About';
import style from './LandingStyle/style.module.css';
import { motion, useAnimation, useInView, useIsPresent } from 'framer-motion';
import ListVenue from '../components/AboutVenue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();
  const textRef = useRef(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    // Function to randomize the initial position of each letter
    const randomizeInitialPosition = () => {
      if (textRef.current) {
        const letters = textRef.current.children;
        Array.from(letters).forEach((letter, index) => {
          const randomX = Math.random() * 200 - 100; // Adjust randomness as per requirement
          const randomY = Math.random() * 200 - 100;
          controls.set(letter, { x: randomX, y: randomY, opacity: 0 });
          // Stagger animation for each letter on load
          controls.start({
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration: 1, delay: index * 0.05 }
          });
        });
      }
    };

    // Randomize initial positions and animate on load
    randomizeInitialPosition();

    // Function to handle scroll animation
    const handleScrollAnimation = () => {
      // Reset positions and opacity on scroll
      if (textRef.current) {
        const letters = textRef.current.children;
        Array.from(letters).forEach((letter, index) => {
          controls.start({
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration: 1, delay: index * 0.05 }
          });
        });
      }
    };

    // Initial setup for scroll animation
    window.addEventListener('scroll', handleScrollAnimation);
    return () => window.removeEventListener('scroll', handleScrollAnimation);
  }, [controls]);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % differentWords.length);
    }, 2000); // Change the interval as needed

    return () => clearInterval(interval);
  }, []);


  const words = 'HOLIDAZE';

  const differentWords = ['experiences', 'memories', 'connections', 'friendships']


  return (
    <div>
      <div className={style.Container}>
        <video className={style.Video} autoPlay loop muted src='/assets/holidazeloop1.mp4'></video>
        <div className={style.TextOverlay}>
          <motion.span data-scroll-speed="0.3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={textRef} className={style.LOGO}
            style={{
              background: 'linear-gradient(45deg, rgba(251, 251, 251, 0.645) 0%, rgba(255, 255, 255, 0.775) 10%, rgba(191, 33, 98, 25) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: '#BF0362',
              fontWeight: 'bold'
            }}>
            {words.split('').map((char, index) => (
              <motion.span
                key={index}
                style={{
                  display: 'inline-block',
                  transformOrigin: 'center',
                  fontSize: 'inherit'
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 75 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h2>Creating <span className='text-black mx-2'>{differentWords[currentWordIndex]} </span>since 2023</h2>
          </motion.div>
        </div>
      </div>
      <motion.div


      >
        <About />
      </motion.div>
      <motion.div


      >
        <ListVenue />
      </motion.div>
    </div>
  );
}
