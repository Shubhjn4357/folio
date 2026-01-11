import { styles } from '../styles';
import { motion } from "framer-motion";
import { socialLinks } from '../constants';

const Footer = () => {
    return (
        <footer className={`${styles.paddingX} w-full py-10 flex flex-col items-center justify-center gap-6 relative z-10`}>
            {/* Glass Divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-neon-purple to-transparent mb-6 opacity-30" />

            <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl gap-6">

                {/* Brand */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
                        Shubham.
                    </h3>
                    <p className="text-secondary text-sm mt-2">
                        Building the future, one pixel at a time.
                    </p>
                </div>

              {/* Social Icons with Floating Effect */}
              <div className="flex gap-6">
                  {socialLinks.map((social, index) => (
                      <motion.div
                          key={index}
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              repeatType: "loop",
                              ease: "easeInOut",
                              delay: index * 0.2
                          }}
                      >
                          <div 
                      onClick={() => window.open(social.link, '_blank')}
                      className="w-12 h-12 rounded-full glass-panel  flex justify-center items-center cursor-pointer hover:shadow-neon hover:border-neon-blue transition-all duration-300 group"
                  >
                      <img 
                          src={social.icon}
                          alt={social.name}
                          className={ `w-1/2 h-1/2 object-contain rounded-full  opacity-70 group-hover:opacity-100 transition-opacity ${social.color}`}
                      />
                  </div>
              </motion.div>
          ))}
              </div>

              {/* Copyright */}
              <div className="text-center md:text-right">
                  <p className="text-secondary text-sm">
                      © {new Date().getFullYear()} All Rights Reserved.
                  </p>
                  <p className="text-secondary text-xs mt-1 opacity-50">
                      Made with <span className="text-neon-pink">❤</span> by Shubham Jain
                  </p>
              </div>
          </div>
      </footer>
    );
};

export default Footer;