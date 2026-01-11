import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
<<<<<<< HEAD
import { logo, menu, close } from "../assets";
=======
import { menu, close } from "../assets";
>>>>>>> 9d330505 (refactorise whole app)
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
<<<<<<< HEAD
  const { isDarkMode, toggleTheme } = useTheme();
=======
>>>>>>> 9d330505 (refactorise whole app)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
<<<<<<< HEAD
      if (scrollTop > 100) {
=======
      if (scrollTop > 50) {
>>>>>>> 9d330505 (refactorise whole app)
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
<<<<<<< HEAD

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-primary dark:bg-dark-primary" : "bg-transparent"
        } transition-colors duration-300`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <Link
          to='/'
          className='flex items-center gap-2'
=======
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav
      className={`${styles.paddingX
        } w-full flex items-center py-5 fixed top-0 z-20 transition-all duration-300 ${scrolled ? "bg-primary/90 backdrop-blur-md shadow-neon" : "bg-transparent"
        }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
>>>>>>> 9d330505 (refactorise whole app)
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
<<<<<<< HEAD
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
                active === nav.title ? "text-text-primary dark:text-dark-text-primary before:w-full" : "text-text-secondary dark:text-dark-text-secondary"
                } hover:text-text-primary dark:hover:text-dark-text-primary text-[18px] nav-link font-medium cursor-pointer transition-colors duration-200`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}

          {/* Theme Toggle Button */}
          <li>
            <button
              onClick={toggleTheme}
              className='w-14 h-7 rounded-full bg-text-secondary dark:bg-dark-surface relative transition-all duration-300 hover:shadow-soft dark:hover:shadow-dark-soft'
              aria-label='Toggle theme'
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-text-primary dark:bg-dark-accent-primary transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-0'
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
            className='w-12 h-6 rounded-full bg-text-secondary dark:bg-dark-surface relative z-20'
            aria-label='Toggle theme'
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-text-primary dark:bg-dark-accent-primary transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'
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
=======
          <p className="text-[var(--text-main)] text-[24px] font-bold cursor-pointer flex">
            Shubham <span className="text-neon-blue ml-2 hidden sm:block"> | Projects</span>
          </p>
        </Link>

        <div className="flex gap-10 items-center">
          {/* Desktop Menu */}
          <ul className="list-none hidden sm:flex flex-row gap-10">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`${active === nav.title ? "text-neon-purple font-bold" : "text-secondary"
                  } hover:text-white text-[18px] font-medium cursor-pointer transition-colors`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>

          {/* Theme Toggle Button */}
          <button
            onClick={(e) => {
              // Create bubble effect
              const bubble = document.createElement('div');
              bubble.className = 'theme-bubble';
              // Position at click coordinates
              const rect = e.target.getBoundingClientRect();
              const x = e.clientX;
              const y = e.clientY;

              bubble.style.left = `${x}px`;
              bubble.style.top = `${y}px`;

              document.body.appendChild(bubble);

              // Trigger animation
              requestAnimationFrame(() => {
                bubble.classList.add('expand');
              });

              // Remove after animation and toggle
              setTimeout(() => {
                toggleTheme();
                setTimeout(() => bubble.remove(), 500); // Fade out
              }, 300);
            }}
            className="bg-tertiary p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain cursor-pointer"
>>>>>>> 9d330505 (refactorise whole app)
            onClick={() => setToggle(!toggle)}
          />

          <div
<<<<<<< HEAD
            className={`${
              !toggle ? "scale-0" : "flex scale-100"
              } p-6 blue-gradient w-screen origin-right absolute transition duration-500 ease-in-out top-0 right-0 h-screen z-10 rounded-xl`}
          >
            <ul className='list-none flex justify-center items-center flex-1 flex-col gap-4'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins text-center font-extrabold p-2 cursor-pointer text-[24px] nav-link ${
                    active === nav.title ? "text-text-primary dark:text-dark-text-primary before:w-full" : "text-text-secondary dark:text-dark-text-secondary"
                    } transition-colors duration-200`}
=======
            className={`${!toggle ? "hidden" : "flex"
              } p-6 glass-panel absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`${active === nav.title ? "text-neon-purple font-bold" : "text-secondary"
                    } font-medium text-[16px] cursor-pointer`}
>>>>>>> 9d330505 (refactorise whole app)
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
