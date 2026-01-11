import React from "react";

<<<<<<< HEAD
import { BallCanvas } from "./canvas";
=======

>>>>>>> 9d330505 (refactorise whole app)
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  return (
    <div className='flex flex-row flex-wrap justify-center gap-10'>
      {technologies.map((technology) => (
        <div className='w-28 h-28' key={technology.name}>
<<<<<<< HEAD
          <BallCanvas icon={technology.icon} />
=======
          <img src={technology.icon} alt={technology.name} className="w-full h-full object-contain hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
>>>>>>> 9d330505 (refactorise whole app)
        </div>
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
