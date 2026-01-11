import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { projects } from "../constants";
import { github } from "../assets";

const ProjectDetails = () => {
  const { id } = useParams();
  
  // Find project by matching name-slug or index. 
  // For simplicity, let's use the index passed in URL or name matching.
  // Assuming URL is /project/:id where id is the index.
  const project = projects[id];

  if (!project) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-white">
        Project not found.
      </div>
    );
  }

  return (
    <div className="relative z-0 bg-primary min-h-screen">
      {/* Hero Image */}
      <div className="w-full h-[50vh] relative">
         <img 
            src={project.image} 
            alt={project.name} 
            className="w-full h-full object-cover mask-gradient-bottom"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
         
         <div className="absolute bottom-10 left-0 w-full">
            <div className={`${styles.paddingX} max-w-7xl mx-auto`}>
                 <Link to="/" className="text-secondary hover:text-white mb-4 inline-block">&larr; Back to Home</Link>
                 <h1 className={`${styles.heroHeadText} text-white`}>{project.name}</h1>
            </div>
         </div>
      </div>

      <div className={`${styles.padding} max-w-7xl mx-auto`}>
        <div className="flex flex-col md:flex-row gap-10">
            {/* Left Content */}
            <div className="flex-[2]">
                <h2 className={`${styles.sectionHeadText} text-[30px]`}>Overview.</h2>
                <p className="mt-4 text-secondary text-[17px] leading-[30px]">
                    {project.description}
                </p>
                
                <h3 className="text-white font-bold text-[24px] mt-10">Challenges & Solutions</h3>
                <p className="mt-4 text-secondary text-[17px] leading-[30px]">
                    (Placeholder text for case study content. In a real scenario, this would come from the constants file.)
                    <br/><br/>
                    We faced significant challenges in... but overcame them by implementing...
                </p>
            </div>

            {/* Right Sidebar */}
            <div className="flex-1">
                <div className="bg-tertiary p-8 rounded-2xl shadow-card">
                    <h3 className="text-white font-bold text-[20px] mb-5">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2 mb-8">
                        {project.tags.map((tag) => (
                            <span key={tag.name} className={`px-3 py-1 rounded-full text-sm ${tag.color} bg-black-200`}>
                                #{tag.name}
                            </span>
                        ))}
                    </div>

                    <h3 className="text-white font-bold text-[20px] mb-5">Links</h3>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => window.open(project.source_code_link, "_blank")}
                            className="flex items-center gap-2 bg-black-100 hover:bg-black-200 text-white px-4 py-2 rounded-lg transition-colors border border-gray-700"
                        >
                            <img src={github} alt="github" className="w-5 h-5" />
                            Source Code
                        </button>
                        {/* Live Demo button if available */}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
