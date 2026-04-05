"use client";

import React from "react";

const milestones = [
  {
    year: "Present",
    title: "Master of Computer Applications",
    desc: "Focusing on advanced system architecture, cloud computing, and full-stack engineering.",
  },
  {
    year: "2022 - 2025",
    title: "Bachelor of Computer Applications",
    desc: "Core programming, database management, web technologies, and software development lifecycle.",
  },
  {
    year: "2020 - 2022",
    title: "Higher Secondary Education",
    desc: "Computer Science major. Built foundational logic, algorithms, and mathematics.",
  },
  {
    year: "2020",
    title: "Secondary Education",
    desc: "Introduction to programming principles and analytical problem-solving.",
  },
];

const skillGroups = [
  { category: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"] },
  { category: "Backend", skills: ["Node.js", "Express", "REST APIs", "GraphQL", "Socket.IO"] },
  { category: "Database", skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Supabase"] },
  { category: "Tools", skills: ["Git", "GitHub", "Postman", "VS Code", "Figma"] },
  { category: "DevOps", skills: ["Docker", "AWS", "Vercel", "Linux", "CI/CD"] },
  { category: "Core", skills: ["Data Structures", "Algorithms", "System Design", "Agile", "OOP"] },
];

const workflowSteps = [
  { step: "01", title: "Research" },
  { step: "02", title: "Design" },
  { step: "03", title: "Build" },
  { step: "04", title: "Test" },
  { step: "05", title: "Deploy" },
];

export default function SkillsSection() {
  return (
    <>
      {/* LEARNING JOURNEY */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full relative pt-12 sm:pt-20">
        <h3 className="text-xs sm:text-sm font-mono text-cyan-400 mb-12 sm:mb-16 tracking-[0.16em] sm:tracking-[0.2em] text-center flex items-center justify-center gap-3 sm:gap-4 before:h-1px before:w-8 sm:before:w-16 before:bg-cyan-500/30 after:h-1px after:w-8 sm:after:w-16 after:bg-cyan-500/30">
          LEARNING JOURNEY
        </h3>
        <div className="relative border-l border-cyan-500/20 pl-5 sm:pl-8 space-y-8 sm:space-y-12 before:absolute before:inset-y-0 before:-left-px before:w-0.5 before:bg-linear-to-b before:from-cyan-500/80 before:via-blue-500/50 before:to-transparent">
          {milestones.map((milestone, i) => (
            <div key={i} className="relative group">
              <div className="absolute w-3 h-3 rounded-full bg-cyan-400 left-[-1.6rem] sm:left-[-2.3rem] top-1.5 group-hover:scale-[1.7] group-hover:shadow-[0_0_15px_#06b6d4] group-hover:bg-white transition-all duration-300" />
              <div className="bg-[#111116] border border-white/5 p-5 sm:p-6 rounded-xl backdrop-blur-md hover:bg-[#15151c] hover:border-cyan-500/30 transition-all shadow-lg">
                <span className="text-xs font-mono text-cyan-400 mb-2 block tracking-wider">
                  {milestone.year}
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">{milestone.title}</h4>
                <p className="text-sm sm:text-base text-slate-400">{milestone.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TECHNICAL ARSENAL */}
      <section id="skills" className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-12 sm:pt-20">
        <h3 className="text-xs sm:text-sm font-mono text-cyan-400 mb-12 sm:mb-16 tracking-[0.16em] sm:tracking-[0.2em] text-center flex items-center justify-center gap-3 sm:gap-4 before:h-1px before:w-8 sm:before:w-16 before:bg-cyan-500/30 after:h-1px after:w-8 sm:after:w-16 after:bg-cyan-500/30">
          TECHNICAL ARSENAL
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group, i) => (
            <div
              key={i}
              className="bg-[#111116] border border-white/5 rounded-xl p-6 sm:p-8 hover:border-cyan-500/30 transition-all group shadow-xl"
            >
              <h4 className="text-white font-bold text-lg sm:text-xl mb-6 flex items-center gap-3">
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

      {/* WORKING PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-12 sm:pt-20">
        <h3 className="text-xs sm:text-sm font-mono text-cyan-400 mb-12 sm:mb-16 tracking-[0.16em] sm:tracking-[0.2em] text-center flex items-center justify-center gap-3 sm:gap-4 before:h-1px before:w-8 sm:before:w-16 before:bg-cyan-500/30 after:h-px after:w-8 sm:after:w-16 after:bg-cyan-500/30">
          WORKING PROCESS
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent -z-10" />
          {workflowSteps.map((process, i) => (
            <div key={i} className="flex flex-col items-center group cursor-default w-full md:w-auto">
              <div className="w-16 h-16 rounded-full bg-[#111116] border border-white/10 flex items-center justify-center font-mono text-xl text-slate-500 group-hover:border-cyan-400 group-hover:text-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover:-translate-y-2 transition-all duration-300 bg-linear-to-b from-white/5 to-transparent z-10 mb-4 shadow-lg">
                {process.step}
              </div>
              <div className="font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                {process.title}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
