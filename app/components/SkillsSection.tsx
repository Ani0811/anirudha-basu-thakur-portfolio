"use client";

import React from "react";

const milestones = [
  {
    year: "2022 - 2025",
    title: "Netaji Subhash Engineering College",
    desc: "CGPA: 7.86. Studied core engineering principles, full-stack web development, and software engineering.",
    icon: "🎓",
    color: "from-cyan-500 to-blue-500"
  },
  {
    year: "2020 - 2022",
    title: "Narayana Group of Schools",
    desc: "Percentage: 77.7%. Higher Secondary Education focusing on science and mathematics.",
    icon: "📚",
    color: "from-purple-500 to-pink-500"
  },
  {
    year: "2008 - 2019",
    title: "South Point High School",
    desc: "Percentage: 77.8%. Foundational logic, mathematics, and primary education.",
    icon: "🏫",
    color: "from-orange-500 to-red-500"
  }
];

const skillGroups = [
  { 
    category: "Languages",
    icon: "{ }",
    description: "Core Programming Languages",
    skills: [
      { name: "JavaScript", level: 95, icon: "⚡" },
      { name: "TypeScript", level: 90, icon: "📘" },
      { name: "Python", level: 90, icon: "🐍" },
      { name: "Java", level: 85, icon: "☕" },
      { name: "C#", level: 80, icon: "💠" }
    ]
  },
  { 
    category: "Frontend",
    icon: "💻",
    description: "User Interface Development",
    skills: [
      { name: "React.js", level: 95, icon: "⚛" },
      { name: "Next.js", level: 90, icon: "▲" },
      { name: "TailwindCSS", level: 92, icon: "◈" },
      { name: "HTML5", level: 98, icon: "🌐" },
      { name: "CSS3", level: 95, icon: "🎨" }
    ]
  },
  { 
    category: "Backend",
    icon: "⚙️",
    description: "Server-Side Development",
    skills: [
      { name: "Node.js", level: 90, icon: "🟢" },
      { name: "Express.js", level: 88, icon: "⚙" },
      { name: "Django", level: 82, icon: "🧩" },
      { name: "Flask", level: 78, icon: "🧪" },
      { name: "FastAPI", level: 75, icon: "🚀" }
    ]
  },
  { 
    category: "Databases",
    icon: "⬢",
    description: "Data Storage & Management",
    skills: [
      { name: "MongoDB", level: 90, icon: "🍃" },
      { name: "PostgreSQL", level: 85, icon: "🐘" },
      { name: "MySQL", level: 82, icon: "🛢" },
      { name: "Redis", level: 80, icon: "🔴" }
    ]
  },
  { 
    category: "Cloud & DevOps",
    icon: "☁",
    description: "Infrastructure & Deployment",
    skills: [
      { name: "Azure", level: 85, icon: "☁" },
      { name: "Firebase", level: 88, icon: "🔥" },
      { name: "Git/GitHub", level: 92, icon: "⑂" },
      { name: "Docker", level: 78, icon: "🐳" },
      { name: "CI/CD", level: 75, icon: "🔄" }
    ]
  },
  { 
    category: "Tools & APIs",
    icon: "⚡",
    description: "Integration & Architecture",
    skills: [
      { name: "REST APIs", level: 90, icon: "🔌" },
      { name: "GraphQL", level: 75, icon: "◉" },
      { name: "Authentication", level: 88, icon: "🔐" },
      { name: "Payment Integration", level: 85, icon: "💳" },
      { name: "WebSockets", level: 80, icon: "🔗" }
    ]
  },
];

const workflowSteps = [
  { 
    step: "01", 
    title: "Understand", 
    subtitle: "Listen First, Code Later",
    description: "Every great solution starts with truly understanding the problem. I dig into requirements, ask the uncomfortable questions, and map out the real user needs—not just what's written in the spec.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      </svg>
    )
  },
  { 
    step: "02", 
    title: "Architect", 
    subtitle: "Think in Systems",
    description: "Before writing a single line, I sketch the blueprint. Data flows, component structures, API contracts—getting the architecture right means less refactoring and more shipping.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" />
      </svg>
    )
  },
  { 
    step: "03", 
    title: "Build", 
    subtitle: "Code with Intent",
    description: "Clean, readable, and maintainable—that's the goal. I write code that future-me (or any teammate) will thank present-me for. Comments where needed, TypeScript where possible.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="12" y1="2" x2="12" y2="22" />
      </svg>
    )
  },
  { 
    step: "04", 
    title: "Test", 
    subtitle: "Break It Before Users Do",
    description: "If I didn't write a test for it, did it even work? I automate the boring stuff, edge-case the critical paths, and sleep better knowing my code won't blow up at 3 AM.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    )
  },
  { 
    step: "05", 
    title: "Ship", 
    subtitle: "Deploy with Confidence",
    description: "The finish line isn't just pushing to prod—it's monitoring, iterating, and continuously improving. CI/CD pipelines, feature flags, and zero-downtime deployments are the way.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22l-4-9-9-4 20-7z" />
      </svg>
    )
  },
];

