"use client";

import Image from "next/image";
import AboutMePhoto from "./about-me-photo.jpg";
import USNavalPhoto from "./us-naval.avif";
import FearlessPhoto from "./fearless.png";
import WestatPhoto from "./Westat.png";
import NSFPhoto from "./nsf.jpeg";

import LiquidBackgroundComponent from "@/components/LiquidBackground";
import ProjectsGallery from "@/components/ProjectsGallery";
import Link from "next/link";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const interactedRef = useRef(false);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("https://formsubmit.co/ajax/simon97862012@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          _subject: "New Message from Portfolio"
        })
      });

      if (response.ok) {
        setSubmitStatus("success");
        setTimeout(() => {
          setShowContactForm(false);
          setSubmitStatus("idle");
        }, 3000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Determine active section based on scroll position
      const sections = ['home', 'about', 'portfolio', 'contact'];
      let currentSection = 'home';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          // Adjust threshold to change active state slightly before hitting the top
          const top = element.offsetTop - 100; 
          if (scrollPosition >= top) {
            currentSection = section;
          }
        }
      }
      
      setActiveSection(currentSection);

      // Keep the scroll indicator visible until we reach the contact section
      setHasScrolled(currentSection === 'contact');
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Control body scroll while in transition
    document.body.style.overflow = showContent ? 'auto' : 'hidden';
    
    // Only process interaction logic if content is not yet currently showing
    if (showContent) return;

    const handleInteraction = () => {
      interactedRef.current = true;

      // Reset the timer on mouse move or interaction
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowContent(true);
      }, 600);
    };

    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    window.addEventListener("touchmove", handleInteraction);
    window.addEventListener("click", handleInteraction);

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("touchmove", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showContent]);

  return (
    <main className={showContent ? "relative min-h-screen w-full bg-black" : "relative h-screen w-full overflow-hidden bg-black"}>
      <AnimatePresence>
        {!showContent && (
          <motion.div
            key="liquid-bg"
            className="fixed inset-0 z-[9999] touch-none"
            style={{ pointerEvents: showContent ? "none" : "auto" }}
            initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{
              opacity: 0,
              filter: "blur(15px)",
              scale: 1.05,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <LiquidBackgroundComponent fadeOut={showContent} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative font-sans text-white"
        style={{ pointerEvents: showContent ? "auto" : "none" }}
      >
        {/* Scroll Indicator - Show on all except Contact section */}
        <AnimatePresence>
          {showContent && !hasScrolled && activeSection !== 'contact' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="fixed bottom-10 right-8 md:right-12 z-50 pointer-events-none flex flex-col items-center gap-3 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            >
              <div className="w-6 h-10 border-2 border-white/80 rounded-full flex justify-center p-1.5 bg-black/20 backdrop-blur-sm">
                <motion.div 
                  className="w-1.5 h-2.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                  animate={{ y: [0, 14, 0], opacity: [1, 0.4, 1] }} 
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
              </div>
              <span className="text-xs uppercase tracking-widest font-semibold text-white/90 drop-shadow-md">Scroll</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="fixed top-6 right-12 z-50 bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-lg"
        >
          <ul className="flex items-center justify-center gap-3 sm:gap-6 py-4 px-8 font-medium text-xs sm:text-sm tracking-widest uppercase">
          {/* Nav Item - Home */}
          <li className="flex items-center h-10">
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('home');
                if (element) {
                  let offset = 40;
                  if (["about", "portfolio", "contact"].includes(element.id)) {
                    offset = -240;
                  } else if (element.id === "projects-gallery") {
                    offset = 0;
                  }
                  const y = element.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className={`hover:text-gray-400 transition-colors cursor-pointer flex items-center h-full ${activeSection === 'home' ? 'text-white' : 'text-zinc-500'}`}
            >
              Home
            </a>
          </li>
          {/* Nav Item - About Me */}
          <li className="flex items-center h-10">
            <a 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('about');
                if (element) {
                  const y = element.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className={`hover:text-gray-400 transition-colors cursor-pointer flex items-center h-full ${activeSection === 'about' ? 'text-white' : 'text-zinc-500'}`}
            >
              About Me
            </a>
          </li>
          {/* Nav Item - Portfolio (with dropdown) */}
          <li className="relative group flex items-center h-10">
            <a 
              href="#portfolio" 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('portfolio');
                if (element) {
                  const y = element.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className={`hover:text-gray-400 transition-colors cursor-pointer flex flex-col items-center h-full justify-center ${activeSection === 'portfolio' ? 'text-white' : 'text-zinc-500'}`}
              style={{ minWidth: '80px' }}
            >
              <span className="mt-5" style={{lineHeight:1}}>Portfolio</span>
              <span className="block flex justify-center mt-2">
                <svg
                  className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </a>
            {/* Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              {/* Invisible bridge to maintain hover state over the gap */}
              <div className="absolute -top-4 left-0 w-full h-4"></div>
              <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg shadow-lg py-2 px-6 whitespace-nowrap relative">
                <a
                  href="#projects-gallery"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('projects-gallery');
                    if (element) {
                      const y = element.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className="block text-zinc-400 hover:text-white transition-colors text-xs cursor-pointer"
                >
                  Projects
                </a>
              </div>
            </div>
          </li>
          {/* Nav Item - Contact */}
          <li className="flex items-center h-10">
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }}
              className={`hover:text-gray-400 transition-colors cursor-pointer flex items-center h-full ${activeSection === 'contact' ? 'text-white' : 'text-zinc-500'}`}
            >
              Contact
            </a>
          </li>
        </ul>
      </motion.nav>

      {/* Main Content Sections */}
      {/* Home Section */}
      <section id="home" className="min-h-screen w-full flex items-center justify-center px-4 md:px-0 overflow-y-auto pt-10" style={{height: '100vh'}}>
        <motion.div 
          className="text-center w-full max-w-4xl mx-auto flex flex-col items-center justify-center"
          initial={{ opacity: 0, filter: "blur(15px)", scale: 0.95 }}
          animate={{ 
            opacity: showContent ? 1 : 0, 
            filter: showContent ? "blur(0px)" : "blur(15px)",
            scale: showContent ? 1 : 0.95 
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-[6rem] font-black tracking-[0.3em] flex flex-col gap-8 sm:gap-12 md:gap-16 leading-none uppercase">
            <span>SIMON</span>
            <span>YOSEPH</span>
          </h1>
        </motion.div>
      </section>
      {/* About Section */}
      <motion.section 
        id="about" 
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="min-h-screen w-full flex items-center justify-center bg-black px-6 md:px-12 pt-2">
        <div className="w-full max-w-6xl mx-auto pt-4 pb-24 flex flex-col gap-16 sm:gap-20">
          <div className="text-center mb-2">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold inline-block relative">
              About Me
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-px bg-white/50"></span>
            </h2>
            {/* Removed paragraph under About Me title as requested */}
          </div>
          {/* Layer 1: Staggered Left & Image */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl text-left relative pl-6 sm:pl-8 flex-1"
            >
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-white/40 to-transparent"></div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-zinc-200 tracking-wide uppercase">The Vision</h3>
              <p className="text-base sm:text-lg md:text-xl opacity-80 font-light leading-relaxed">
                Create and explore. Two words that define how I approach life and my work. I am a creative developer focused on
                building interactive and engaging digital experiences. Every project is an opportunity to combine artistic expression
                with thoughtful, functional design.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] flex-shrink-0 mt-8 md:mt-0"
            >
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                <Image 
                  src={AboutMePhoto} 
                  alt="Simon Yoseph - About Me" 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  placeholder="blur"
                />
              </div>
              <p className="mt-2 text-left text-xs italic text-zinc-500">pohoto credit instagram: @becshotit</p>
            </motion.div>
          </div>

          {/* Layer 2: Staggered Right */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl text-left sm:text-right ml-auto relative pr-0 sm:pr-8 pl-6 sm:pl-0"
          >
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-white/40 to-transparent hidden sm:block"></div>
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-white/40 to-transparent block sm:hidden"></div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-zinc-200 tracking-wide uppercase">The Execution</h3>
            <p className="text-base sm:text-lg md:text-xl opacity-80 font-light leading-relaxed">
              I turn ideas into experiences. My work blends creative exploration with thoughtful
              development to build products that are engaging, functional, and visually compelling all while enjoying the process.
            </p>
          </motion.div>

          {/* Layer 3: Staggered Left - The Dream */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl text-left relative pl-6 sm:pl-8"
          >
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-white/40 to-transparent"></div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-zinc-200 tracking-wide uppercase">The Dream</h3>
            <p className="text-base sm:text-lg md:text-xl opacity-80 font-light leading-relaxed">
              I am constantly pushing the boundaries and trying new things. I aspire to work on film projects/ music production behind the scences,
              knowing the process is just as important as the final product. I am passionate about exploring the intersection of creativity and technology.
            </p>
          </motion.div>
        </div>
      </motion.section>

        {/* Portfolio Section */}
        {/* Spacer to push Projects section down for visibility */}
        <div id="projects-spacer" style={{ height: '60px' }}></div>
        <motion.section 
          id="portfolio" 
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="min-h-screen w-full flex items-start justify-center bg-black px-2 md:px-0 py-6 pt-10"
        >

          <div className="max-w-5xl mx-auto w-full pt-2">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center">Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
              <a href="https://www.nrl.navy.mil/" target="_blank" rel="noopener noreferrer" className="relative h-72 border border-zinc-700 rounded-lg flex items-center justify-center bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer overflow-hidden group block">
                <Image 
                  src={USNavalPhoto} 
                  alt="U.S. Naval Research Laboratory" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <span className="relative z-10 text-xl font-semibold tracking-wide uppercase text-white shadow-sm text-center px-4">U.S. Naval Research Laboratory</span>
              </a>
              <a href="https://fearless.tech/" target="_blank" rel="noopener noreferrer" className="relative h-72 border border-zinc-700 rounded-lg flex items-center justify-center bg-black transition-colors cursor-pointer overflow-hidden group block">
                <Image 
                  src={FearlessPhoto} 
                  alt="Fearless Project" 
                  fill 
                  quality={100}
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <span className="absolute z-10 text-xl font-semibold tracking-wide uppercase text-white shadow-sm">Fearless</span>
              </a>
              <a href="https://www.westat.com/" target="_blank" rel="noopener noreferrer" className="relative h-72 border border-zinc-700 rounded-lg flex items-center justify-center bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer overflow-hidden group block">
                <Image 
                  src={WestatPhoto} 
                  alt="Westat Project" 
                  fill 
                  quality={100}
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700 w-full h-full" 
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
              </a>
              <a href="https://www.nsf.gov/" target="_blank" rel="noopener noreferrer" className="relative h-72 border border-zinc-700 rounded-lg flex items-center justify-center bg-black transition-colors cursor-pointer overflow-hidden group block">
                <Image 
                  src={NSFPhoto} 
                  alt="National Science Foundation Project" 
                  fill 
                  quality={100}
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <span className="absolute z-10 text-xl font-semibold tracking-wide uppercase text-white shadow-sm text-center px-4">National Science Foundation</span>
              </a>
            </div>

            {/* Projects Subsection */}
            <div id="projects-gallery" className="mt-48 scroll-mt-40">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-white/90 mb-6">
                Projects
              </h3>
              <ProjectsGallery />
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          id="contact" 
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="min-h-screen w-full flex flex-col items-center justify-center bg-black px-4 md:px-0 py-24 sm:py-32 overflow-y-auto pt-10" style={{height: '100vh'}}>
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Contact</h2>
            <p className="text-lg opacity-80 mb-10 font-light text-center">
              Want to collborate? Get in touch!
            </p>
            
            {!showContactForm ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md">
                <a href="mailto:simon97862012@gmail.com" className="w-full sm:w-auto px-8 py-4 border border-zinc-700 bg-zinc-900/50 text-white font-semibold tracking-wider uppercase rounded-full hover:bg-zinc-800 transition-colors text-center inline-flex items-center justify-center min-w-[200px]">
                  Email Me
                </a>
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold tracking-wider uppercase rounded-full hover:bg-gray-200 transition-colors text-center inline-flex items-center justify-center min-w-[200px]"
                >
                  Quick Message
                </button>
                <a
                  href="/Simon%20Yoseph%20Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 border border-blue-500 bg-blue-600/90 text-white font-semibold tracking-wider uppercase rounded-full hover:bg-blue-700 transition-colors text-center inline-flex items-center justify-center min-w-[200px] shadow-lg"
                >
                  View Resume
                </a>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto text-left bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Send a Message</h3>
                  <button onClick={() => setShowContactForm(false)} className="text-zinc-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                <form className="flex flex-col gap-4" onSubmit={handleContactSubmit}>
                  {submitStatus === "success" && (
                    <div className="p-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-sm text-center">
                      Message sent successfully!
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm text-center">
                      Something went wrong. Please try again.
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-400">Name</label>
                    <input type="text" id="name" name="name" required placeholder="Your name" className="px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-white transition-colors text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-zinc-400">Email</label>
                    <input type="email" id="email" name="email" required placeholder="your@email.com" className="px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-white transition-colors text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-zinc-400">Message</label>
                    <textarea 
                      id="message" 
                      name="message"
                      required
                      rows={4} 
                      maxLength={1250} /* roughly 250 words */
                      placeholder="Type your message here..." 
                      className="px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-white transition-colors text-white resize-none"
                    ></textarea>
                    <span className="text-xs text-zinc-500 text-right">Max 250 words</span>
                  </div>
                  <button disabled={isSubmitting} type="submit" className={`mt-2 w-full py-4 ${isSubmitting ? 'bg-gray-400' : 'bg-white hover:bg-gray-200'} text-black font-semibold tracking-wider uppercase rounded-lg transition-colors flex justify-center`}>
                    {isSubmitting ? (
                      <span className="animate-pulse">Sending...</span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </motion.section>

      </motion.div>
    </main>
  );
}
