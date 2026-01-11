<<<<<<< HEAD
import { motion } from "framer-motion";

import { styles } from "../styles";
import { PlannetCanvas } from "./canvas";
import {shubh} from '../assets/index';
import Typist from "./Typist";
import { Tilt } from "react-tilt";
const Hero = () => {
  return (
    <section className={`relative w-full h-screen mx-auto`}>

      <div
        className={`absolute inset-0 top-[120px] z-2 max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      > 
        
        <div className="flex flex-row">
          <div className='flex flex-col justify-center items-center mt-5'>
            <div className='w-5 h-5 rounded-full violet-gradient' />
            <div className='w-1 sm:h-80 h-40 violet-gradient' />
          </div>

          <div className='ml-4'>
            <h1 className={`${styles.heroHeadText} `}>
              Hi, I'm&nbsp; <span className='text-secondary dark:text-dark-text-secondary'><Typist words={['Shubham']} delay={250} /></span>
            </h1>
            <p className={`${styles.heroSubText} mt-2 text-text-primary dark:text-dark-text-primary`}>
              I develop &nbsp; <span className='font-black text-accent-primary dark:text-dark-accent-primary'>
                  <Typist words={['User Interface','UI/UX','Web App','Web Pages','FullStack App']} delay={1000} loop={true}/>
                </span>
            </p>
          </div>
        </div>
        <div className='hidden ms-auto sm:flex'>
          <Tilt className='xs:w-[250px] w-full'>
            <img className="rounded-full h-[16rem] w-[16rem] sky-gradient object-cover" src={shubh} alt='profile-photo'/>
          </Tilt>
        </div>
      </div>
      
        <PlannetCanvas />
      
      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center z-2'>
        <a href='#about'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
=======
import { useRef, useEffect } from "react";
import { styles } from "../styles";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const Hero = () => {
  const nameRef = useRef(null);
  const roleRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Vibrant Glow Animation
    tl.fromTo(nameRef.current,
      { opacity: 0, scale: 0.5, textShadow: "0 0 0px #bc13fe" },
      { opacity: 1, scale: 1, duration: 1.5, textShadow: "0 0 20px #bc13fe" }
    )
      // Type out role
      .to(roleRef.current, {
        duration: 1.5,
        text: "Creative Developer & UI/UX Designer",
        delay: 0.2,
        ease: "none",
      });

  }, []);

  return (
    <section className="relative w-full h-screen mx-auto flex flex-col justify-center items-center overflow-hidden">

      <div className={`${styles.paddingX} max-w-7xl w-full mx-auto flex flex-col items-start z-10`}>

        <div className="flex flex-col font-sans">
          <p className={`${styles.heroSubText} text-neon-blue`}>Hi, I'm</p>

          <h1 className={`${styles.heroHeadText} text-[var(--text-main)] relative inline-block`}>
            <span ref={nameRef} className="gradient-text">Shubham</span>
          </h1>

          <p ref={roleRef} className={`${styles.heroSubText} mt-4 text-secondary h-8`}>
            {/* Role gets typed here */}
          </p>
        </div>

      </div>

      {/* Scroll indicator with neon glow */}
      <div className="absolute bottom-10 w-full flex justify-center items-center scroll-indicator">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2 shadow-neon">
            <div className="w-3 h-3 rounded-full bg-secondary mb-1 animate-bounce" />
>>>>>>> 9d330505 (refactorise whole app)
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