const developerQuote = {
  text: "Software is like cathedrals. First, we build them, then we pray.",
  author: "The Cathedral and the Bazaar",
  role: "Developer Wisdom"
};

export default function SkillsSection() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [flippedCards, setFlippedCards] = React.useState<boolean[]>(new Array(milestones.length).fill(false));
  const sectionRef = React.useRef<HTMLElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Track which card is currently in view and calculate positions
  const [cardPositions, setCardPositions] = React.useState<number[]>([]);

  React.useEffect(() => {
    const updatePositions = () => {
      const positions = cardRefs.current.map(card => {
        if (card) {
          return card.offsetTop;
        }
        return 0;
      });
      setCardPositions(positions);
    };

    // Update positions after cards render
    const timer = setTimeout(updatePositions, 200);
    window.addEventListener('resize', updatePositions);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePositions);
    };
  }, [isVisible]);

  // Track which card is currently in view
  React.useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || cardRefs.current.length === 0) return;
      
      const scrollY = window.scrollY;
      const viewportCenter = scrollY + window.innerHeight / 2;

      // Find which card is closest to viewport center
      let closestIndex = 0;
      let minDistance = Infinity;

      cardRefs.current.forEach((card, index) => {
        if (card) {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = scrollY + cardRect.top + cardRect.height / 2;
          const distance = Math.abs(viewportCenter - cardCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener('scroll', handleScroll);
    // Small delay to ensure cards are rendered
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <>
      {/* LEARNING JOURNEY */}
      <section ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 w-full relative pt-12 sm:pt-20">
        <h3 className="text-sm sm:text-base font-mono text-cyan-400 mb-16 sm:mb-20 tracking-[0.2em] sm:tracking-[0.25em] text-center flex items-center justify-center gap-4 sm:gap-6 before:h-px before:w-12 sm:before:w-20 before:bg-linear-to-r before:from-transparent before:to-cyan-500/50 after:h-px after:w-12 sm:after:w-20 after:bg-linear-to-l after:from-transparent after:to-cyan-500/50">
          LEARNING JOURNEY
        </h3>
        <p className="max-w-2xl mx-auto -mt-12 sm:-mt-14 mb-12 sm:mb-16 text-center text-sm sm:text-base text-slate-400 leading-relaxed">
          A quick look at the academic milestones and experiences that shaped my mindset as a developer.
        </p>
        <div className="relative">
          {/* Animated vertical line - CENTERED ON DESKTOP, LEFT ON MOBILE */}
          <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-cyan-500/30 via-blue-500/20 to-transparent" />
            {/* Animated glow moving down */}
            <div 
              className="absolute w-0.5 h-32 bg-linear-to-b from-transparent via-cyan-400 to-transparent"
              style={{
                animation: 'moveDown 3s ease-in-out infinite',
              }}
            />
          </div>

          {/* Animated Developer Character - CENTERED ON LINE */}
          <div 
            className="absolute left-6 md:left-1/2 transition-all duration-700 ease-out z-20 pointer-events-none"
            style={{
              top: cardPositions[activeIndex] ? `${cardPositions[activeIndex] + 100}px` : '100px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="relative">
              {/* Character with running animation */}
              <div className="text-4xl sm:text-5xl animate-bounce" style={{ animationDuration: '1s' }}>
                👨‍💻
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 blur-2xl bg-cyan-400/60 rounded-full scale-150 -z-10" />
            </div>
          </div>

          {/* Cards Container - ALTERNATING LEFT/RIGHT */}
          <div className="space-y-20 sm:space-y-24">
            {milestones.map((milestone, i) => {
              const isLeft = i % 2 === 0;
              
              return (
                <div 
                  key={i} 
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className={`relative transition-all duration-700 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  } ${isLeft ? 'translate-x-0' : 'translate-x-0'}`}
                  style={{ 
                    transitionDelay: `${i * 200}ms`,
                  }}
                >
                  {/* Card positioned left or right of center */}
                  <div 
                    className={`w-[calc(100%-4rem)] ml-auto md:w-[45%] ${isLeft ? 'md:mr-auto md:ml-0' : 'md:ml-auto'}`}
                    onClick={() => toggleFlip(i)}
                  >
                    {/* 3D Flip Card Container */}
                    <div 
                      className="relative cursor-pointer group"
                      style={{
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s',
                        transform: flippedCards[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        minHeight: '240px',
                      }}
                    >
                      {/* Card Front */}
                      <div 
                        className={`group/card absolute inset-0 w-full overflow-hidden bg-linear-to-br from-[#111116]/80 to-[#1a1a24]/90 border rounded-2xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl transition-all duration-700 ${
                          activeIndex === i 
                            ? 'border-cyan-500/60 shadow-cyan-500/40 scale-105 ring-1 ring-cyan-400/30' 
                            : 'border-white/10 hover:border-cyan-500/50 hover:scale-105 hover:-translate-y-2 hover:shadow-cyan-500/20'
                        }`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(0deg)',
                        }}
                      >
                        {/* Animated gradient orbs */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-linear-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse group-hover/card:scale-150 transition-transform duration-700" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse group-hover/card:scale-150 transition-transform duration-700" style={{ animationDelay: '1s' }} />
                        
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000" />
                        </div>

                        {/* Floating particles */}
                        <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-40" />
                        <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute top-12 left-12 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '1s' }} />

                        <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-45 text-center">
                          {/* Icon with glow */}
                          <div className="text-4xl sm:text-5xl mb-3 group-hover/card:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                            {milestone.icon}
                          </div>
                          
                          <span className={`text-xs sm:text-sm font-mono mb-3 px-3 py-1 rounded-full border tracking-wider bg-linear-to-r ${milestone.color} bg-clip-text text-transparent font-bold border-cyan-500/30`}>
                            {milestone.year}
                          </span>
                          
                          <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-linear-to-r from-white via-cyan-100 to-white bg-clip-text group-hover/card:from-cyan-200 group-hover/card:via-white group-hover/card:to-cyan-200 transition-all duration-500 px-2">
                            {milestone.title}
                          </h4>
                          
                          <div className="flex items-center gap-2 text-xs text-cyan-400/60 font-mono group-hover/card:text-cyan-400 transition-colors">
                            <span>Click to reveal details</span>
                            <span className="group-hover/card:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                        
                        {/* Enhanced corner accents with animation */}
                        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-2xl transition-all duration-500 group-hover/card:border-cyan-400/60 group-hover/card:w-24 group-hover/card:h-24" />
                        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-500/30 rounded-br-2xl transition-all duration-500 group-hover/card:border-cyan-400/60 group-hover/card:w-24 group-hover/card:h-24" />
                      </div>

                      {/* Card Back */}
                      <div 
                        className={`group/back absolute inset-0 w-full overflow-hidden bg-linear-to-br from-cyan-950/60 via-blue-950/60 to-purple-950/60 border rounded-2xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl transition-all duration-700 ${
                          activeIndex === i 
                            ? 'border-cyan-400/80 shadow-cyan-500/40 ring-1 ring-cyan-400/40 hover:-translate-y-2' 
                            : 'border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-2 hover:shadow-cyan-400/30'
                        }`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        {/* Animated background gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
                        
                        {/* Sparkle effects */}
                        <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping opacity-60" />
                        <div className="absolute bottom-12 right-8 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.3s' }} />
                        <div className="absolute top-16 left-16 w-1 h-1 bg-purple-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.6s' }} />

                        <div className="relative z-10 flex flex-col justify-center h-full min-h-45">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{milestone.icon}</span>
                            <span className={`text-xs sm:text-sm font-mono tracking-wider bg-linear-to-r ${milestone.color} bg-clip-text text-transparent font-bold`}>
                              {milestone.year}
                            </span>
                          </div>
                          
                          <h4 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover/back:text-cyan-100 transition-colors">{milestone.title}</h4>
                          
                          <p className="text-base sm:text-lg text-slate-300 leading-relaxed group-hover/back:text-white transition-colors">{milestone.desc}</p>
                          
                          <div className="flex items-center gap-2 text-sm text-cyan-400/60 font-mono mt-4 group-hover/back:text-cyan-400 transition-colors">
                            <span className="group-hover/back:-translate-x-1 transition-transform">←</span>
                            <span>Click to flip back</span>
                          </div>
                        </div>
                        
                        {/* Enhanced grid pattern overlay */}
                        <div className="absolute inset-0 opacity-5 group-hover/back:opacity-10 transition-opacity" style={{
                          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
                          backgroundSize: '20px 20px'
                        }} />
                        
                        {/* Glowing border effect */}
                        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover/back:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>
                  </div>

                  {/* Connection line to center (Desktop) */}
                  <div className={`hidden md:block absolute top-24 ${isLeft ? 'right-0' : 'left-0'} w-8 sm:w-12 h-px bg-linear-to-${isLeft ? 'r' : 'l'} from-cyan-500/30 to-transparent`} 
                       style={{ top: '50%' }} />
                       
                  {/* Connection line (Mobile) */}
                  <div className="md:hidden absolute left-6 w-10 h-px bg-linear-to-r from-cyan-500/50 to-transparent"
                       style={{ top: '50%' }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section id="skills" className="max-w-6xl mx-auto px-4 sm:px-6 w-full pt-12 sm:pt-20">
        <h3 className="text-sm sm:text-base font-mono text-cyan-400 mb-16 sm:mb-20 tracking-[0.2em] sm:tracking-[0.25em] text-center flex items-center justify-center gap-4 sm:gap-6 before:h-px before:w-12 sm:before:w-20 before:bg-linear-to-r before:from-transparent before:to-cyan-500/50 after:h-px after:w-12 sm:after:w-20 after:bg-linear-to-l after:from-transparent after:to-cyan-500/50">
          TECH STACK
        </h3>
        <p className="max-w-3xl mx-auto -mt-12 sm:-mt-14 mb-12 sm:mb-16 text-center text-sm sm:text-base text-slate-400 leading-relaxed">
          A focused snapshot of the tools and technologies I use to build clean, scalable, and production-ready software.
        </p>
        
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 sm:gap-8">
          {skillGroups.map((group, i) => (
            <div
              key={i}
              className="group/skillcard relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 hover:border-cyan-500/50 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden"
              style={{
                animation: `fadeInUp 0.6s ease-out ${i * 0.15}s both`
              }}
            >
              {/* Glass card background effects */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl group-hover/skillcard:scale-110 transition-transform duration-700" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl group-hover/skillcard:scale-110 transition-transform duration-700" />
              
              {/* Floating particles */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400/60 rounded-full animate-ping" />
              <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />

              {/* Category heading */}
              <div className="relative z-10 mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-3xl text-cyan-400 font-mono bg-cyan-500/10 w-12 h-12 rounded-xl flex items-center justify-center border border-cyan-500/20 shadow-lg shadow-cyan-500/20">
                    {group.icon}
                  </div>
                  <div>
                    <h4 className="text-2xl sm:text-3xl font-bold text-white group-hover/skillcard:text-cyan-100 transition-colors">
                      {group.category}
                    </h4>
                    <p className="text-sm text-slate-400 font-medium">{group.description}</p>
                  </div>
                </div>
                <div className="w-full h-px bg-linear-to-r from-cyan-500/30 via-cyan-500/10 to-transparent" />
              </div>

              {/* Skills with progress bars */}
              <div className="relative z-10 space-y-6">
                {group.skills.map((skill, j) => (
                  <div 
                    key={j}
                    className="group/skill relative p-3 -mx-3 rounded-xl hover:bg-white/5 hover:border hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300"
                    style={{
                      animation: `slideInLeft 0.5s ease-out ${i * 0.15 + j * 0.1}s both`
                    }}
                  >
                    {/* Skill name and percentage */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-800/50 border border-slate-600/30 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-cyan-300 shadow-md">
                          {skill.icon}
                        </div>
                        <span className="text-lg sm:text-xl text-slate-200 font-semibold group-hover/skill:text-white transition-colors">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-base font-mono text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress bar container */}
                    <div className="relative h-3 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden border border-white/20 shadow-inner">
                      {/* Background glow */}
                      <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded-full" />
                      
                      {/* Animated progress bar */}
                      <div 
                        className="h-full bg-linear-to-r from-cyan-400 via-cyan-300 to-blue-400 rounded-full relative overflow-hidden shadow-lg"
                        style={{ 
                          width: '0%',
                          animation: `fillProgress 1.5s ease-out ${i * 0.15 + j * 0.1 + 0.5}s forwards`,
                          '--target-width': `${skill.level}%`
                        } as React.CSSProperties}
                      >
                        {/* Animated shine effect */}
                        <div 
                          className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12"
                          style={{
                            animation: `shine 2s ease-out ${i * 0.15 + j * 0.1 + 1}s infinite`
                          }}
                        />
                        
                        {/* Pulsing end dot */}
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
                      </div>

                      {/* Hover shimmer */}
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/skill:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Remove the individual style tag, we'll use CSS variables instead */}
                  </div>
                ))}
              </div>

              {/* Glass card border glow */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover/skillcard:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      {/* WORKING PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-12 sm:pt-20">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h3 className="text-sm sm:text-base font-mono text-cyan-400 mb-4 tracking-[0.2em] sm:tracking-[0.25em] flex items-center justify-center gap-4 sm:gap-6 before:h-px before:w-12 sm:before:w-20 before:bg-linear-to-r before:from-transparent before:to-cyan-500/50 after:h-px after:w-12 sm:after:w-20 after:bg-linear-to-l after:from-transparent after:to-cyan-500/50">
            HOW I WORK
          </h3>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            A glimpse into my development workflow — from napkin sketch to production deployment.
          </p>
        </div>

        {/* Glass Wheels with text below connecting line */}
        <div className="relative">
          
          {/* ========================================= */}
          {/* DESKTOP LAYOUT (Horizontal Flow)          */}
          {/* ========================================= */}
          <div className="hidden lg:block">
            {/* Wheels Row */}
            <div className="relative flex flex-row items-center justify-between px-4">
              {workflowSteps.map((process, i) => (
                <div 
                  key={i} 
                  className="group relative flex flex-col items-center"
                  style={{ animation: `wheelAppear 0.8s ease-out ${i * 0.15}s both` }}
                >
                  {/* Glass Wheel */}
                  <div className="relative">
                    {/* Outer glow ring - cyan themed */}
                    <div 
                      className="absolute -inset-3 rounded-full bg-linear-to-r from-cyan-500/20 via-cyan-400/30 to-blue-500/20 opacity-40 group-hover:opacity-70 blur-md transition-opacity duration-500"
                      style={{ animation: 'spinSlow 12s linear infinite' }}
                    />
                    
                    {/* Main glass wheel */}
                    <div className="relative w-32 h-32 rounded-full bg-slate-900/70 backdrop-blur-xl border-2 border-cyan-500/20 flex items-center justify-center overflow-hidden group-hover:border-cyan-400/40 group-hover:shadow-2xl group-hover:shadow-cyan-500/30 transition-all duration-500 group-hover:scale-110">
                      
                      {/* Inner dashed ring - cyan */}
                      <div 
                        className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors"
                        style={{ animation: 'spinReverse 8s linear infinite' }} 
                      />
                      
                      {/* Inner glass circle with number */}
                      <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-cyan-500/80 to-blue-600/80 p-0.5 group-hover:rotate-6 transition-transform duration-500 shadow-lg shadow-cyan-500/20">
                        <div className="w-full h-full rounded-full bg-slate-950/95 backdrop-blur flex items-center justify-center">
                          <span className="text-2xl font-bold font-mono text-cyan-300 group-hover:text-white transition-colors">
                            {process.step}
                          </span>
                        </div>
                      </div>

                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 rounded-full bg-linear-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Orbiting dot - cyan */}
                      <div 
                        className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"
                        style={{ 
                          animation: 'orbit 4s linear infinite',
                          animationDelay: `${i * 0.8}s`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Animated connecting line - below wheels */}
            <div className="relative h-4 mt-8 mx-12">
              <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-linear-to-r from-transparent via-cyan-500/20 to-transparent rounded-full" />
              <div 
                className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-linear-to-r from-cyan-500/0 via-cyan-400/60 to-cyan-500/0 rounded-full"
                style={{ animation: 'pulseFlow 2s ease-in-out infinite' }}
              />
              {/* Dot markers on line */}
              {workflowSteps.map((_, i) => (
                <div 
                  key={i}
                  className="absolute top-1/2 w-3 h-3 rounded-full bg-cyan-500/40 border border-cyan-400/60"
                  style={{ left: `${(i / (workflowSteps.length - 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                />
              ))}
            </div>

            {/* Text Row - below connecting line */}
            <div className="flex flex-row items-start justify-between gap-4 px-4 mt-10">
              {workflowSteps.map((process, i) => (
                <div 
                  key={i} 
                  className="flex-1 text-center max-w-50"
                  style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1 + 0.3}s both` }}
                >
                  <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {process.title}
                  </h4>
                  <p className="text-sm font-mono mb-3 text-cyan-400 bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text font-semibold">
                    {process.subtitle}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300 hover:text-slate-200 transition-colors">
                    {process.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================= */}
          {/* MOBILE LAYOUT (Vertical List)             */}
          {/* ========================================= */}
          <div className="flex flex-col gap-12 lg:hidden">
            {workflowSteps.map((process, i) => (
              <div 
                key={i} 
                className="group relative flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6"
                style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.15}s both` }}
              >
                {/* Connecting Line (Vertical) - only visible between items */}
                {i !== workflowSteps.length - 1 && (
                  <div className="absolute left-1/2 sm:left-14 top-32 sm:top-28 -bottom-12 w-px bg-linear-to-b from-cyan-500/40 to-transparent -translate-x-1/2 sm:translate-x-0 hidden sm:block" />
                )}

                {/* Glass Wheel */}
                <div className="relative shrink-0">
                  {/* Outer glow ring */}
                  <div 
                    className="absolute -inset-3 rounded-full bg-linear-to-r from-cyan-500/20 via-cyan-400/30 to-blue-500/20 opacity-40 group-hover:opacity-70 blur-md transition-opacity duration-500"
                    style={{ animation: 'spinSlow 12s linear infinite' }}
                  />
                  
                  {/* Main glass wheel */}
                  <div className="relative w-28 h-28 rounded-full bg-slate-900/70 backdrop-blur-xl border-2 border-cyan-500/20 flex items-center justify-center overflow-hidden group-hover:border-cyan-400/40 group-hover:shadow-2xl group-hover:shadow-cyan-500/30 transition-all duration-500 group-hover:scale-105">
                    {/* Inner dashed ring */}
                    <div 
                      className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors"
                      style={{ animation: 'spinReverse 8s linear infinite' }} 
                    />
                    
                    {/* Inner glass circle */}
                    <div className="relative w-16 h-16 rounded-full bg-linear-to-br from-cyan-500/80 to-blue-600/80 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:-rotate-6 transition-transform">
                      <div className="w-full h-full rounded-full bg-slate-950/95 backdrop-blur flex items-center justify-center">
                        <span className="text-xl font-bold font-mono text-cyan-300 group-hover:text-white transition-colors">
                          {process.step}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col sm:pt-4">
                  <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {process.title}
                  </h4>
                  <p className="text-sm font-mono mb-3 text-cyan-400 font-semibold">
                    {process.subtitle}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {process.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Quote Section */}
        <div className="mt-20 sm:mt-24 relative">
          <div className="max-w-4xl mx-auto relative">
            {/* Quote card - clean design */}
            <div className="relative bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 sm:p-12 overflow-hidden group hover:border-cyan-400/30 transition-all duration-500">
              
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-8 text-6xl text-cyan-400">"</div>
                <div className="absolute bottom-4 right-8 text-6xl text-cyan-400 rotate-180">"</div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Main quote */}
                <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-light text-white leading-relaxed mb-8 tracking-wide">
                  <span className="text-cyan-400">&ldquo;</span>
                  Software is like cathedrals. First, we build them, then we pray.
                  <span className="text-cyan-400">&rdquo;</span>
                </blockquote>

                {/* Attribution section */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent flex-1 max-w-20"></div>
                  <div className="text-center">
                    <p className="text-cyan-400 font-mono text-lg font-semibold">
                      The Cathedral and the Bazaar
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Classic Developer Wisdom
                    </p>
                  </div>
                  <div className="h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent flex-1 max-w-20"></div>
                </div>

                {/* Fun footer */}
                <div className="flex items-center justify-center gap-3 text-slate-400">
                  <span className="text-2xl">🏗️</span>
                  <span className="text-sm font-mono">// Every developer ever</span>
                  <span className="text-2xl">🙏</span>
                </div>
              </div>

              {/* Subtle corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-cyan-500/20 rounded-tl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-cyan-500/20 rounded-br-2xl"></div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes moveDown {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(400%);
            opacity: 0;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fillProgress {
          from {
            width: 0%;
          }
          to {
            width: var(--target-width);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(12deg);
          }
          100% {
            transform: translateX(200%) skewX(12deg);
          }
        }

        @keyframes wheelAppear {
          from {
            opacity: 0;
            transform: scale(0.5) rotate(-180deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(52px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(52px) rotate(-360deg);
          }
        }

        @keyframes pulseFlow {
          0%, 100% {
            opacity: 0.2;
            transform: scaleX(0.8);
          }
          50% {
            opacity: 0.6;
            transform: scaleX(1);
          }
        }
      `}</style>
    </>
  );
}
