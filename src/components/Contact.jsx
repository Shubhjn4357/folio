'use client';

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "React Js Developer",
          from_email: form.email,
          to_email: "shubhamjain.com.in@gmail.com",
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          alert("Ahh, something went wrong. Please try again.");
        }
      );
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
              <svg className="fill-current sm:w-4 sm:h-7 w-2 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                Resume
              </button>
              </a>
          </div>
        </div>
        
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-12 flex flex-col gap-8'
        >
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
            />
          </label>

          <button
            type='submit'
            className='bg-tertiary py-3 px-8 rounded-xl outline-none w-fit dark:text-white text-black font-bold shadow-md shadow-primary hover:shadow-neon transition-shadow'
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
