import type { IconType } from "react-icons";
import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaFigma,
  FaDocker,
} from "react-icons/fa";
import {
  FaLaptopCode,
  FaMobileScreenButton,
  FaServer,
  FaPenNib,
} from "react-icons/fa6";
import {
  SiJavascript,
  SiTypescript,
  SiRedux,
  SiTailwindcss,
  SiMongodb,
  SiThreedotjs,
  SiNextdotjs,
  SiExpo,
  SiHono,
  SiPostgresql,
  SiJetpackcompose,
} from "react-icons/si";
import {
  TbBrandReactNative,
  TbSql,
} from "react-icons/tb";

export const navLinks = [
  {
    id: "about",
    title: "About",
    link: "/#about",
  },
  {
    id: "work",
    title: "Work",
    link: "/#work",
  },
  {
    id: "prompts",
    title: "Prompts",
    link: "/#prompts",
  },
  {
    id: "contact",
    title: "Contact",
    link: "/#contact",
  },
  {
    id: "blog",
    title: "Blog",
    link: "/blog",
  },
];

export interface Service {
  title: string;
  icon: IconType;
}

const services: Service[] = [
  {
    title: "Web Developer",
    icon: FaLaptopCode,
  },
  {
    title: "React Native / Jetpack Compose",
    icon: FaMobileScreenButton,
  },
  {
    title: "Backend Developer",
    icon: FaServer,
  },
  {
    title: "Content Creator",
    icon: FaPenNib,
  },
];

export interface Technology {
  name: string;
  icon: IconType;
  color: string;
}

const technologies: Technology[] = [
  {
    name: "Next.js",
    icon: SiNextdotjs,
    color: "#0070F3",
  },
  {
    name: "React JS",
    icon: FaReact,
    color: "#61DAFB",
  },
  {
    name: "React Native",
    icon: TbBrandReactNative,
    color: "#61DAFB",
  },
  {
    name: "Expo",
    icon: SiExpo,
    color: "#5A32FB",
  },
  {
    name: "Jetpack Compose",
    icon: SiJetpackcompose,
    color: "#4285F4",
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    color: "#3178C6",
  },
  {
    name: "JavaScript",
    icon: SiJavascript,
    color: "#F7DF1E",
  },
  {
    name: "Node JS",
    icon: FaNodeJs,
    color: "#339933",
  },
  {
    name: "Hono",
    icon: SiHono,
    color: "#E36002",
  },
  {
    name: "PostgreSQL",
    icon: SiPostgresql,
    color: "#4169E1",
  },
  {
    name: "SQL",
    icon: TbSql,
    color: "#00758F",
  },
  {
    name: "MongoDB",
    icon: SiMongodb,
    color: "#47A248",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "#06B6D4",
  },
  {
    name: "Redux Toolkit",
    icon: SiRedux,
    color: "#764ABC",
  },
  {
    name: "Three JS",
    icon: SiThreedotjs,
    color: "#7A7ADB",
  },
  {
    name: "Docker",
    icon: FaDocker,
    color: "#2496ED",
  },
  {
    name: "Git",
    icon: FaGitAlt,
    color: "#F05032",
  },
  {
    name: "Figma",
    icon: FaFigma,
    color: "#F24E1E",
  },
  {
    name: "HTML 5",
    icon: FaHtml5,
    color: "#E34F26",
  },
  {
    name: "CSS 3",
    icon: FaCss3Alt,
    color: "#1572B6",
  },
];

export interface Experience {
  title: string;
  company_name: string;
  icon: string; // URL
  iconBg: string;
  date: string;
  points: string[];
}

const experiences: Experience[] = [
  {
    title: "React.js Developer",
    company_name: "Starbucks",
    icon: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
    iconBg: "#383E56",
    date: "March 2020 - April 2021",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "React Native Developer",
    company_name: "Tesla",
    icon: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
    iconBg: "#E6DEDD",
    date: "Jan 2021 - Feb 2022",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Web Developer",
    company_name: "Shopify",
    icon: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Shopify_Logo.png",
    iconBg: "#383E56",
    date: "Jan 2022 - Jan 2023",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Full stack Developer",
    company_name: "Meta",
    icon: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    iconBg: "#E6DEDD",
    date: "Jan 2023 - Present",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
];

export interface Testimonial {
  testimonial: string;
  name: string;
  designation: string;
  company: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

export interface Tag {
  name: string;
  color: string;
}

export interface Project {
  name: string;
  description: string;
  tags: Tag[];
  image: any; // Image asset
  source_code_link: string;
  link?: string;
}

import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export const socialLinks = [
  {
    name: "GitHub",
    icon: FaGithub,
    link: "https://github.com/Shubhjn4357",
    color: "dark:text-white text-black",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    link: "https://linkedin.com/in/shubham-jain-b46999135/",
    color: "text-blue-500",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    link: "https://instagram.com/shubh._jn/",
    color: "text-pink-500",
  },
];
const email = "shubhamjain.com.in@gmail.com";
export { services, technologies, experiences, testimonials, email };
