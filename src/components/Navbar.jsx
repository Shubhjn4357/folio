import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-primary" : "bg-transparent"
        } transition-colors duration-300`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <Link
          to='/'
          className='flex items-center gap-2'
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt='logo' className='w-9 h-9 object-contain' />
          <p className='text-white-100 dark:text-white text-[18px] font-bold cursor-pointer flex'>
            Shubham &nbsp;
            <code className='sm:block hidden text-[18px]'> {'</>'}ReactJs Developer</code>
          </p>
        </Link>

        <ul className='list-none hidden sm:flex flex-row gap-10 items-center'>
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white-100 dark:text-white before:w-full" : "text-secondary"
                } hover:text-white-100 dark:hover:text-white text-[18px] nav-link font-medium cursor-pointer transition-colors duration-200`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}

          {/* Theme Toggle Button */}
          <li>
            <button
              onClick={toggleTheme}
              className='w-14 h-7 rounded-full bg-secondary relative transition-all duration-300 hover:shadow-neon'
              aria-label='Toggle theme'
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white-100 dark:bg-tertiary transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-0'
                  }`}
              >
                <span className='absolute inset-0 flex items-center justify-center text-xs'>
                  {isDarkMode ? '🌙' : '☀️'}
                </span>
              </div>
            </button>
          </li>
        </ul>

        <div className='sm:hidden flex flex-1 justify-end items-center gap-3'>
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className='w-12 h-6 rounded-full bg-secondary relative z-20'
            aria-label='Toggle theme'
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white-100 dark:bg-tertiary transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
            >
              <span className='absolute inset-0 flex items-center justify-center text-xs'>
                {isDarkMode ? '🌙' : '☀️'}
              </span>
            </div>
          </button>

          <img
            src={toggle ? close : menu}
            alt='menu'
            className='w-[28px] h-[28px] z-20 object-contain cursor-pointer'
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "scale-0" : "flex scale-100"
              } p-6 blue-gradient w-screen origin-right absolute transition duration-500 ease-in-out top-0 right-0 h-screen z-10 rounded-xl`}
          >
            <ul className='list-none flex justify-center items-center flex-1 flex-col gap-4'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins text-center font-extrabold p-2 cursor-pointer text-[24px] nav-link ${
                    active === nav.title ? "text-white-100 dark:text-white before:w-full" : "text-secondary"
                    } transition-colors duration-200`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
