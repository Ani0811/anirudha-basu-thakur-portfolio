"use client";

const contactLinks = [
  { icon: "✉", label: "anirudha.basuthakur@gmail.com", href: "mailto:anirudha.basuthakur@gmail.com" },
  { icon: "GH", label: "github.com/Ani0811", href: "https://github.com/Ani0811" },
  { icon: "IN", label: "linkedin.com/in/anirudha-basu-thakur-686aa8253", href: "https://linkedin.com/in/anirudha-basu-thakur-686aa8253" },
  { icon: "📞", label: "+91-9875417275", href: "tel:+919875417275" },
];

import React from "react";

export default function ContactSection() {
  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-8 sm:pt-10">
      <div className="bg-[#111116] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-16 relative overflow-hidden shadow-2xl">
        {/* Ambient blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-124 sm:h-124 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 sm:w-100 sm:h-100 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="grid md:grid-cols-2 gap-10 sm:gap-16 relative z-10">
          {/* Left – contact info */}
          <div>
            <div className="w-12 h-1 bg-linear-to-r from-purple-500 to-cyan-500 mb-8 rounded-full" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
              Let&apos;s build something meaningful.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mb-10 leading-relaxed">
              Looking to architect a robust backend, build a fluid frontend, or design an entire
              scalable system? My terminal is ready for incoming connections.
            </p>

            <div className="space-y-6 text-slate-300 font-mono text-sm">
              {contactLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-4 hover:text-cyan-400 cursor-pointer transition-colors w-full max-w-full break-all group"
                >
                  <div className="w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center bg-[#1a1a24] group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">
                    {icon}
                  </div>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Right – contact form */}
          <div className="bg-[#0a0a0c]/80 p-5 sm:p-8 rounded-2xl border border-white/5 backdrop-blur-xl shadow-[inset_0_1px_rgba(255,255,255,0.05)]">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wide">
                  Interface / Name
                </label>
                <input
                  type="text"
                  className="w-full bg-[#111116] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                  placeholder="Enter identity..."
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wide">
                  Protocol / Email
                </label>
                <input
                  type="email"
                  className="w-full bg-[#111116] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                  placeholder="user@domain.com..."
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wide">
                  Payload / Message
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-[#111116] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none font-mono text-sm"
                  placeholder="Incoming transmission..."
                />
              </div>
              <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2">
                Transmit Data
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
