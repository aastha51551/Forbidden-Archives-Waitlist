import React, { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Skull, ChevronRight, ChevronLeft, Calendar, FileText, Compass, Film, Flame, Archive, BookOpen, Volume2 } from "lucide-react";

interface FeatureItem {
  id: string;
  category: string;
  title: string;
  icon: ReactNode;
  colorClass: string;
}

export default function GothicDial() {
  const [activeSegment, setActiveSegment] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartAngle = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const dialRef = useRef<HTMLDivElement>(null);

  const features: FeatureItem[] = [
    {
      id: "case-files",
      category: "Paranormal Case Files",
      title: "HUNTERS AND HAUNTED",
      colorClass: "from-red-950/40 via-red-900/10 to-transparent border-red-900/30",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-red-500 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 20h45l20 20v45H15V20z" strokeWidth="2" strokeLinejoin="miter" />
          <path d="M60 20v20h20" strokeWidth="2" />
          <line x1="25" y1="35" x2="50" y2="35" />
          <line x1="25" y1="45" x2="70" y2="45" />
          <line x1="25" y1="55" x2="70" y2="55" />
          <line x1="25" y1="65" x2="50" y2="65" />
          <circle cx="65" cy="70" r="10" fill="rgba(153, 27, 27, 0.2)" stroke="#ef4444" strokeWidth="1.5" />
          <polygon points="65,65 68,73 62,73" stroke="#ef4444" fill="none" strokeWidth="1" />
        </svg>
      )
    },
    {
      id: "illustrations",
      category: "Illustrative Art & Comics",
      title: "EYE CANDIES",
      
      colorClass: "from-rose-950/40 via-rose-900/10 to-transparent border-rose-950/30",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="20" y="15" width="60" height="70" rx="3" strokeWidth="2" />
          <rect x="25" y="20" width="50" height="60" strokeDasharray="3,3" />
          <path d="M30 50 C 40 32, 60 32, 70 50 C 60 68, 40 68, 30 50 Z" strokeWidth="2" />
          <circle cx="50" cy="50" r="7" fill="rgba(244, 63, 94, 0.3)" stroke="#f43f5e" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: "previews",
      category: "First look at the unreleased",
      title: "EARLY BIRD",
      
      colorClass: "from-amber-950/40 via-amber-900/10 to-transparent border-amber-900/30",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-amber-500 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 35 h70 v45 H15 V35 z" strokeWidth="2" />
          <path d="M15 35 L30 20 H85 L70 35" strokeWidth="2" />
          <line x1="28" y1="22" x2="38" y2="32" strokeWidth="2" />
          <line x1="48" y1="22" x2="58" y2="32" strokeWidth="2" />
          <line x1="68" y1="22" x2="78" y2="32" strokeWidth="2" />
          <path d="M25 45 L32 58 L38 45" fill="currentColor" />
          <path d="M75 45 L68 58 L62 45" fill="currentColor" />
        </svg>
      )
    },
    {
      id: "interviews",
      category: "Interviews and AMAs",
      title: "PICK THEIR BRAINS",
      
      colorClass: "from-stone-900 via-neutral-900/10 to-transparent border-neutral-800/30",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-gray-400 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="43" y="25" width="14" height="28" rx="7" strokeWidth="2" fill="black" />
          <line x1="43" y1="32" x2="57" y2="32" />
          <line x1="43" y1="39" x2="57" y2="39" />
          <line x1="50" y1="25" x2="50" y2="53" />
          <path d="M47 53 v15 c0 2, -2 4, -2 4 h10" strokeWidth="1.5" />
          <path d="M35 78 h30" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: "flash-fiction",
      category: "Flash Fictions",
      title: "MICRO-TERROR",
      colorClass: "from-cyan-950/40 via-cyan-900/10 to-transparent border-cyan-950/30",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M30 18 H70" strokeWidth="3" />
          <path d="M30 82 H70" strokeWidth="3" />
          <path d="M35 20 C35 42, 48 48, 48 50 C48 52, 35 58, 35 80 M65 20 C65 42, 52 48, 52 50 C52 52, 65 58, 65 80" strokeWidth="1.5" />
          <line x1="50" y1="28" x2="50" y2="72" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="50" cy="50" r="1.5" fill="currentColor" />
          <path d="M38 76 C42 72, 58 72, 62 76" fill="rgba(34,211,238,0.2)" stroke="currentColor" />
        </svg>
      )
    },
    {
      id: "folklore",
      category: "Dark Folklore & Secret Rites",
      title: "MYTHOS",
      colorClass: "from-emerald-950/40 via-emerald-900/10 to-transparent border-emerald-950/30",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-emerald-500 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="40" r="22" strokeWidth="1" fill="rgba(16, 185, 129, 0.05)" stroke="#10b981" />
          <path d="M50 75 V48 C50 43, 44 40, 41 36 M50 55 C53 49, 58 48, 62 44" strokeWidth="2" strokeLinecap="round" />
          <path d="M41 36 C36 34, 34 38, 30 35 M62 44 C67 43, 69 47, 74 45" strokeWidth="1" strokeLinecap="round" />
          <path d="M50 72 C42 75, 38 78, 30 82 M50 74 C54 77, 60 76, 70 81" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: "short-stories",
      category: "Short Stories",
      title: "LITERARY TREASURES",
      
      colorClass: "from-purple-950/40 via-purple-900/10 to-transparent border-purple-950/30",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-purple-400 filter drop-shadow-[0_0_8px_rgba(192,132,252,0.4)]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 75 C 25 72, 45 78, 50 82 C 55 78, 75 72, 88 75 V28 C 75 25, 55 31, 50 35 C 45 31, 25 25, 12 28 Z" strokeWidth="2" fill="black" />
          <path d="M50 35 V82" strokeWidth="1.5" />
          <path d="M20 40 h15 M20 48 h18 M20 56 h12" strokeWidth="1" />
          <path d="M65 40 h15 M62 48 h18 M68 56 h12" strokeWidth="1" />
        </svg>
      )
    }
  ];

  // Number of items
  const count = features.length;
  // Arc angle between each runic segment
  const segmentDegrees = 360 / count;

  // Helper: Rotates the dial by clicking a surrounding segment or bullet
  const handleSelectSegment = (index: number) => {
    // Math to compute direct shortest angle rotation to segment
    const previousIndex = activeSegment;
    let diff = index - previousIndex;

    // Adjust for wrapping around shortest distance
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;

    setRotation(prev => prev - diff * segmentDegrees);
    setActiveSegment(index);
  };

  // Turn dial by 1 click left/right
  const handleNext = () => {
    handleSelectSegment((activeSegment + 1) % count);
  };

  const handlePrev = () => {
    handleSelectSegment((activeSegment - 1 + count) % count);
  };

  // Keyboard and wheel support inside dial bounding zone
  const handleWheelRotation = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 10) return;
    e.preventDefault();
    if (e.deltaY > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  // Mathematical helpers to convert index to runic coordinates on dial circumference
  const getDialSegmentLabel = (idx: number) => {
    const runes = ["🜁","☾", "🜂", "🜔", "👁", "🝔", "🜏"];
    return runes[idx % runes.length];
  };

  return (
    <div 
      id="gothic-manifesto-dial-module"
      className="w-full max-w-4xl mx-auto my-12 bg-black/60 rounded-3xl border border-red-950/40 p-6 md:p-10 relative overflow-hidden backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
    >
      {/* Decorative Outer Border Lines and Runes */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-red-900/30 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-red-900/10 to-transparent pointer-events-none" />
      <div className="text-center md:text-left mb-8 border-b border-red-950/20 pb-6 relative z-10">
        <h2 className="font-serif-goth text-2xl md:text-3xl text-red-500 font-bold tracking-widest uppercase mb-1 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] filter">
          WHAT DO WE BRING?
        </h2>
      </div>
      {/* Grid: Dial on the Left/Top, Rich Description on the Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        
        {/* LEFT COLUMN: THE OCCULT DIAL CONTROLLER (md: 5 columns) */}
        <div className="col-span-1 md:col-span-5 flex flex-col items-center justify-center relative select-none pb-4 md:pb-0">
          
          

          <div 
            className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-double border-red-950 flex items-center justify-center bg-radial from-red-950/15 to-transparent shadow-[0_0_35px_rgba(185,28,28,0.15)] select-none focus:outline-none"
            onWheel={handleWheelRotation}
          >
            {/* Outer Runic Circle overlaying */}
            <div className="absolute inset-3 rounded-full border border-dashed border-red-900/25 pointer-events-none rotate-infinite" />
            
            {/* Compass directional arrows and markings */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <span className="absolute -top-1 font-mono text-[8px] text-red-900 font-bold">N</span>
              <span className="absolute -bottom-1 font-mono text-[8px] text-red-900 font-bold">S</span>
              <span className="absolute -left-1 font-mono text-[8px] text-red-900 font-bold">W</span>
              <span className="absolute -right-1 font-mono text-[8px] text-red-900 font-bold">E</span>
            </div>

            {/* Inner rotating Dial Plate */}
            <motion.div
              ref={dialRef}
              id="mystical-combination-dial"
              animate={{ rotate: rotation }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
              className="w-48 h-48 sm:w-52 sm:h-52 rounded-full bg-linear-to-b from-neutral-900 to-black border-2 border-red-950/85 relative flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.9)] cursor-grab active:cursor-grabbing hover:border-red-900/90 transition-colors"
            >
              {/* Central Metallic Core */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-neutral-950 border border-red-950 flex items-center justify-center shadow-[inset_0_4px_12px_rgba(0,0,0,0.95)] z-20">
                <Skull className={`w-6 h-6 transition-colors duration-500 ${isHovered ? "text-red-500 scale-110" : "text-red-900"}`} />
              </div>

              {/* Dial segments representing the 7 features */}
              {features.map((feat, index) => {
                // Calculate position around circumference
                const angle = index * segmentDegrees;
                // Offset angle so currently active segment lands pointing straight down or up
                const xCoord = 50 + 38 * Math.cos(((angle - 90) * Math.PI) / 180);
                const yCoord = 50 + 38 * Math.sin(((angle - 90) * Math.PI) / 180);

                const isActive = activeSegment === index;

                return (
                  <button
                    key={feat.id}
                    id={`dial-segment-trigger-${feat.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSegment(index);
                    }}
                    style={{
                      left: `${xCoord}%`,
                      top: `${yCoord}%`,
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`
                    }}
                    className={`absolute w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-black transition-all duration-300 z-10 cursor-pointer ${
                      isActive
                        ? "bg-red-900/95 text-white border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)] scale-115"
                        : "bg-black/90 text-gray-400 border-red-950/40 hover:text-red-500 hover:border-red-900 hover:scale-105"
                    }`}
                    title={feat.title}
                  >
                    <span>{getDialSegmentLabel(index)}</span>
                  </button>
                );
              })}
            </motion.div>

            {/* Glowing active dial arrow/marker in outer shell */}
            <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500 filter drop-shadow-[0_0_4px_#ef4444]" />
              <div className="w-[1px] h-4 bg-red-500" />
            </div>

          </div>

          {/* Quick Manual navigation arrows under dial */}
          <div className="flex items-center gap-6 mt-4 z-10">
            <button
              id="dial-prev-btn"
              onClick={handlePrev}
              className="p-1.5 rounded-lg border border-red-950/40 bg-neutral-950/30 hover:border-red-900 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Previous Feature"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[10px] text-gray-500 tracking-widest uppercase">
              ROTATE / CLICK
            </span>
            <button
              id="dial-next-btn"
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-red-950/40 bg-neutral-950/30 hover:border-red-900 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Next Feature"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: RICH PRESENTATION OF SEGMENT (md: 7 columns) */}
        <div className="col-span-1 md:col-span-7 flex flex-col justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSegment}
              initial={{ opacity: 0, x: 25, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -25, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`p-6 md:p-8 rounded-2xl bg-gradient-to-b ${features[activeSegment].colorClass} border border-red-950/20 shadow-inner flex flex-col md:flex-row gap-6 md:gap-8 items-start relative select-none`}
            >
              {/* Inner ambient glow */}
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black pointer-events-none rounded-2xl" />

              {/* Vector Icon on left/top */}
              <div className="p-3 bg-black/85 rounded-xl border border-red-950/50 shadow-md flex-shrink-0 relative z-10 self-center md:self-start">
                {features[activeSegment].icon}
              </div>

              {/* Dynamic Feature Text Details */}
              <div className="space-y-3.5 flex-grow text-left relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[9px] text-red-500 font-bold tracking-[0.25em] bg-red-950/30 px-2.5 py-1 rounded-md border border-red-950 uppercase">
                    {features[activeSegment].category}
                  </span>
                  <span className="font-mono text-[9px] text-gray-500 tracking-wider">
                   {activeSegment + 1} OF 7
                  </span>
                </div>

                <h3 className="font-goth-deco text-xl sm:text-2xl text-gray-100 font-bold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {features[activeSegment].title}
                </h3>

                <p className="font-serif text-[13px] sm:text-[14px] text-gray-300 leading-relaxed max-w-xl">
                  {features[activeSegment].description}
                </p>

                
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prompting instruction bar underneath features */}
          <div className="mt-5 text-center md:text-left flex items-center justify-center md:justify-start gap-2 px-1">
            <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
            <span className="font-mono text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest leading-none">
              JOIN THE WAITLIST BELOW TO UNLOCK 
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
