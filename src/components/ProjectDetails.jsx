'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { projects } from "../constants";
import { github } from "../assets";

const ProjectDetails = ({ id }) => {
  // id is passed from the parent page component
  const staticProject = projects[id];
  const [project, setProject] = React.useState(staticProject);
  const [loading, setLoading] = React.useState(Boolean(staticProject?.source_code_link));

  // Determine if we have a valid GitHub URL to fetch from
  const githubUrl = staticProject?.source_code_link;
  const isGithubRepo = githubUrl && githubUrl.includes("github.com");

  React.useEffect(() => {
    if (!staticProject || !isGithubRepo) {
      setLoading(false);
      return;
    }

    const fetchRepoData = async () => {
      try {

        const urlParts = githubUrl.split("/");
        const owner = urlParts[urlParts.length - 2];
        const repoName = urlParts[urlParts.length - 1];

        if (!owner || !repoName) throw new Error("Invalid GitHub URL");

        // 1. Fetch Repository Details
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
        if (!repoRes.ok) throw new Error("Failed to fetch repo data");
        const repoData = await repoRes.json();

        // 2. Fetch README to find an image
        // Try getting the default branch first
        const defaultBranch = repoData.default_branch || 'main';
        const readmeRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repoName}/${defaultBranch}/README.md`);
        let fetchedImage = null;

        if (readmeRes.ok) {
          const readmeText = await readmeRes.text();
          // Regex to find markdown image: ![]()
          // Capture the URL inside parentheses
          const mdImageMatch = readmeText.match(/!\[.*?\]\((.*?)\)/);
          // Regex to find HTML image: <img src="..." />
          const htmlImageMatch = readmeText.match(/<img[^>]+src=["'](.*?)["']/);

          let imageUrl = mdImageMatch ? mdImageMatch[1] : (htmlImageMatch ? htmlImageMatch[1] : null);

          if (imageUrl) {
            // If it's a relative path, construct the full raw URL
            if (!imageUrl.startsWith('http')) {
              // Remove leading ./ or /
              const cleanPath = imageUrl.replace(/^(\.\/|\/)/, '');
              fetchedImage = `https://raw.githubusercontent.com/${owner}/${repoName}/${defaultBranch}/${cleanPath}`;
            } else {
              fetchedImage = imageUrl;
            }
          }
        }

        // Map colors to topics randomly or possibly based on hash for consistency (or just keep static colors for now)
        // We will just use a default color for new tags since we don't have a map for every possible tech
        const colors = ['blue-text-gradient', 'green-text-gradient', 'pink-text-gradient', 'orange-text-gradient', 'violet-text-gradient'];

        const newTags = repoData.topics ? repoData.topics.map((topic, index) => ({
          name: topic,
          color: colors[index % colors.length]
        })) : staticProject.tags;

        setProject(prev => ({
          ...prev,
          name: repoData.name || prev.name, // Use repo name or fallback
          // If repo description is null, fallback to static
          description: repoData.description || prev.description,
          tags: newTags.length > 0 ? newTags : prev.tags,
          image: fetchedImage || prev.image
        }));

      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        // Fallback is already set as initial state
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, [githubUrl, staticProject, isGithubRepo]);

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
        <div className="w-full h-full relative">
          {/* If fetching, show a slight loading state or skeleton? For now just show fallback image until loaded */}
          <Image
            src={project.image}
            alt={project.name} 
            fill
            className="object-cover mask-gradient-bottom"
            priority
          />
        </div>
         <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
         
         <div className="absolute bottom-10 left-0 w-full">
            <div className={`${styles.paddingX} max-w-7xl mx-auto`}>
            <Link href="/" className="text-secondary hover:text-white mb-4 inline-block">&larr; Back to Home</Link>
            <h1 className={`${styles.heroHeadText} text-white relative`}>
              {loading ? "Loading..." : project.name}
            </h1>
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
                  className="flex items-center gap-2 bg-black-100 hover:bg-black-200 text-white px-4 py-2 rounded-lg transition-colors border border-gray-700 w-full justify-center"
                        >
                  <div className="relative w-5 h-5">
                    <Image src={github} alt="github" fill className="object-contain" />
                  </div>
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
