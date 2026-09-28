'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaCheck } from 'react-icons/fa6';

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps<T = string | number> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
  dropdownClassName?: string;
  align?: 'left' | 'right';
  id?: string;
}

export default function CustomSelect<T extends string | number>({
  value,
  onChange,
  options,
  icon,
  placeholder = 'Select an option',
  className = '',
  dropdownClassName = '',
  align = 'right',
  id,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`} id={id}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="glass-pill flex items-center justify-between gap-2.5 px-4 py-2 rounded-full text-xs font-mono text-[var(--text-main)] hover:border-neon-blue/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue/40 transition-all select-none cursor-pointer group w-full"
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="flex-shrink-0 text-secondary group-hover:text-neon-blue transition-colors">{icon}</span>}
          {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <FaChevronDown
          className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-neon-blue' : 'text-secondary group-hover:text-[var(--text-main)]'
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 min-w-[170px] w-max glass-panel rounded-2xl p-1.5 shadow-2xl z-50 border border-black/10 dark:border-white/10 backdrop-blur-2xl ${dropdownClassName}`}
            role="listbox"
          >
            <div className="flex flex-col gap-0.5">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    type="button"
                    key={String(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-mono text-left transition-all ${
                      isSelected
                        ? 'bg-neon-blue/15 text-neon-blue font-semibold shadow-sm'
                        : 'text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {option.icon && <span className="text-xs flex-shrink-0">{option.icon}</span>}
                      <span className="truncate">{option.label}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {option.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-black/10 dark:bg-white/10 text-secondary">
                          {option.badge}
                        </span>
                      )}
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <FaCheck className="w-3 h-3 text-neon-blue" />
                        </motion.span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
