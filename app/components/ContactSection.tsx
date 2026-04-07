"use client";

import React, { useState, useEffect, useRef } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const contactLinks = [
  { 
    icon: "mail", 
    label: "anirudha.basuthakur@gmail.com", 
    href: "mailto:anirudha.basuthakur@gmail.com", 
    type: "email",
    command: "mail --to anirudha.basuthakur@gmail.com"
  },
  { 
    icon: "github", 
    label: "github.com/Ani0811", 
    href: "https://github.com/Ani0811", 
    type: "github",
    command: "open https://github.com/Ani0811"
  },
  { 
    icon: "linkedin", 
    label: "linkedin.com/in/anirudha-basu-thakur-686aa8253", 
    href: "https://linkedin.com/in/anirudha-basu-thakur-686aa8253", 
    type: "linkedin",
    command: "open https://linkedin.com/in/anirudha-basu-thakur-686aa8253"
  },
  { 
    icon: "phone", 
    label: "+91-9875417275", 
    href: "tel:+919875417275", 
    type: "phone",
    command: "call +91-9875417275"
  },
];

const icons = {
  mail: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  phone: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
};

interface ContactSectionProps {
  terminalMode: boolean;
  setTerminalMode: (mode: boolean) => void;
}

export default function ContactSection({ terminalMode, setTerminalMode }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Welcome to Anirudha's Terminal v1.0.0",
    "Type 'help' for available commands",
    "",
  ]);
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({ name: "", email: "", message: "" });
        setSubmitStatus({ type: 'success', message: "Thanks! Your message has been sent successfully." });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || "Failed to send message. Please try again." });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: "Error connecting to server. Please try again later." });
    } finally {
      setIsSubmitting(false);
      // Auto dismiss success/error message after 5 seconds if you'd like
      setTimeout(() => setSubmitStatus({ type: null, message: '' }), 3000);
    }
  };

  const handleTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    
    let response: string | string[] = "";
    if (cmd === "help") {
      response = [
        "════════════════════════════════════════════",
        "  AVAILABLE COMMANDS",
        "════════════════════════════════════════════",
        "",
        "  mail       Open email client",
        "  github     Visit GitHub profile",
        "  linkedin   Visit LinkedIn profile",
        "  call       Initiate phone call",
        "  links      Show all contact information",
        "  clear      Clear terminal screen",
        "  exit       Exit terminal mode",
        "",
        "════════════════════════════════════════════",
      ];
    } else if (cmd === "mail") {
      window.open("mailto:anirudha.basuthakur@gmail.com");
      response = "✓ Opening mail client...";
    } else if (cmd === "github") {
      window.open("https://github.com/Ani0811", "_blank");
      response = "✓ Navigating to GitHub...";
    } else if (cmd === "linkedin") {
      window.open("https://linkedin.com/in/anirudha-basu-thakur-686aa8253", "_blank");
      response = "✓ Navigating to LinkedIn...";
    } else if (cmd === "call") {
      window.open("tel:+919875417275");
      response = "✓ Initiating call to +91-9875417275...";
    } else if (cmd === "links") {
      response = [
        "════════════════════════════════════════════",
        "  CONTACT INFORMATION",
        "════════════════════════════════════════════",
        "",
        "  ✉  Email:    anirudha.basuthakur@gmail.com",
        "  🔗 GitHub:   github.com/Ani0811",
        "  💼 LinkedIn: linkedin.com/in/anirudha-basu-thakur-686aa8253",
        "  📞 Phone:    +91-9875417275",
        "",
        "════════════════════════════════════════════",
      ];
    } else if (cmd === "clear") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    } else if (cmd === "exit") {
      setTerminalMode(false);
      response = "✓ Exiting terminal mode...";
    } else if (cmd === "") {
      setTerminalInput("");
      return;
    } else {
      response = `✗ Command not found: '${cmd}'. Type 'help' for available commands.`;
    }
    
    const newHistory = [...terminalHistory, `$ ${terminalInput}`];
    if (Array.isArray(response)) {
      newHistory.push(...response, "");
    } else {
      newHistory.push(response, "");
    }
    
    setTerminalHistory(newHistory);
    setTerminalInput("");
  };

  return (
    <section id="contact" ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-8 sm:pt-10">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 via-purple-500/5 to-blue-500/5 blur-3xl animate-pulse" />
        
        <div className="bg-linear-to-br from-[#0f1420]/90 to-[#0a0c14]/90 border border-cyan-500/20 rounded-3xl p-6 sm:p-10 md:p-16 relative backdrop-blur-xl shadow-[0_0_80px_rgba(34,211,238,0.15)]">
          <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-cyan-500/40 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-cyan-500/40 rounded-br-3xl" />
          
          <div className="absolute top-10 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
          <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.8)]" style={{ animationDelay: '1s' }} />

          <div className="grid md:grid-cols-2 gap-10 sm:gap-16 relative z-10">
            {/* Left – contact info or terminal */}
            <div className="space-y-8">
              {!terminalMode ? (
                <>
                  <div className="flex flex-col items-start gap-4">
                    <div className="inline-flex flex-col">
                      <h3 className={`text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase transition-all ${isVisible ? 'animate-h-reveal' : 'opacity-0'}`}>GET IN TOUCH</h3>
                      <div className={`h-px w-full mt-2 bg-linear-to-r from-transparent via-cyan-500 to-transparent transition-all duration-1000 ${isVisible ? 'animate-u-grow' : 'scale-x-0 opacity-0'}`} />
                    </div>
                    <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      Let's Build Something
                      <span className="block text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400 animate-gradient bg-size-[200%_auto]">
                        Extraordinary
                      </span>
                    </h2>
                    <p className={`text-slate-400 text-base sm:text-lg leading-relaxed transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      Ready to architect robust backends, craft fluid frontends, or design scalable systems?{' '}
                      <button
                        onClick={() => setTerminalMode(true)}
                        className="text-cyan-400 font-mono hover:text-cyan-300 hover:underline underline-offset-4 transition-all cursor-pointer"
                      >
                        Terminal online.
                      </button>
                    </p>
                  </div>

                  <div className="space-y-4">
                    {contactLinks.map(({ icon, label, href, type }, index) => (
                      <a
                        key={label}
                        href={href}
                        target={type !== 'email' && type !== 'phone' ? '_blank' : undefined}
                        rel={type !== 'email' && type !== 'phone' ? 'noopener noreferrer' : undefined}
                        className="group flex items-center gap-4 p-4 rounded-xl bg-white/2 border border-white/5 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-300 hover:translate-x-2"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-cyan-500/30 flex items-center justify-center bg-linear-to-br from-cyan-500/10 to-purple-500/10 group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all duration-300 text-cyan-400 shrink-0">
                          {icons[icon as keyof typeof icons]}
                        </div>
                        <span className="text-slate-300 group-hover:text-cyan-300 font-mono text-xs sm:text-sm transition-colors break-all">
                          {label}
                        </span>
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                /* Terminal Mode */
                <div className="h-full min-h-125 bg-black/90 rounded-xl border border-cyan-500/30 p-4 font-mono text-sm overflow-hidden flex flex-col shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyan-500/20">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-cyan-400 text-xs font-bold bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">ANIRUDHA BASU THAKUR ~</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto overflow-x-hidden mb-4 space-y-1 scrollbar-hide">
                    {terminalHistory.map((line, i) => (
                      <div key={i} className={line.startsWith('$') ? 'text-cyan-400 whitespace-pre-wrap wrap-break-word' : 'text-slate-300 whitespace-pre-wrap wrap-break-word'}>
                        {line}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleTerminalCommand} className="flex items-center gap-2">
                    <span className="text-cyan-400">$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-white caret-cyan-400"
                      placeholder="Type a command..."
                      autoFocus
                    />
                  </form>
                </div>
              )}
            </div>

            {/* Right – contact form */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 to-purple-500/10 blur-2xl rounded-2xl" />
              <div className="relative bg-[#0a0a0c]/80 p-6 sm:p-8 rounded-2xl border border-cyan-500/20 backdrop-blur-xl shadow-[inset_0_1px_rgba(255,255,255,0.05)]">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-cyan-400/80 uppercase tracking-wider">
                      &gt; Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-[#0f1420] border border-cyan-500/20 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all font-mono text-sm"
                      placeholder="Enter your name..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-cyan-400/80 uppercase tracking-wider">
                      &gt; Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-[#0f1420] border border-cyan-500/20 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all font-mono text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-cyan-400/80 uppercase tracking-wider">
                      &gt; Message
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full bg-[#0f1420] border border-cyan-500/20 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all resize-none font-mono text-sm"
                      placeholder="What's on your mind..."
                    />
                  </div>
                  
                  {submitStatus.type && (
                    <div 
                      className={`text-sm font-mono p-3 rounded-lg border ${
                        submitStatus.type === 'success' 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {submitStatus.type === 'success' ? '✓ ' : '✗ '}{submitStatus.message}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full py-4 bg-linear-to-r from-cyan-500 to-purple-500 text-black font-bold rounded-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 bg-linear-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
