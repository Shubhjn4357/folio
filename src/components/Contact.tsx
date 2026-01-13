'use client';

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/10 shadow-lg rounded-2xl`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75] p-8 rounded-2xl'
      >
        <div className='flex justify-between'>
          <div>
            <p className={styles.sectionSubText}>Get in touch</p>
            <h3 className={styles.sectionHeadText}>Contact.</h3>
          </div>
          <div>
            <a className='text-[10px] sm:text-[20px] text-white-300' href='/resume.pdf' download>
              <button className="flex shadow-lg active:translate-y-1 active:shadow-none shadow-accent-primary dark:shadow-dark-accent-primary bg-text-primary dark:bg-dark-surface hover:bg-accent-primary dark:hover:bg-dark-accent-primary text-secondary font-bold py-1 px-2 sm:py-2 sm:px-4 border-b-2 sm:border-b-4 border-accent-secondary dark:border-dark-accent-secondary active:border-b-0 rounded">
                <svg className="fill-current sm:w-4 sm:h-7 w-2 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                Resume
              </button>
            </a>
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-12 flex flex-col gap-8 relative'
        >
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-tertiary/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl text-center p-6 border border-neon-green/30"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                <p className="text-secondary mb-6">Thanks for reaching out. I'll get back to you soon.</p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <label className='flex flex-col'>
            <span className='dark:text-white text-black font-medium mb-4'>Your Name</span>
            <input
              type='text'
              name='name'
              autoComplete='true'
              value={form.name}
              onChange={handleChange}
              placeholder="What's your good name?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary dark:text-white text-black rounded-lg outline-none border-none font-medium focus:ring-2 focus:ring-neon-purple'
              required
            />
          </label>
          <label className='flex flex-col'>
            <span className='dark:text-white text-black font-medium mb-4'>Your email</span>
            <input
              type='email'
              name='email'
              autoComplete='true'
              value={form.email}
              onChange={handleChange}
              placeholder="What's your web address?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary dark:text-white text-black rounded-lg outline-none border-none font-medium focus:ring-2 focus:ring-neon-purple'
              required
            />
          </label>
          <label className='flex flex-col'>
            <span className='dark:text-white text-black font-medium mb-4'>Your Message</span>
            <textarea
              rows={7}
              name='message'
              autoComplete='true'
              value={form.message}
              onChange={handleChange}
              placeholder='What you want to say?'
              className='bg-tertiary py-4 px-6 placeholder:text-secondary dark:text-white text-black rounded-lg outline-none border-none font-medium focus:ring-2 focus:ring-neon-purple'
              required
            />
          </label>

          <button
            type='submit'
            disabled={loading}
            className='bg-tertiary py-3 px-8 rounded-xl outline-none w-fit dark:text-white text-black font-bold shadow-md shadow-primary hover:shadow-neon transition-shadow disabled:opacity-50'
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px] flex justify-center items-center'
      >
        {/* Vibrant visual for contact section */}
        <div className="relative w-full h-full flex justify-center items-center">
          <div className="absolute w-72 h-72 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse-slow" />
          <h3 className="relative z-10 text-[60px] font-bold gradient-text">
            Let's Talk
          </h3>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
