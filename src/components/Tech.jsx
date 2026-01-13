
'use client';

import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  return (
    <div className='flex flex-row flex-wrap justify-center gap-10'>
      {technologies.map((technology) => (
        <div className='w-28 h-28 flex justify-center items-center' key={technology.name}>
          <technology.icon
            className="w-20 h-20 object-contain hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            style={{ color: technology.color || '#fff' }}
          />
        </div>
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
