'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { projects, Tag } from "../constants";
import { github } from "../assets";
import { useProjectDetails } from "../hooks/useProjectDetails";
import { ProjectDetailsSkeleton } from "./ui/Skeleton";

interface ProjectDetailsProps {
  id: string | number;
  repoUrl?: string;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ id, repoUrl }) => {
  const projectIndex = typeof id === 'string' ? parseInt(id, 10) : id;
  const staticProject = projects[projectIndex] || null;

  const { project, loading } = useProjectDetails(repoUrl, staticProject);

  if (loading) {
    return <ProjectDetailsSkeleton />;
  }

  if (!project) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Link href="/" className="text-neon-blue hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-0 bg-primary min-h-screen">
      {/* Hero Image */}
      <motion.div
        className="w-full h-[50vh] relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full h-full relative">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover mask-gradient-bottom"
            priority
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />

        <div className="absolute bottom-10 left-0 w-full">
          <div className={`${styles.paddingX} max-w-7xl mx-auto`}>
            <Link href="/" className="text-secondary hover:text-white mb-4 inline-block transition-colors">
              &larr; Back to Home
            </Link>
            <motion.h1
              className={`${styles.heroHeadText} text-white relative`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {project.name}
            </motion.h1>
          </div>
        </div>
      </motion.div>

      <motion.div
        className={`${styles.padding} max-w-7xl mx-auto`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left Content */}
          <div className="flex-[2]">
            <h2 className={`${styles.sectionHeadText} text-[30px]`}>Overview.</h2>
            <p className="mt-4 text-secondary text-[17px] leading-[30px]">
              {project.description}
            </p>

            <h3 className="text-white font-bold text-[24px] mt-10">Challenges & Solutions</h3>
            <p className="mt-4 text-secondary text-[17px] leading-[30px]">
              This project demonstrates advanced problem-solving and modern development practices.
              <br /><br />
              Built with a focus on performance, scalability, and user experience.
            </p>
          </div>

          {/* Right Sidebar */}
          <div className="flex-1">
            <div className="bg-tertiary p-8 rounded-2xl shadow-card">
              <h3 className="text-white font-bold text-[20px] mb-5">Tech Stack</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag: Tag) => (
                  <span key={tag.name} className={`px-3 py-1 rounded-full text-sm ${tag.color} bg-black-200`}>
                    #{tag.name}
                  </span>
                ))}
              </div>

              <h3 className="text-white font-bold text-[20px] mb-5">Links</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => window.open(project.source_code_link, "_blank")}
                  className="flex items-center gap-2 bg-black-100 hover:bg-black-200 text-white px-4 py-2 rounded-lg transition-colors border border-gray-700 w-full justify-center"
                >
                  <div className="relative w-5 h-5">
                    <Image src={github} alt="github" fill className="object-contain" />
                  </div>
                  Source Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetails;

