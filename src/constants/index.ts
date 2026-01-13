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
  SiJavascript,
  SiTypescript,
  SiRedux,
  SiTailwindcss,
  SiMongodb,
  SiThreedotjs,
} from "react-icons/si";

import {
  mobile,
  backend,
  creator,
  web,
  tododapp,
  mtv,
  spotify,
  insta,
  linkdin,
  github,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

export interface Service {
  title: string;
  icon: any; // Image asset
}

const services: Service[] = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

export interface Technology {
  name: string;
  icon: any; // React Icon component
  color: string;
}

const technologies: Technology[] = [
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
  {
    name: "JavaScript",
    icon: SiJavascript,
    color: "#F7DF1E",
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    color: "#3178C6",
  },
  {
    name: "React JS",
    icon: FaReact,
    color: "#61DAFB",
  },
  {
    name: "Redux Toolkit",
    icon: SiRedux,
    color: "#764ABC",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "#06B6D4",
  },
  {
    name: "Node JS",
    icon: FaNodeJs,
    color: "#339933",
  },
  {
    name: "MongoDB",
    icon: SiMongodb,
    color: "#47A248",
  },
  {
    name: "Three JS",
    icon: SiThreedotjs,
    color: "#FFFFFF",
  },
  {
    name: "git",
    icon: FaGitAlt,
    color: "#F05032",
  },
  {
    name: "figma",
    icon: FaFigma,
    color: "#F24E1E",
  },
  {
    name: "docker",
    icon: FaDocker,
    color: "#2496ED",
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

const projects: Project[] = [
  {
    name: "Todo DApp",
    description:
      "A decentralized todo application built on the blockchain, allowing users to create tasks that are permanently stored and verifiable.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "solidity",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: tododapp,
    link: 'https://todo-d-app-iota.vercel.app/',
    source_code_link: "https://github.com/Shubhjn4357/TodoDApp",
  },
  {
    name: "Portfolio V1",
    description:
      "My first portfolio website designed to showcase my web development skills and projects, featuring responsive design and key information.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: mtv,
    source_code_link: "https://github.com/",
  },
  {
    name: "Mobile App",
    description:
      "A cross-platform mobile application that demonstrates efficiency and clean UI/UX principles for modern smartphones.",
    tags: [
      {
        name: "react-native",
        color: "blue-text-gradient",
      },
      {
        name: "firebase",
        color: "green-text-gradient",
      },
    ],
    image: spotify,
    source_code_link: "https://github.com/",
  },
];

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

export { services, technologies, experiences, testimonials, projects };
