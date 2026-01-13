'use client';

import React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects as staticProjects, Tag } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { useGitHubRepos } from "../hooks/useGitHubRepos";
import { ProjectCardSkeleton } from "./ui/Skeleton";

const GITHUB_USERNAME = "Shubhjn4357";

interface ProjectCardProps {
  index: number;
  name: string;
  description: string;
  tags: Tag[];
  image: string;
  source_code_link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  const router = useRouter();

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <div
        className='glass-panel p-5 rounded-2xl sm:w-[360px] w-full shadow-card hover:shadow-neon transition-all duration-300 cursor-pointer overflow-hidden group'
        onClick={() => router.push(`/project/${index}?repo=${encodeURIComponent(source_code_link)}`)}
      >
        <div className='relative w-full h-[230px]'>
          <Image
            src={image}
            alt='project_image'
            fill
            className='object-cover rounded-2xl'
            unoptimized
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            <div
              onClick={(e) => {
                e.stopPropagation();
                window.open(source_code_link, "_blank");
              }}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer border border-secondary relative'
            >
              <Image
                src={github}
                alt='source code'
                fill
                className='object-contain p-2'
              />
            </div>
          </div>
        </div>

        <div className='mt-5'>
          <h3 className='text-[var(--text-main)] font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-[var(--secondary)] text-[14px] line-clamp-3'>{description}</p>
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
      </div>
    </motion.div>
  );
};

const Works: React.FC = () => {
  const { projects, loading } = useGitHubRepos(GITHUB_USERNAME, 6, staticProjects);

  return (
    <>
      <motion.div variants={textVariant(0)}>
        <p className={`${styles.sectionSubText} `}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-[var(--secondary)] text-[17px] max-w-3xl leading-[30px]'
        >
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7'>
        {loading ? (
          // Show skeleton cards while loading
          <>
            {[...Array(6)].map((_, index) => (
              <ProjectCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        ) : (
          projects.map((project, index) => (
            <ProjectCard
              key={`project-${index}`}
              index={index}
              name={project.name}
              description={project.description}
              tags={project.tags}
              image={typeof project.image === 'string' ? project.image : '/placeholder-project.svg'}
              source_code_link={project.source_code_link}
            />
          ))
        )}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "project");


