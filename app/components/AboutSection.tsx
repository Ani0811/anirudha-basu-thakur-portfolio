"use client";

import React from "react";
import GithubStats from "./GithubStats";

const badges = [
  { label: "Full-Stack Development", icon: "⚡" },
  { label: "Backend Architecture", icon: "🔧" },
  { label: "UI/UX Design", icon: "🎨" },
  { label: "Payment Integration", icon: "💳" },
  { label: "Middleware Development", icon: "⚙️" },
  { label: "AI Development", icon: "🤖" },
];

export default function AboutSection() {
  const [isVisible, setIsVisible] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="max-w-7xl mx-auto px-4 sm:px-6 w-full fade-in-section relative overflow-hidden">
      {/* Floating gradient orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="grid md:grid-cols-2 gap-12 items-start relative z-10">
        {/* Left column – bio */}
        <div>
          <h2 className={`text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 animate-gradient bg-size-[200%_auto]">
              Building Scalable Solutions
            </span>
          </h2>
          
          <p className={`text-slate-300 text-lg mb-6 leading-relaxed transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            I'm a software engineer who loves the marriage of robust backend logic with smooth frontend experiences. My journey into development started with a fascination for building tools that actually help people, leading me to master the <strong className="text-white">MERN stack</strong> and <strong className="text-white">cloud solutions</strong>.
          </p>
          
          <p className={`text-slate-400 text-base mb-8 leading-relaxed transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            When I'm not architecting RESTful APIs or refining UI animations, I'm usually exploring new AI/ML applications or optimizing payment flows for better user conversion. I believe every line of code should contribute to a better user journey.
          </p>
          
          {/* Specializations */}
          <div className={`flex flex-wrap gap-3 mb-8 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {badges.map((badge, i) => (
              <div
                key={i}
                className="group px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-cyan-500/50 hover:scale-110 transition-all duration-300 cursor-default"
              >
                <span className="text-sm text-slate-300 flex items-center gap-2">
                  <span className="text-base group-hover:scale-125 transition-transform duration-300">{badge.icon}</span>
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <a 
              href="/docs/Anirudha_Basu_Thakur_Resume.pdf" 
              download="Anirudha_Basu_Thakur_Resume.pdf" 
              className="group px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-white font-semibold relative overflow-hidden hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Download Resume</span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a 
              href="https://github.com/Ani0811" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-cyan-500/50 transition-all text-white font-semibold hover:scale-105 active:scale-95"
            >
              View GitHub
            </a>
          </div>
        </div>

        {/* Right column – GitHub stats */}
        <div className={`transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <GithubStats username="Ani0811" />
        </div>
      </div>
    </section>
  );
}
