"use client";

import { useState, useEffect } from "react";

const frameSources = [
  "/videos/Video%20Frame%20Extractor%202026-04-04%2014_34_18%20GMT%2B5_30/01.png",
  "/videos/Video%20Frame%20Extractor%202026-04-04%2014_34_18%20GMT%2B5_30/09.png",
  "/videos/Video%20Frame%20Extractor%202026-04-04%2014_34_18%20GMT%2B5_30/17.png",
  "/videos/Video%20Frame%20Extractor%202026-04-04%2014_34_18%20GMT%2B5_30/25.png",
  "/videos/Video%20Frame%20Extractor%202026-04-04%2014_34_18%20GMT%2B5_30/33.png",
  "/videos/Video%20Frame%20Extractor%202026-04-04%2014_34_18%20GMT%2B5_30/41.png",
  "/videos/Video%20Frame%20Extractor%202026-04-04%2014_34_18%20GMT%2B5_30/49.png",
  "/videos/Video%20Frame%20Extractor%202026-04-04%2014_34_18%20GMT%2B5_30/57.png",
  "/videos/Video%20Frame%20Extractor%202026-04-04%2014_34_18%20GMT%2B5_30/65.png"
];

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [bootText, setBootText] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);

  const bootMessages = [
    "Booting developer workspace...",
    "Loading libraries...",
    "Connecting APIs...",
    "Compiling components...",
    "Launching portfolio..."
  ];

  useEffect(() => {
    if (bootText < bootMessages.length) {
      const timer = setTimeout(() => {
        setBootText((prev) => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setLoading(false), 800);
    }
  }, [bootText, bootMessages.length]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    frameSources.forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    const scrollRange = window.innerHeight * 5.5;
    const progress = Math.max(0, Math.min(scrollY / scrollRange, 1));
    const nextIndex = Math.min(frameSources.length - 1, Math.floor(progress * frameSources.length));

    setFrameIndex(nextIndex);
  }, [scrollY]);

  // Cinematic scroll & scale for hero (removed darkening)
  const maxScroll = typeof window !== "undefined" ? window.innerHeight * 4 : 3200;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
  const videoOpacity = 1; // stay fully visible
  const videoScale = isDesktop ? 1 + scrollProgress * 0.04 : 1 + scrollProgress * 0.15;
  
  // Bring the text up as we scroll
  const textTranslateY = Math.max(0, 200 - scrollY * 0.5); // Starts lower, moves up smoothly as you scroll
  const heroTextOpacity = Math.min(1, scrollY / 400); // Fades in quickly as you scroll down
  const statementOpacity = scrollProgress > 0.8 ? Math.min((scrollProgress - 0.8) * 5, 1) : 0;


  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030305] text-cyan-400 font-mono overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20 pointer-events-none" />
        <div className="w-full max-w-md px-8 text-center relative z-10">
          <h1 className="text-4xl font-bold tracking-widest text-white mb-12 animate-pulse glow-text">ANI.DEV</h1>
          <div className="h-32 text-left mb-8 text-sm">
            {bootMessages.slice(0, bootText).map((msg, i) => (
              <p key={i} className="mb-2 opacity-80 animate-fade-in-up flex items-center">
                <span className="text-green-500 mr-3">✓</span> {msg}
              </p>
            ))}
            {bootText < bootMessages.length && (
              <p className="animate-pulse pl-5 opacity-70">_</p>
            )}
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-cyan-500 transition-all duration-500 ease-out shadow-[0_0_10px_#06b6d4]"
              style={{ width: `${(bootText / bootMessages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 font-sans selection:bg-cyan-900 selection:text-cyan-100 overflow-x-clip">
      {/* Background Ambience / Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_80%_at_50%_40%,#000_20%,transparent_100%)] opacity-30" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 border-b ${scrollY > 50 ? 'bg-[#0a0a0c]/80 backdrop-blur-md border-white/5 shadow-lg' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter text-white glow-text">ANI.DEV</div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#home" className="hover:text-cyan-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-xs font-mono">GH</a>
            <a href="https://linkedin.com" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-xs font-mono">IN</a>
            <a href="#contact" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-xs font-mono">@</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col gap-32 pb-32">
        {/* HERO SECTION - Scroll controls video playback */}
        <section id="home" className="relative w-full h-[600vh] lg:h-[700vh]">
          {/* Sticky Video Background */}
          <div className="sticky top-0 w-full h-screen overflow-hidden z-0 bg-[#0a0a0c]">
            <img
              src={frameSources[frameIndex]}
              alt="Scrolling frame sequence"
              className="absolute inset-0 w-full h-full object-cover lg:object-contain object-center transform-gpu will-change-[transform,opacity,filter]"
              style={{ 
                opacity: videoOpacity, 
                transform: `scale(${videoScale})`
              }}
            />
            
            {/* Dark vignette gradient overlay for text readability later */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0c_0%,transparent_30%,transparent_100%)] opacity-50" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_60%,#0a0a0c_100%)] opacity-60" />

            {/* Reveal Hero Text - Placed inside the sticky container so it hovers during scroll */}
            <div className="absolute inset-0 flex items-center w-full max-w-7xl mx-auto px-6 z-10 pointer-events-none">
              <div 
                className="max-w-2xl pl-0 py-8 lg:pl-8 transition-transform duration-75 transform-gpu pointer-events-auto will-change-transform"
                style={{ opacity: heroTextOpacity, transform: `translateY(${textTranslateY}px)` }}
              >
                <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono tracking-wide shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" /> SYSTEM ONLINE
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-none mb-6 drop-shadow-2xl">
                  Ani
                </h1>
                <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight drop-shadow-lg">
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">Full Stack Developer</span>
                </h2>
                <p className="text-lg text-slate-300 font-light mb-10 max-w-xl drop-shadow-lg">
                  Building modern web systems. <br />
                  <span className="text-slate-400 mt-2 block">
                    I construct interactive web experiences, scalable backend structures, and high-performance tools driving today's web ecosystems.
                  </span>
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#projects" className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]">
                    View Projects
                  </a>
                  <a href="#contact" className="px-8 py-4 bg-[#0a0a0c]/80 text-white font-bold rounded-lg hover:bg-[#111116] backdrop-blur-md transition-all shadow-xl">
                    Contact Me
                  </a>
                </div>
              </div>
            </div>

            {/* "Scroll to start" initial prompt that vanishes on scroll */}
            <div 
              className="absolute bottom-12 left-1/2 -translate-x-1/2 text-cyan-400 font-mono text-sm tracking-widest flex flex-col items-center gap-2 animate-bounce transition-opacity duration-300"
              style={{ opacity: scrollY > 50 ? 0 : 1 }}
            >
              SCROLL <span className="w-px h-8 bg-cyan-500/50 block"></span>
            </div>
          </div>
        </section>

        {/* CINEMATIC TRANSITION STATEMENT */}
        <section className="py-32 flex items-center justify-center relative mt-[-20vh]">
          <div className="absolute top-1/2 left-0 w-full h-px bg-[linear-gradient(to_right,transparent,var(--tw-gradient-stops),transparent)] from-cyan-500/50 to-transparent" />
          <h2
            className="text-4xl md:text-7xl font-black text-center text-white/90 tracking-tight relative z-10 px-6 glow-text transition-opacity duration-500"
            style={{ opacity: statementOpacity }}
          >
            Crafting modern web experiences.
          </h2>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="max-w-7xl mx-auto px-6 w-full fade-in-section">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-1 bg-linear-to-r from-cyan-500 to-blue-500 mb-8 rounded-full" />
              <h3 className="text-4xl font-bold text-white mb-6 leading-tight">
                Developer focused on building <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">interactive modern web experiences.</span>
              </h3>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                My digital workspace fuses cutting-edge frontend interactions with deep, robust backend architectures. By abstracting complexity, I craft modular systems that look elegant and scale efficiently on the cloud.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-cyan-500/50 transition-all text-white font-medium shadow-sm">
                  Download Resume
                </button>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-cyan-500/50 transition-all text-white font-medium shadow-sm">
                  View GitHub
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Projects Built", value: "38+", color: "from-cyan-500/10" },
                { label: "Technologies Used", value: "24+", color: "from-blue-500/10" },
                { label: "Years Learning", value: "5+", color: "from-indigo-500/10" },
                { label: "Commits", value: "2K+", color: "from-purple-500/10" }
              ].map((stat, i) => (
                <div key={i} className={`p-8 rounded-xl border border-white/5 bg-linear-to-br ${stat.color} to-transparent backdrop-blur-md hover:border-cyan-500/30 transition-all hover:-translate-y-1 group shadow-[inset_0_1px_rgba(255,255,255,0.1)]`}>
                  <div className="text-4xl font-black text-white mb-2 group-hover:text-cyan-300 transition-colors glow-text">
                    {stat.value}
                  </div>
                  <div className="text-sm font-mono text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEARNING JOURNEY */}
        <section className="max-w-4xl mx-auto px-6 w-full relative pt-20">
          <h3 className="text-sm font-mono text-cyan-400 mb-16 tracking-[0.2em] text-center flex items-center justify-center gap-4 before:h-1px before:w-16 before:bg-cyan-500/30 after:h-1px after:w-16 after:bg-cyan-500/30">
            LEARNING JOURNEY
          </h3>
          <div className="relative border-l border-cyan-500/20 pl-8 space-y-12 before:absolute before:inset-y-0 before:left--1px before:w-2px before:bg-linear-to-b before:from-cyan-500/80 before:via-blue-500/50 before:to-transparent">
            {[
              { year: "Present", title: "Master of Computer Applications", desc: "Focusing on advanced system architecture, cloud computing, and full-stack engineering." },
              { year: "2022 - 2025", title: "Bachelor of Computer Applications", desc: "Core programming, database management, web technologies, and software development lifecycle." },
              { year: "2020 - 2022", title: "Higher Secondary Education", desc: "Computer Science major. Built foundational logic, algorithms, and mathematics." },
              { year: "2020", title: "Secondary Education", desc: "Introduction to programming principles and analytical problem-solving." }
            ].map((milestone, i) => (
              <div key={i} className="relative group">
                <div className="absolute w-3 h-3 rounded-full bg-cyan-400 -left-9.5 top-1.5 group-hover:scale-[1.7] group-hover:shadow-[0_0_15px_#06b6d4] group-hover:bg-white transition-all duration-300" />
                <div className="bg-[#111116] border border-white/5 p-6 rounded-xl backdrop-blur-md hover:bg-[#15151c] hover:border-cyan-500/30 transition-all shadow-lg">
                  <span className="text-xs font-mono text-cyan-400 mb-2 block tracking-wider">{milestone.year}</span>
                  <h4 className="text-xl font-bold text-white mb-2">{milestone.title}</h4>
                  <p className="text-slate-400">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TECHNICAL ARSENAL */}
        <section id="skills" className="max-w-7xl mx-auto px-6 w-full pt-20">
          <h3 className="text-sm font-mono text-cyan-400 mb-16 tracking-[0.2em] text-center flex items-center justify-center gap-4 before:h-1px before:w-16 before:bg-cyan-500/30 after:h-1px after:w-16 after:bg-cyan-500/30">
            TECHNICAL ARSENAL
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { category: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"] },
              { category: "Backend", skills: ["Node.js", "Express", "REST APIs", "GraphQL", "Socket.IO"] },
              { category: "Database", skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Supabase"] },
              { category: "Tools", skills: ["Git", "GitHub", "Postman", "VS Code", "Figma"] },
              { category: "DevOps", skills: ["Docker", "AWS", "Vercel", "Linux", "CI/CD"] },
              { category: "Core", skills: ["Data Structures", "Algorithms", "System Design", "Agile", "OOP"] }
            ].map((group, i) => (
               <div key={i} className="bg-[#111116] border border-white/5 rounded-xl p-8 hover:border-cyan-500/30 transition-all group shadow-xl">
                 <h4 className="text-white font-bold text-xl mb-6 flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-cyan-500 glow-pulse" />
                   {group.category}
                 </h4>
                 <div className="space-y-4">
                   {group.skills.map((skill, j) => (
                     <div key={j} className="cursor-default">
                       <div className="flex justify-between text-sm mb-1.5 text-slate-400 group-hover:text-slate-300 font-mono">
                         <span>{skill}</span>
                       </div>
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-linear-to-r from-cyan-500 to-blue-500 w-full opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            ))}
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="max-w-7xl mx-auto px-6 w-full pt-20">
          <h3 className="text-sm font-mono text-cyan-400 mb-16 tracking-[0.2em] text-center flex items-center justify-center gap-4 before:h-1px before:w-16 before:bg-cyan-500/30 after:h-px after:w-16 after:bg-cyan-500/30">
            WORKING PROCESS
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent -z-10" />
            {[
              { step: "01", title: "Research" },
              { step: "02", title: "Design" },
              { step: "03", title: "Build" },
              { step: "04", title: "Test" },
              { step: "05", title: "Deploy" }
            ].map((process, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default w-full md:w-auto">
                <div className="w-16 h-16 rounded-full bg-[#111116] border border-white/10 flex items-center justify-center font-mono text-xl text-slate-500 group-hover:border-cyan-400 group-hover:text-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover:-translate-y-2 transition-all duration-300 bg-linear-to-b from-white/5 to-transparent z-10 mb-4 shadow-lg">
                  {process.step}
                </div>
                <div className="font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">{process.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECT SHOWCASE */}
        <section id="projects" className="max-w-7xl mx-auto px-6 w-full pt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h3 className="text-sm font-mono text-cyan-400 tracking-[0.2em] mb-4">SELECTED WORK</h3>
              <h2 className="text-4xl md:text-5xl font-black text-white">System Case Studies</h2>
            </div>
            <a href="https://github.com" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm hover:underline underline-offset-4">
              VIEW GITHUB ARCHIVE →
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "PulseBoard",
                desc: "Real-time analytics dashboard for multi-service monitoring with stream-based alerts and dynamic visualizations.",
                tags: ["Next.js", "Node", "WebSockets", "Tailwind"]
              },
              {
                title: "CodeFoundry",
                desc: "Developer collaboration suite featuring live coding rooms, automated tests, and distributed task boards.",
                tags: ["React", "MongoDB", "Express", "Docker"]
              },
              {
                title: "NeonStack CMS",
                desc: "Headless content infrastructure for product teams shipping fast, localized experiences worldwide.",
                tags: ["TypeScript", "PostgreSQL", "Prisma", "AWS"]
              },
              {
                title: "Atlas Stream",
                desc: "Enterprise-grade data pipeline interface for managing large-scale, low-latency streaming workflows.",
                tags: ["Next.js", "GraphQL", "Redis", "Kafka"]
              }
            ].map((proj, i) => (
              <div key={i} className="group relative rounded-2xl border border-white/5 bg-[#111116] overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(34,211,238,0.2)] block">
                <div className="aspect-video] bg-[#0a0a0c] overflow-hidden relative">
                  <div className="absolute inset-0 bg-linear-to-t from-[#111116] to-transparent z-10 opacity-90" />
                  <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors z-10 duration-500" />
                  <div className="w-full h-full bg-[linear-gradient(45deg,#0a0a0c_25%,#111116_25%,#111116_50%,#0a0a0c_50%,#0a0a0c_75%,#111116_75%,#111116_100%)] bg-size-[20px_20px] opacity-40 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                    <span className="text-white/20 font-black text-2xl tracking-[0.5em]">{proj.title.toUpperCase()}</span>
                  </div>
                  {/* Glowing edges inside the image wrapper */}
                  <div className="absolute bottom-0 left-10 w-32 h-1 bg-cyan-500/50 blur-md z-20" />
                </div>
                <div className="p-8 relative z-20 bg-[#111116]">
                  <div className="flex flex-wrap gap-2 mb-5">
                    {proj.tags.map((tag) => (
                      <span key={tag} className="text-xs font-mono px-2 py-1 bg-white/5 text-cyan-300 border border-cyan-500/20 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {proj.title}
                  </h4>
                  <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                    {proj.desc}
                  </p>
                  <div className="flex gap-4">
                    <a href="https://github.com" className="flex-1 py-3 bg-white/5 border border-white/10 rounded-lg font-medium text-white hover:bg-white/10 hover:border-cyan-500/30 transition-all text-center shadow-sm">
                      GitHub
                    </a>
                    <a href="#" className="flex-1 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg font-medium text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all text-center shadow-sm">
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="max-w-7xl mx-auto px-6 w-full pt-10">
          <div className="bg-[#111116] border border-white/10 rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-125 h-125 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-100 h-100 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="grid md:grid-cols-2 gap-16 relative z-10">
              <div>
                <div className="w-12 h-1 bg-linear-to-r from-purple-500 to-cyan-500 mb-8 rounded-full" />
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Let's build something meaningful.
                </h2>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                  Looking to architect a robust backend, build a fluid frontend, or design an entire scalable system? My terminal is ready for incoming connections.
                </p>
                
                <div className="space-y-6 text-slate-300 font-mono text-sm">
                  <a href="mailto:hello@ani.dev" className="flex items-center gap-4 hover:text-cyan-400 cursor-pointer transition-colors w-max group group-hover:scale-105">
                    <div className="w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center bg-[#1a1a24] group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">✉</div>
                    hello@ani.dev
                  </a>
                  <a href="https://github.com" className="flex items-center gap-4 hover:text-cyan-400 cursor-pointer transition-colors w-max group group-hover:scale-105">
                    <div className="w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center bg-[#1a1a24] group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">GH</div>
                    github.com/ani
                  </a>
                  <a href="https://linkedin.com" className="flex items-center gap-4 hover:text-cyan-400 cursor-pointer transition-colors w-max group group-hover:scale-105">
                    <div className="w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center bg-[#1a1a24] group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">IN</div>
                    linkedin.com/in/ani
                  </a>
                </div>
              </div>

              <div className="bg-[#0a0a0c]/80 p-8 rounded-2xl border border-white/5 backdrop-blur-xl shadow-[inset_0_1px_rgba(255,255,255,0.05)]">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wide">Interface / Name</label>
                    <input type="text" className="w-full bg-[#111116] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm" placeholder="Enter identity..." />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wide">Protocol / Email</label>
                    <input type="email" className="w-full bg-[#111116] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm" placeholder="user@domain.com..." />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wide">Payload / Message</label>
                    <textarea rows={4} className="w-full bg-[#111116] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none font-mono text-sm" placeholder="Incoming transmission..."></textarea>
                  </div>
                  <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2">
                    Transmit Data
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#0a0a0c] py-8 relative z-10 pt-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-black text-white glow-text opacity-90">ANI.DEV</div>
          <div className="text-sm font-mono text-slate-500 flex flex-wrap justify-center gap-6">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          <div className="text-xs text-slate-600 font-mono tracking-widest">
            © {new Date().getFullYear()} INITIALIZED.
          </div>
        </div>
      </footer>

      {/* Inline styles for custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        html { scroll-behavior: smooth; }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
        
        .glow-text {
          text-shadow: 0 0 15px rgba(34,211,238,0.4);
        }
        
        .pulse-anim {
          box-shadow: 0 0 10px rgba(34,211,238,0.8);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
      `}} />
    </div>
  );
}
