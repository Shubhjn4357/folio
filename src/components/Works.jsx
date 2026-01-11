import React from "react";
<<<<<<< HEAD
import {Tilt} from "react-tilt";
=======

>>>>>>> 9d330505 (refactorise whole app)
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  link,
  source_code_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
<<<<<<< HEAD
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-elevated dark:bg-dark-elevated p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[230px]' onClick={() => window.open(link, "_blank")}>
=======

      <div
        className='glass-panel p-5 rounded-2xl sm:w-[360px] w-full shadow-card hover:shadow-neon transition-all duration-300 cursor-pointer overflow-hidden group'
        onClick={() => window.location.href = `/project/${index}`}
      >
        <div className='relative w-full h-[230px]'>
>>>>>>> 9d330505 (refactorise whole app)
          <img
            src={image}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            <div
              onClick={() => window.open(source_code_link, "_blank")}
<<<<<<< HEAD
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
=======
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer border border-secondary'
>>>>>>> 9d330505 (refactorise whole app)
            >
              <img
                src={github}
                alt='source code'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
          </div>
        </div>

        <div className='mt-5'>
<<<<<<< HEAD
          <h3 className='text-secondary dark:text-dark-text-secondary font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-text-secondary dark:text-dark-text-secondary text-[14px]'>{description}</p>
=======
          <h3 className='text-[var(--text-main)] font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-[var(--secondary)] text-[14px]'>{description}</p>
>>>>>>> 9d330505 (refactorise whole app)
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
<<<<<<< HEAD
      </Tilt>
=======
      </div>
>>>>>>> 9d330505 (refactorise whole app)
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
<<<<<<< HEAD
          className='mt-3 text-text-secondary dark:text-dark-text-secondary text-[17px] max-w-3xl leading-[30px]'
=======
          className='mt-3 text-[var(--secondary)] text-[17px] max-w-3xl leading-[30px]'
>>>>>>> 9d330505 (refactorise whole app)
        >
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "project");
