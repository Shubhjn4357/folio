import {
  mobile,
  backend,
  creator,
  web,
<<<<<<< HEAD
=======
  tododapp,
  mtv,
  spotify,
>>>>>>> 9d330505 (refactorise whole app)
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
<<<<<<< HEAD
  mtv,
  tododapp,
  spotify,
  threejs,
  github,
  insta,
  linkdin
=======
  threejs,
  insta,
  linkdin,
  github,
>>>>>>> 9d330505 (refactorise whole app)
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
<<<<<<< HEAD
    id: "project",
    title: "Projects",
=======
    id: "work",
    title: "Work",
>>>>>>> 9d330505 (refactorise whole app)
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
<<<<<<< HEAD
    title: "React Js Developer",
=======
    title: "React Native Developer",
>>>>>>> 9d330505 (refactorise whole app)
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

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

<<<<<<< HEAD
// const experiences = [
//   {
//     title: "React.js Developer",
//     company_name: "Starbucks",
//     icon: starbucks,
//     iconBg: "#383E56",
//     date: "March 2020 - April 2021",
//     points: [
//       "Developing and maintaining web applications using React.js and other related technologies.",
//       "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
//       "Implementing responsive design and ensuring cross-browser compatibility.",
//       "Participating in code reviews and providing constructive feedback to other developers.",
//     ],
//   },
//   {
//     title: "React Native Developer",
//     company_name: "Tesla",
//     icon: tesla,
//     iconBg: "#E6DEDD",
//     date: "Jan 2021 - Feb 2022",
//     points: [
//       "Developing and maintaining web applications using React.js and other related technologies.",
//       "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
//       "Implementing responsive design and ensuring cross-browser compatibility.",
//       "Participating in code reviews and providing constructive feedback to other developers.",
//     ],
//   },
//   {
//     title: "Web Developer",
//     company_name: "Shopify",
//     icon: shopify,
//     iconBg: "#383E56",
//     date: "Jan 2022 - Jan 2023",
//     points: [
//       "Developing and maintaining web applications using React.js and other related technologies.",
//       "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
//       "Implementing responsive design and ensuring cross-browser compatibility.",
//       "Participating in code reviews and providing constructive feedback to other developers.",
//     ],
//   },
//   {
//     title: "Full stack Developer",
//     company_name: "Meta",
//     icon: meta,
//     iconBg: "#E6DEDD",
//     date: "Jan 2023 - Present",
//     points: [
//       "Developing and maintaining web applications using React.js and other related technologies.",
//       "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
//       "Implementing responsive design and ensuring cross-browser compatibility.",
//       "Participating in code reviews and providing constructive feedback to other developers.",
//     ],
//   },
// ];

// const testimonials = [
//   {
//     testimonial:
//       "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
//     name: "Sara Lee",
//     designation: "CFO",
//     company: "Acme Co",
//     image: "https://randomuser.me/api/portraits/women/4.jpg",
//   },
//   {
//     testimonial:
//       "I've never met a web developer who truly cares about their clients' success like Rick does.",
//     name: "Chris Brown",
//     designation: "COO",
//     company: "DEF Corp",
//     image: "https://randomuser.me/api/portraits/men/5.jpg",
//   },
//   {
//     testimonial:
//       "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
//     name: "Lisa Wang",
//     designation: "CTO",
//     company: "456 Enterprises",
//     image: "https://randomuser.me/api/portraits/women/6.jpg",
//   },
// ];
const links=[
  {
    link:'https://github.com/Shubhjn4357',
    icon:github,
    color:'black-gradient',
    name:'Github'
  },
  {
    link:'https://www.instagram.com/shubh._jn/',
    icon:insta,
    color:'high-gradient',
    name:'Instagram'
  },
  {
    link:'www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=shubham-jain-b46999135',
    icon:linkdin,
    color:'sky-gradient',
    name:'Linkedin'
  },
]
const projects = [
  {
    name: "MtvHub",
    description:
      "All type of Movies & Tv series Obout And Description",
=======
const experiences = [
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

const testimonials = [
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

const projects = [
  {
    name: "Todo DApp",
    description:
      "A decentralized todo application built on the blockchain, allowing users to create tasks that are permanently stored and verifiable.",
>>>>>>> 9d330505 (refactorise whole app)
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
<<<<<<< HEAD
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "bootstrap",
        color: "pink-text-gradient",
      },
    ],
    image: mtv,
    link:'https://mtvhub.netlify.app/',
    source_code_link: "https://github.com/Shubhjn4357/MtvHub",
  },
  {
    name: "Todo Decentralize App",
    description:
      "A Decentralise Todo App with The use of Ether & Reactjs.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "ether.js",
        color: "green-text-gradient",
      },
      {
        name: "material",
=======
        name: "solidity",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
>>>>>>> 9d330505 (refactorise whole app)
        color: "pink-text-gradient",
      },
    ],
    image: tododapp,
<<<<<<< HEAD
    link:'https://todo-d-app-iota.vercel.app/',
    source_code_link: "https://github.com/Shubhjn4357/TodoDApp",
  },
  {
    name: "Spotify Clone",
    description:
      "A comprehensive clone of Spotify with the use of spotify api implementation of mordern Technology ",
    tags: [
      {
        name: "reactjs",
        color: "blue-text-gradient",
      },
      {
        name: "spotifyapi",
        color: "green-text-gradient",
      },
      {
        name: "mui",
        color: "pink-text-gradient",
      },
    ],
    image: spotify,
    source_code_link: 'https://github.com/Shubhjn4357/spotify',
    link:"https://shubhjn4357.github.io/spotify/",
  },
];

export { services, technologies, projects,links };
=======
    source_code_link: "https://github.com/",
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

export const socialLinks = [
  {
    name: "GitHub",
    icon: github,
    link: "https://github.com/Shubhjn4357",
    color: "bg-black",
  },
  {
    name: "LinkedIn",
    icon: linkdin,
    link: "https://linkedin.com/in/shubham-jain-b46999135/",
    color: "bg-blue-500",
  },
  {
    name: "Instagram",
    icon: insta,
    link: "https://instagram.com/shubh._jn/",
    color: "pink-text-gradient",
  },
];

export { services, technologies, experiences, testimonials, projects };
>>>>>>> 9d330505 (refactorise whole app)
