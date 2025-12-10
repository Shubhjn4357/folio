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
              Hi, I'm&nbsp; <span className='text-secondary'><Typist words={['Shubham']} delay={250}/></span>
            </h1>
            <p className={`${styles.heroSubText} mt-2 text-white-100`}>
              I develop &nbsp; <span className='font-black text-blue-600'>
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
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
