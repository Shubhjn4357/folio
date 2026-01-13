'use client';

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <motion.div
    variants={fadeIn("right", "spring", index * 0.5, 0.75)}
    className='xs:w-[250px] w-full p-[1px] rounded-[20px] shadow-card transition-all duration-300'
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 3 + index, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
  >
    <div
      className='glass-panel rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col hover:border-neon-blue/50 transition-colors'
    >
      <div className="relative w-16 h-16">
        <Image
          src={icon}
          alt={title}
          fill
          className='object-contain'
        />
      </div>

      <h3 className='text-[var(--text-main)] text-[20px] font-bold text-center'>
        {title}
      </h3>
    </div>
  </motion.div>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-[var(--secondary)] text-[17px] max-w-3xl leading-[30px]'
      >
        I'm a skilled software developer with experience in TypeScript and
        JavaScript, and expertise in frameworks like React, Node.js, and
        Three.js. I'm a quick learner and collaborate closely with clients to
        create efficient, scalable, and user-friendly solutions that solve
        real-world problems. Let's work together to bring your ideas to life!
      </motion.p>

      <div className='mt-20 flex flex-wrap justify-center gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
