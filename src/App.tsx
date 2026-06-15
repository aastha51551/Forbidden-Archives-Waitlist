import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Skull, HelpCircle, Archive, BookOpen, Send, CheckCircle2, Search, ArrowRight, BookOpenCheck } from "lucide-react";
import GothicForm from "./components/GothicForm";
import GothicDial from "./components/GothicDial";
import ThreeDToken from "./components/ThreeDToken";
import { WaitlistUser, ShareChannel } from "./types";

export default function App() {
  const [currentUser, setCurrentUser] = useState<WaitlistUser | null>(null);
  const [liveCount, setLiveCount] = useState<number>(0); // Starts from 0 as requested!
  const [retrievalId, setRetrievalId] = useState("");
  const [retrievalError, setRetrievalError] = useState<string | null>(null);
  const [retrievalSuccess, setRetrievalSuccess] = useState(false);
  const [dbSetupError, setDbSetupError] = useState<{ code: string; message: string; projectId: string } | null>(null);

  // Fetch live count from server on load & poll every 6 seconds to keep it real-time!
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/waitlist/count");
        if (res.ok) {
          const data = await res.json();
          setLiveCount(data.count);
          if (data.firestore_error) {
            setDbSetupError(data.firestore_error);
          } else {
            setDbSetupError(null);
          }
        }
      } catch (err) {
        console.error("Failed to query live seeker count:", err);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 6000);
    return () => clearInterval(interval);
  }, []);

  // Check URL segments or search parameters on load
  useEffect(() => {
    const checkUrlState = async () => {
      // 1. Check path segments (e.g. /token/FA-XXXXXX)
      const pathSegments = window.location.pathname.split("/");
      const tokenIndex = pathSegments.indexOf("token");
      if (tokenIndex !== -1 && pathSegments[tokenIndex + 1]) {
        const tokenId = pathSegments[tokenIndex + 1];
        await retrieveUserToken(tokenId);
        return;
      }

      // 2. Check search parameters (e.g. ?token=FA-XXXXX&just_verified=true)
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get("token");
      const justVerified = params.get("just_verified");

      if (tokenParam) {
        await retrieveUserToken(tokenParam);
        if (justVerified === "true") {
          triggerGothicConfetti();
          // Strip parameters to clean browser address bar nicely
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };
    checkUrlState();
  }, []);

  // Retrieve user waitlist entries by their Token ID
  const retrieveUserToken = async (id: string) => {
    setRetrievalError(null);
    setRetrievalSuccess(false);
    const cleanedId = id.trim().toUpperCase();

    if (!cleanedId) return;

    try {
      const res = await fetch(`/api/waitlist/token/${cleanedId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Token seal was not found in the archives.");
      }
      const data = await res.json();
      setCurrentUser(data.user);
      setRetrievalSuccess(true);
    } catch (err: any) {
      setRetrievalError(err.message || "Failed to retrieve your token scroll.");
    }
  };

  // Trigger real-time sharing statistics to the server side
  const handleShareRecorded = async (channel: ShareChannel) => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/waitlist/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentUser.id, channel })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser({
          ...currentUser,
          shares: data.shares
        });
      }
    } catch (err) {
      console.error("Failed to post share meta:", err);
    }
  };

  // Clean signup enrollment handle
  const handleRegisterSuccess = (user: WaitlistUser) => {
    setCurrentUser(user);
    triggerGothicConfetti();
    // Pre-populate retrieval ID
    setRetrievalId(user.id);
  };

  // Spectacular coven crimson-themed confetti explosion for premium feedback
  const triggerGothicConfetti = () => {
    const end = Date.now() + 1.2 * 1000;
    const colors = ["#7f1d1d", "#f43f5e", "#991b1b", "#fb7185", "#f59e0b"]; // crimson, ruby, gold, amber

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="min-h-screen bg-[#030101] flex flex-col items-center relative Selection:bg-red-900 Selection:text-white pb-12 animate-crt select-none">
      
      

      {/* 2. Vintage CRT overlay glow effects */}
      <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-red-950/15 via-black/0 to-transparent pointer-events-none" />

      {/* Global Page Layout Container */}
      <div className="container max-w-6xl mx-auto px-4 pt-10 md:pt-16 relative z-10 flex-grow">
        
        {/* Header Branding (Styled exactly after Image 2) */}
        <header className="text-center mb-10 md:mb-16">
          
            <span className="block text-[10px] md:text-xs font-mono tracking-[0.25em] text-red-500 uppercase font-semibold mb-2 bg-red-950/25 px-4 py-1.5 rounded-full border border-red-950">
              YOUR NIGHTMARE FUEL
            </span>
          
          
          <h1 className="font-goth-deco text-4xl sm:text-5xl md:text-[5.5rem] text-gray-200 mt-2 tracking-wide font-bold">
            FORBIDDEN
          </h1>
          <h2 className="font-goth-deco text-2xl sm:text-3.5xl md:text-[4rem] text-red-600 tracking-wider font-semibold -mt-1 md:-mt-4">
            ARCHIVES
          </h2>

          <p className="max-w-2xl mx-auto font-serif text-xs md:text-sm text-gray-400 mt-5 leading-relaxed leading-6 tracking-wide px-4">
            An online horror magazine by horror fans for horror fans. Scroll ahead with trembling fingers.
          </p>
        </header>

        {/* Dynamic Waitlist Real-Time Ticker / Seaker Counter banner */}
        <section id="live-seeker-counter" className="w-full max-w-sm mx-auto mb-12 flex items-center justify-center gap-3.5 p-3.5 rounded-xl bg-[#090303] border border-red-950/40 shadow-inner">
          {/* Neon pulsating dot */}
          {/* <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </div>

          <div className="font-mono text-xs text-gray-400">
            THE CIRCLE OF SEEKERS: 
            <span className="text-red-500 font-bold ml-1.5 text-sm underline decoration-red-950 decoration-wavy">
              {liveCount.toLocaleString()}
            </span> 
            <span className="text-[10px] text-gray-500 ml-1"> ACTIVE</span>
          </div> */}
        </section>
        
        <GothicDial />
        {dbSetupError && (
          <section id="firebase-setup-helper-card" className="w-full max-w-2xl mx-auto mb-12 p-6 rounded-2xl bg-[#0b0303] border-2 border-dashed border-red-900/80 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-fade-in relative overflow-hidden text-left relative z-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-950/10 rounded-full filter blur-2xl pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-950/40 rounded-full border border-red-900/50 mt-1 flex-shrink-0 animate-pulse">
                <Skull className="w-5 h-5 text-red-500" />
              </div>
              <div className="space-y-4 flex-grow">
                <div>
                  <h3 className="font-serif-goth text-lg text-red-400 font-bold tracking-wide">
                    COVEN VAULT DEPLOYMENT REQUIRED
                  </h3>
                  <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                    Cloud Firestore is pending activation
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MAIN BODY GRID */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start xl:px-8">
          
          {/* LEFT PANEL: Form / Access portal panel (5 columns) */}
          <section className="lg:col-span-5 space-y-8 flex flex-col justify-center">
            {!currentUser ? (
              <>
                {/* Gothic Register Form Component */}
                <GothicForm onSuccess={handleRegisterSuccess} />
              </>
            ) : (
              <div id="waitlist-registered-welcome" className="p-6 rounded-2xl bg-[#090303]/90 border border-emerald-950/60 shadow-2xl space-y-5 animate-fade-in relative overflow-hidden">
                
                {/* Visual success background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-950/15 rounded-full pointer-events-none filter blur-2xl" />

                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-950/60 p-2 border border-emerald-900/40">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-serif text-white font-bold tracking-wider text-base">
                      SECURELY
                    </h3>
                    <p className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest">
                      Registered At Rank #{currentUser.displayNumber}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-gray-300 leading-relaxed leading-5">
                  <p>
                    Congratulations, <strong className="text-white text-sans font-semibold">{currentUser.name}</strong>. Your email (<em>{currentUser.email}</em>) has been registered with us.
                  </p>
                  <p>
                    Your digital membership token is ready and displayed on the right. You can hover, drag, and tilt the card in 3D using your mouse or screen coordinate. 
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Feel free to download your custom ambient HD motion video to post it on your Instagram, WhatsApp, and socials to flex and invite your friends!
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-900 flex justify-between items-center">
                  <span className="font-mono text-[9px] text-gray-600">
                    TOKEN SECURED FOR LIFE
                  </span>
                  
                  <button
                    id="register-another-btn"
                    onClick={() => {
                      setCurrentUser(null);
                      setRetrievalSuccess(false);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-red-950/30 text-red-400 border border-red-900/40 hover:bg-neutral-900 text-[10px] font-mono tracking-widest rounded transition-all cursor-pointer"
                  >
                    REGISTER FOR A NEW PASS
                  </button>
                </div>
              </div>
            )}

            {/* Retrieval scroll box */}
            <div id="token-retrieval-box" className="p-5 rounded-2xl bg-[#050101]/60 border border-gray-950/80 mt-2 shadow-inner">
              <h4 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                <Archive className="w-3.5 h-3.5 text-gray-600" />
                RETRIEVE YOUR TOKEN
              </h4>
              
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    id="retrieve-token-input"
                    type="text"
                    value={retrievalId}
                    onChange={(e) => setRetrievalId(e.target.value)}
                    placeholder="ENTER TOKEN ID (e.g. FA-10943)"
                    className="w-full pl-9 pr-3 py-1.5 bg-black text-xs text-gray-300 font-mono border border-gray-900 rounded-lg placeholder-gray-800 focus:outline-none focus:border-red-950/80 transition-all uppercase"
                  />
                </div>
                
                <button
                  id="retrieve-scroll-btn"
                  onClick={() => retrieveUserToken(retrievalId)}
                  className="px-4 py-1.5 bg-neutral-950/40 text-gray-300 border border-neutral-900 hover:border-red-950 hover:text-red-400 text-[10px] font-mono rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  LOAD
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {retrievalError && (
                <p id="retrieve-error-notice" className="text-[10px] text-red-500 font-mono mt-2 pl-1 animate-pulse flex items-center gap-1">
                  ⚠ {retrievalError}
                </p>
              )}
              {retrievalSuccess && (
                <p id="retrieve-success-notice" className="text-[10px] text-emerald-500 font-mono mt-2 pl-1 flex items-center gap-1 bg-emerald-950/10 py-1 px-2 border border-emerald-950/20 rounded">
                  <BookOpenCheck className="w-3.5 h-3.5" />
                  Token retrieved successfully!
                </p>
              )}
            </div>

          </section>

          {/* RIGHT PANEL: Dynamic 3D Token Oracle Display (7 columns) */}
          <section className="lg:col-span-7 flex flex-col items-center justify-center bg-[#070303]/40 border border-red-950/10 p-4 md:p-8 rounded-3xl backdrop-blur-sm self-stretch shrink-0">
            <h3 className="font-serif-goth text-lg text-gray-200 mb-6 flex items-center gap-2">
              <Skull className="w-4 h-4 text-red-500 animate-pulse" />
              DIGITAL MEMBERSHIP TOKEN
            </h3>
            
            {/* Real 3D interactive Token Viewer Canvas */}
            <ThreeDToken 
              user={currentUser} 
              onShareRecorded={handleShareRecorded} 
            />
          </section>

        </main>

        {/* 3. FOOTER (Branding styled exactly after Image 2) */}
        <footer className="w-full border-t border-red-950/20 mt-16 pt-8 pb-4 text-center">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-5">
            <a 
              href="mailto:aasthacreateshorror@gmail.com"
              className="px-5 py-2 hover:bg-red-950/25 border border-red-950/40 hover:border-red-800 text-gray-400 hover:text-red-400 text-[9px] md:text-xs font-mono tracking-widest uppercase rounded font-medium transition-all cursor-pointer inline-block"
            >
              CONTACT US
            </a>
          </div>
          
          <p className="font-mono text-[9px] text-gray-700 tracking-wider">
            © {new Date().getFullYear()} FORBIDDEN ARCHIVES. ALL RIGHTS RESERVED.
          </p>
        </footer>

      </div>
    </div>
  );
}
