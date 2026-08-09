import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Layers,
  ZoomIn,
  ZoomOut,
  Upload,
  Music,
  Image as ImageIcon,
  Film,
  Sparkles,
  Settings2,
  X,
  Play,
  Pause
} from "lucide-react";

export interface PageMedia {
  type: "image" | "video";
  url: string; // Path or URL to PNG, JPG, WEBP or MP4, WEBM
  caption?: string;
}

export interface PageData {
  pageNumber: number;
  title: string;
  subtitle?: string;
  type?: string;
  bgGradient?: string;
  media?: PageMedia;
  audioUrl?: string; // Path or URL to custom page sound (MP3, WAV, OGG)
}

// ============================================================================
// MAGAZINE PAGES CONFIGURATION
// To customize pages:
// 1. Put your PNG/JPG image files or MP4 video files into the /public folder
//    (e.g., /public/pages/page1.png or /public/pages/page1.mp4)
// 2. Set `media: { type: "image", url: "/pages/page1.png" }` or `{ type: "video", url: "/pages/page1.mp4" }`
// 3. Set `audioUrl: "/sounds/page1_whisper.mp3"` to assign a custom sound effect to that page!
// ============================================================================
export const DEFAULT_MAGAZINE_PAGES: PageData[] = [
  {
    pageNumber: 1,
    title: "",
    subtitle: "Inaugural Edition • Front Cover",
    type: "Cover",
    bgGradient: "from-[#0d0303] via-black to-[#180505]",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200&auto=format&fit=crop",
      caption: ""
    },
    audioUrl: "" // Add your custom MP3 URL here e.g. "/sounds/cover_whisper.mp3"
  },
  {
    pageNumber: 2,
    title: "",
    subtitle: "Inaugural Edition • Page 02",
    type: "Contents",
    bgGradient: "from-black via-[#0a0202] to-[#120404]",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
      caption: ""
    },
    audioUrl: "" // e.g. "/sounds/page2_page_turn.mp3"
  },
  {
    pageNumber: 3,
    title: "",
    subtitle: "Featured Horror Story • Page 03",
    type: "Story",
    bgGradient: "from-[#0a0202] via-black to-[#0d0303]",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
      caption: ""
    },
    audioUrl: "" // e.g. "/sounds/page3_well_echo.mp3"
  },
  {
    pageNumber: 4,
    title: "",
    subtitle: "Paranormal Audio Archives • Page 04",
    type: "Video Teaser",
    bgGradient: "from-[#120404] via-[#080101] to-black",
    media: {
      type: "video",
      url: "https://assets.mixkit.co/videos/preview/mixkit-fog-rolling-over-dark-forest-trees-41584-large.mp4",
      caption: ""
    },
    audioUrl: "" // e.g. "/sounds/page4_static.mp3"
  },
  {
    pageNumber: 5,
    title: "",
    subtitle: "Macabre Woodcuts & Ink • Page 05",
    type: "Art Gallery",
    bgGradient: "from-black via-[#0d0303] to-[#100404]",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
      caption: ""
    },
    audioUrl: "" // e.g. "/sounds/page5_creak.mp3"
  },
  {
    pageNumber: 6,
    title: "",
    subtitle: "End of Preview • Back Cover",
    type: "Back Cover",
    bgGradient: "from-[#150404] via-[#090202] to-black",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=1200&auto=format&fit=crop",
      caption: ""
    },
    audioUrl: "" // e.g. "/sounds/back_cover_bell.mp3"
  }
];

