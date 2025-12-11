import {RocketCanvas, StarsCanvas} from './canvas';
import {styles} from '../styles';
import { motion } from "framer-motion";
import {links} from '../constants';
import { slideIn } from "../utils/motion";
const Footer=()=>{
    return(
        <>
        <footer
            className={`${
                styles.paddingX
            } w-full flex flex-wrap sm:flex-row flex-col justify-center items-center p-5 `}
            >
                <motion.div
                variants={slideIn("left", "tween", 0.2, 1)} 
                className='order-first'>
                   <RocketCanvas/>
                </motion.div>
                
            <div className='text-center  sm:order-2 my-4 order-last'>
                <div className="max-w-7xl">All Right Reserved {new Date().getFullYear()} <span className='text-[8px]'>TM</span></div>
                <p>Made By Shubham Jain ❤️
                </p>
            </div>
            <div className='block sm:order-last'>
                <p className='font-poppins text-[18px] text-center'>Follow Me 👇</p>
                <div className='flex justify-around align-center'>
                    {links.map((i,k)=>{
                    return <div key={k} className='link inset-0 flex justify-end'>
                        <div
                        onClick={() => window.open(i.link,'_blank')}
                        className={`${i.color} size-10 rounded-full glass-effect flex justify-center items-center cursor-pointer`}
                        >
                        <img
                            src={i.icon}
                            alt='site link'
                            className='w-1/2 h-1/2 object-contain bg-black rounded-full'
                        />
                        <span className='link-name'>{i.name}</span>
                        </div>
                    </div>
                    })}
                </div>
            </div>
        </footer>
        </>
    )
}
export default Footer;