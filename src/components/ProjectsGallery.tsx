"use client";

import { useRef, useEffect, useState } from "react";

const allItems = [
  { img: "/resumeGEN.png", title: "Resume GEN AI", position: "object-left", link: "https://simonyoseph-resumegenai-app-qutnfi.streamlit.app/", desc: "Automate resume matching for jobs you find with AI." },
  { img: "/MyFit.png", title: "MyFit", link: "https://my-fit-webapp.vercel.app/", position: "object-left", desc: "Track your fitness journey." },
  { img: "/beat hive screenshot.jpg", title: "Beat Hive", link: "https://github.com/SimonYoseph/Beat-Hive", desc: "Music control the atmosphere and the vibe of a party. Be the DJ!" },
];

function shuffleArray(array: any[]) {
  // Fisher-Yates shuffle
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ProjectsGallery() {
  // Only randomize on client to avoid hydration mismatch
  const [columns, setColumns] = useState<[any[], any[], any[]] | null>(null);
  useEffect(() => {
    const shuffled = shuffleArray(allItems);
    const minCards = 6;
    const rotate = (arr: any[], n: number) => arr.slice(n).concat(arr.slice(0, n));
    const fillAndShuffle = (arr: any[]) => {
      let out = arr.slice();
      while (out.length < minCards) {
        out = out.concat(shuffleArray(arr));
      }
      return out.slice(0, minCards);
    };
    const base = fillAndShuffle(shuffled);
    setColumns([
      base,
      rotate(base, 1),
      rotate(base, 2)
    ]);
  }, []);
  if (!columns) {
    // Prevent hydration mismatch: render nothing until client-side
    return null;
  }
  const [col1, col2, col3] = columns;

  return (
    <div id="projects-gallery" className="w-full relative mt-5 mb-32 flex flex-col items-center">
      <p className="text-zinc-400 text-sm mb-4 animate-pulse uppercase tracking-widest">
        Hover to pause, Scroll to explore
      </p>
      {/* Wrapping container with mask for fading out edges */}
      <div 
        className="w-full max-w-5xl h-[70vh] sm:h-[80vh] overflow-y-auto overflow-x-hidden relative rounded-xl group-gallery pointer-events-auto"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          #projects-gallery .overflow-y-auto::-webkit-scrollbar {
            display: none;
          }
          @keyframes scrollUpGallery {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          @keyframes scrollDownGallery {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0); }
          }
          .animate-gallery-up {
            animation: scrollUpGallery 30s linear infinite;
          }
          .animate-gallery-down {
            animation: scrollDownGallery 30s linear infinite;
          }
          .group-gallery:hover .animate-gallery-up,
          .group-gallery:hover .animate-gallery-down,
          .group-gallery:active .animate-gallery-up,
          .group-gallery:active .animate-gallery-down {
            animation-play-state: paused;
          }
        `}} />
        <div className="w-full h-[200vh] flex justify-between gap-4 sm:gap-6 px-2 sm:px-4">
          {/* Column 1 (Left) - Moves DOWN */}
          <div className="flex-1 flex flex-col animate-gallery-down">
            <div className="flex flex-col gap-4 sm:gap-6 pb-4 sm:pb-6">
              {col1.map((item, i) => <ProjectCard key={`col1-a-${i}`} item={item} />)}
            </div>
            {/* Duplicated half for perfect seamless looping */}
            <div className="flex flex-col gap-4 sm:gap-6 pb-4 sm:pb-6">
              {col1.map((item, i) => <ProjectCard key={`col1-b-${i}`} item={item} />)}
            </div>
          </div>
          {/* Column 2 (Middle) - Moves UP */}
          <div className="flex-1 flex flex-col pt-10 sm:pt-20 animate-gallery-up">
            <div className="flex flex-col gap-4 sm:gap-6 pb-4 sm:pb-6">
              {col2.map((item, i) => <ProjectCard key={`col2-a-${i}`} item={item} />)}
            </div>
            <div className="flex flex-col gap-4 sm:gap-6 pb-4 sm:pb-6">
              {col2.map((item, i) => <ProjectCard key={`col2-b-${i}`} item={item} />)}
            </div>
          </div>
          {/* Column 3 (Right) - Moves DOWN */}
          <div className="flex-1 hidden md:flex flex-col animate-gallery-down">
            <div className="flex flex-col gap-4 sm:gap-6 pb-4 sm:pb-6">
              {col3.map((item, i) => <ProjectCard key={`col3-a-${i}`} item={item} />)}
            </div>
            <div className="flex flex-col gap-4 sm:gap-6 pb-4 sm:pb-6">
              {col3.map((item, i) => <ProjectCard key={`col3-b-${i}`} item={item} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ item }: { item: { img: string, title: string, position?: string, link?: string, desc?: string } }) {
  const Tag = item.link ? 'a' : 'div';
  const linkProps = item.link ? { href: item.link, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Tag 
      {...linkProps}
      className="relative block w-full aspect-[4/5] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 group/card cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 shrink-0"
    >
      <img 
        src={item.img} 
        alt={item.title} 
        className={`w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ${item.position || 'object-center'}`}
      />
      <div className="absolute inset-0 bg-black/40 group-hover/card:bg-black/10 transition-colors duration-500"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
        <h4 className="text-2xl sm:text-3xl font-bold text-white/90 drop-shadow-md tracking-wide">
          {item.title}
        </h4>
        {item.desc && (
          <p className="text-sm sm:text-base text-zinc-300 mt-2 font-normal leading-snug">
            {item.desc}
          </p>
        )}
      </div>
    </Tag>
  );
}