export default function FlipbookMagazine() {
  const [pages, setPages] = useState<PageData[]>(DEFAULT_MAGAZINE_PAGES);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [showMediaEditor, setShowMediaEditor] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Play custom audio for page or fallback to default swoosh
  const triggerPageAudio = (pageIndex: number) => {
    if (!soundEnabled) return;

    // Stop previous audio if playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    const page = pages[pageIndex];
    if (page?.audioUrl) {
      try {
        const customAudio = new Audio(page.audioUrl);
        customAudio.volume = 0.5;
        customAudio.play().catch(() => {
          playDefaultPageFlipSound();
        });
        currentAudioRef.current = customAudio;
        return;
      } catch (err) {
        // Fallback to default
      }
    }

    playDefaultPageFlipSound();
  };

  // Default synthetic page flip sound effect
  const playDefaultPageFlipSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio permission blocked or unsupported
    }
  };

  const totalPages = pages.length;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const nextIdx = currentPage + 1;
      setFlipDirection("next");
      setCurrentPage(nextIdx);
      triggerPageAudio(nextIdx);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prevIdx = currentPage - 1;
      setFlipDirection("prev");
      setCurrentPage(prevIdx);
      triggerPageAudio(prevIdx);
    }
  };

  const handlePageSelect = (idx: number) => {
    if (idx !== currentPage) {
      setFlipDirection(idx > currentPage ? "next" : "prev");
      setCurrentPage(idx);
      triggerPageAudio(idx);
    }
  };

  // Keyboard Navigation (Left / Right Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNextPage();
      if (e.key === "ArrowLeft") handlePrevPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, soundEnabled]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Local media upload handler for testing PNG/MP4/MP3 replacements in browser
  const handlePageMediaUpload = (pageIdx: number, file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith("video/") || file.name.endsWith(".mp4") || file.name.endsWith(".webm");
    const isAudio = file.type.startsWith("audio/") || file.name.endsWith(".mp3") || file.name.endsWith(".wav");

    setPages((prevPages) =>
      prevPages.map((p, idx) => {
        if (idx !== pageIdx) return p;
        if (isAudio) {
          return { ...p, audioUrl: fileUrl };
        } else {
          return {
            ...p,
            media: {
              type: isVideo ? "video" : "image",
              url: fileUrl,
              caption: `Uploaded File: ${file.name}`
            }
          };
        }
      })
    );
  };

  const activePage = pages[currentPage];

  return (
    <section id="flipbook-showcase-section" className="w-full max-w-5xl mx-auto my-12 px-2 sm:px-4">
      {/* Section Header */}
      <div className="text-center mb-6 space-y-2">
        <h2 className="font-gothic text-2xl sm:text-3xl text-white font-normal tracking-wide">
          A SNEAK PEEK 
        </h2>
        <p className="font-serif text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
          A glimpse of how your Hallloween gonna look this year  
        </p>
      </div>

      {/* Main Flipbook Wrapper */}
      <div
        ref={containerRef}
        className={`relative bg-[#070303] border-2 border-red-950/80 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.15)] overflow-hidden transition-all duration-300 ${
          isFullscreen ? "p-6 flex flex-col justify-center items-center h-screen" : "p-4 sm:p-6"
        }`}
      >
        {/* Flipbook Top Bar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-950/80 pb-3 mb-4 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold">WRIDROT INAUGURAL ISSUE</span>
            <span className="text-gray-600">|</span>
            <span>
              Page <strong className="text-white">{currentPage + 1}</strong> of {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Media Customizer Toggle */}
            <button
              onClick={() => setShowMediaEditor(!showMediaEditor)}
              className={`p-1.5 rounded flex items-center gap-1 text-[11px] transition ${
                showMediaEditor
                  ? "bg-red-950 text-red-300 border border-red-800"
                  : "bg-black/60 text-gray-400 hover:text-white border border-gray-900"
              }`}
              title="Replace PNG / MP4 / Audio for Pages"
            >
              <Settings2 className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">Page Media Setup</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Disable Page Sounds" : "Enable Page Sounds"}
              className={`p-1.5 rounded transition ${
                soundEnabled ? "bg-red-950/60 text-red-400 border border-red-900/50" : "bg-black/60 text-gray-600 hover:text-gray-300"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Thumbnails Drawer Toggle */}
            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`p-1.5 rounded flex items-center gap-1 text-[11px] transition ${
                showThumbnails ? "bg-red-950/80 text-red-300 border border-red-800" : "bg-black/60 text-gray-400 hover:text-white border border-gray-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pages</span>
            </button>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-black/60 border border-gray-900 rounded p-0.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
                className="p-1 text-gray-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-gray-400 px-1">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
                className="p-1 text-gray-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 bg-black/60 border border-gray-900 rounded text-gray-400 hover:text-white transition"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        

        {/* Thumbnail Drawer */}
        <AnimatePresence>
          {showThumbnails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4 border-b border-red-950/80 pb-3"
            >
              <div className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-red-950">
                {pages.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageSelect(idx)}
                    className={`flex-shrink-0 w-24 h-32 rounded-lg border transition text-left p-2 flex flex-col justify-between overflow-hidden relative group ${
                      currentPage === idx
                        ? "border-red-500 bg-red-950/50 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                        : "border-gray-800 bg-black/60 hover:border-gray-600"
                    }`}
                  >
                    {/* Thumbnail background image preview if available */}
                    {p.media?.type === "image" && (
                      <img src={p.media.url} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition" />
                    )}
                    <div className="relative z-10">
                      <span className="text-[9px] font-mono text-red-400 font-bold block">PG. 0{idx + 1}</span>
                      <p className="text-[10px] font-serif text-gray-200 line-clamp-2 leading-tight font-semibold mt-0.5">{p.title}</p>
                    </div>
                    <div className="relative z-10 flex justify-between items-center text-[8px] font-mono text-gray-400">
                      <span>{p.type || "Page"}</span>
                      {p.media?.type === "video" ? <Film className="w-2.5 h-2.5 text-red-400" /> : <ImageIcon className="w-2.5 h-2.5 text-gray-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flipbook Stage Area */}
        <div className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[520px] flex items-center justify-center my-2">
          {/* Previous Page Arrow */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`absolute left-1 sm:left-3 z-30 p-2 sm:p-3 rounded-full bg-black/80 border border-red-900/60 text-white shadow-2xl transition-all duration-200 ${
              currentPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-red-950 hover:scale-110 active:scale-95"
            }`}
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5 text-red-400" />
          </button>

          {/* Magazine Book Container */}
          <div
            className="w-full max-w-2xl h-[420px] sm:h-[480px] md:h-[500px] relative transition-transform duration-300 transform-gpu"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Book Spine Shadow */}
            <div className="absolute top-0 bottom-0 left-1/2 w-8 -ml-4 z-20 pointer-events-none bg-gradient-to-r from-transparent via-black/80 to-transparent opacity-80" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{
                  rotateY: flipDirection === "next" ? 45 : -45,
                  opacity: 0,
                  scale: 0.96
                }}
                animate={{
                  rotateY: 0,
                  opacity: 1,
                  scale: 1
                }}
                exit={{
                  rotateY: flipDirection === "next" ? -45 : 45,
                  opacity: 0,
                  scale: 0.96
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`w-full h-full rounded-xl bg-gradient-to-b ${
                  activePage.bgGradient || "from-black via-[#0a0202] to-black"
                } border border-red-950 shadow-[0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden relative group`}
              >
                {/* RENDERING PAGE MEDIA (PNG / JPG or MP4 VIDEO) */}
                {activePage.media ? (
                  <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-black">
                    {activePage.media.type === "video" ? (
                      <video
                        src={activePage.media.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={activePage.media.url}
                        alt={activePage.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    )}

                    {/* Gradient Overlay for Readable Page Branding */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

                    {/* Top Page Header Tag */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-[10px] font-mono text-red-400 uppercase tracking-widest z-10 drop-shadow-md">
                      <span className="bg-black/70 px-2 py-0.5 rounded border border-red-950/60">
                        {activePage.type || "WRIDROT MAGAZINE"}
                      </span>
                      <span className="bg-black/70 px-2 py-0.5 rounded border border-red-950/60 font-bold text-white">
                        PG. 0{activePage.pageNumber}
                      </span>
                    </div>

                    {/* Bottom Caption Overlay */}
                    <div className="absolute bottom-4 left-4 right-12 z-10 text-left space-y-0.5">
                      <h3 className="font-gothic text-lg sm:text-xl text-white font-normal drop-shadow-lg">
                        {activePage.title}
                      </h3>
                      {activePage.subtitle && (
                        <p className="font-serif italic text-xs text-red-300 drop-shadow">
                          {activePage.subtitle}
                        </p>
                      )}
                      {activePage.media.caption && (
                        <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider pt-0.5">
                          {activePage.media.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Fallback display if no media URL provided */
                  <div className="h-full flex flex-col justify-between p-6 sm:p-8 text-center select-none border-4 border-red-950/60">
                    <div className="my-auto space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-red-950/40 border border-red-800 flex items-center justify-center text-red-500">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <h3 className="font-gothic text-2xl text-white">{activePage.title}</h3>
                      <p className="font-serif text-xs text-gray-400 max-w-sm mx-auto">
                        Add your PNG or MP4 media file to the <code className="text-red-400 font-mono">DEFAULT_MAGAZINE_PAGES</code> array in code or use the "Page Media Setup" panel above to preview your file.
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-gray-600 border-t border-gray-900 pt-2">
                      PAGE 0{activePage.pageNumber} • WRIDROT MAGAZINE
                    </div>
                  </div>
                )}

                {/* Page Corner Curl Visual Trigger */}
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={handleNextPage}
                    className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-red-900/60 via-red-950/30 to-transparent hover:from-red-800/80 cursor-pointer transition-all flex items-end justify-end p-2 group z-20"
                    title="Flip Next Page"
                  >
                    <span className="text-[10px] font-mono text-red-400 group-hover:scale-125 transition">→</span>
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next Page Arrow */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className={`absolute right-1 sm:right-3 z-30 p-2 sm:p-3 rounded-full bg-black/80 border border-red-900/60 text-white shadow-2xl transition-all duration-200 ${
              currentPage === totalPages - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-red-950 hover:scale-110 active:scale-95"
            }`}
            aria-label="Next Page"
          >
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>

        {/* Flipbook Footer Bar & Page Indicator */}
        <div className="mt-4 pt-3 border-t border-red-950/80 flex flex-wrap items-center justify-between text-xs text-gray-500 font-mono gap-2">
          
          {/* Quick Page Jump Dots */}
          <div className="flex items-center gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageSelect(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentPage === i ? "bg-red-500 w-5" : "bg-gray-800 hover:bg-gray-600"
                }`}
                title={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <div className="text-[10px] text-gray-500">
            USE ← / → ARROWS TO FLIP
          </div>
        </div>
      </div>
    </section>
  );
}

