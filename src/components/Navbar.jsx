import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { menu, close } from "../assets";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
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
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
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
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${!toggle ? "hidden" : "flex"
              } p-6 glass-panel absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`${active === nav.title ? "text-neon-purple font-bold" : "text-secondary"
                    } font-medium text-[16px] cursor-pointer`}
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
