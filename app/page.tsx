"use client";

import { useEffect, useMemo, useState } from "react";

const bootMessages = [
  "Initializing developer workspace...",
  "Loading modules...",
  "Connecting services...",
  "Compiling components...",
  "System ready.",
];

const skills = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
  Backend: ["Node.js", "Express", "REST APIs", "GraphQL", "Socket.IO"],
  Databases: ["MongoDB", "PostgreSQL", "Redis", "Prisma", "Firebase"],
  Tools: ["Git", "GitHub", "Postman", "VS Code", "Figma"],
  DevOps: ["Docker", "Vercel", "CI/CD", "Nginx", "Linux"],
};

const projects = [
  {
    title: "PulseBoard",
    description:
      "Real-time analytics dashboard for multi-service monitoring with stream-based alerts.",
    tags: ["Next.js", "Node", "WebSockets"],
  },
  {
    title: "CodeFoundry",
    description:
      "Developer collaboration suite featuring live coding rooms and distributed task boards.",
    tags: ["React", "MongoDB", "Express"],
  },
  {
    title: "NeonStack CMS",
    description:
      "Headless content infrastructure for product teams shipping fast, localized experiences.",
    tags: ["TypeScript", "PostgreSQL", "Docker"],
  },
];

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="icon-shell">{children}</span>;
}

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const bootInterval = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 2, 100);
        if (next >= 100) {
          window.clearInterval(bootInterval);
          window.setTimeout(() => setLoading(false), 450);
        }
        return next;
      });
    }, 70);

    return () => window.clearInterval(bootInterval);
  }, []);

  useEffect(() => {
    const visibleMessages = Math.max(1, Math.ceil((progress / 100) * bootMessages.length));
    setMessageIndex(visibleMessages);
  }, [progress]);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY || 0);
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88) {
          el.classList.add("revealed");
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroFx = useMemo(() => {
    const range = Math.min(scrollY / 600, 1);
    return {
      blur: range * 5,
      darken: 0.25 + range * 0.45,
      copyOpacity: Math.max(0, 1 - range * 1.3),
      systemTextOpacity: Math.min(1, Math.max(0, (scrollY - 120) / 300)),
    };
  }, [scrollY]);

  const navIsSolid = scrollY > 30;

  return (
    <>
      <div className={`boot-loader ${loading ? "active" : "hidden"}`}>
        <div className="boot-grid" />
        <div className="boot-content glass-panel">
          <p className="boot-brand">ANI.DEV</p>
          <div className="boot-log">
            {bootMessages.slice(0, messageIndex).map((msg) => (
              <p key={msg}>{msg}</p>
            ))}
          </div>
          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="command-center-bg" />

      <nav className={`top-nav ${navIsSolid ? "solid" : ""}`}>
        <p className="brand">ANI.DEV</p>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="social-icons">
          <a href="https://github.com" aria-label="GitHub">
            <Icon>GH</Icon>
          </a>
          <a href="https://linkedin.com" aria-label="LinkedIn">
            <Icon>IN</Icon>
          </a>
          <a href="mailto:ani@example.com" aria-label="Email">
            <Icon>@</Icon>
          </a>
        </div>
      </nav>

      <main>
        <section id="home" className="hero">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            style={{ filter: `blur(${heroFx.blur}px)` }}
          >
            <source src="/videos/developer-cinematic.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" style={{ opacity: heroFx.darken }} />

          <div className="hero-content" style={{ opacity: heroFx.copyOpacity }}>
            <p className="headline">Ani</p>
            <h1>Full Stack Developer</h1>
            <p>Building modern web applications and developer systems.</p>
            <div className="hero-actions">
              <a href="#projects" className="btn-primary">
                View Projects
              </a>
              <a href="#contact" className="btn-ghost">
                Contact
              </a>
            </div>
          </div>

          <p className="scroll-message" style={{ opacity: heroFx.systemTextOpacity }}>
            Designing modern web systems.
          </p>
        </section>

        <section id="about" className="section about reveal">
          <div>
            <p className="section-kicker">About</p>
            <h2>Developer focused on building modern scalable web experiences.</h2>
            <p>
              I design and engineer production-grade digital systems where performance,
              maintainability, and user experience work together. Every feature ships with
              intent, observability, and room to evolve.
            </p>
            <div className="row-actions">
              <a className="btn-primary" href="#">
                Download Resume
              </a>
              <a className="btn-ghost" href="https://github.com">
                View GitHub
              </a>
            </div>
          </div>
          <div className="stats-grid">
            <article className="glass-panel stat-card">
              <p>38+</p>
              <span>Projects built</span>
            </article>
            <article className="glass-panel stat-card">
              <p>24+</p>
              <span>Technologies used</span>
            </article>
            <article className="glass-panel stat-card">
              <p>4+</p>
              <span>Experience years</span>
            </article>
          </div>
        </section>

        <section className="section reveal" id="journey">
          <p className="section-kicker">Learning Journey</p>
          <h2>System Log Timeline</h2>
          <div className="timeline">
            {[
              "Master of Computer Applications",
              "Bachelor of Computer Applications",
              "Higher Secondary Education",
              "Secondary Education",
            ].map((item) => (
              <article className="glass-panel timeline-card" key={item}>
                <span className="pulse-dot" />
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section reveal">
          <p className="section-kicker">Technical Arsenal</p>
          <h2>Tech Stack</h2>
          <div className="skills-grid">
            {Object.entries(skills).map(([category, values]) => (
              <article className="glass-panel skill-card" key={category}>
                <h3>{category}</h3>
                <ul>
                  {values.map((skill) => (
                    <li key={skill}>
                      <span>{skill}</span>
                      <i />
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section reveal">
          <p className="section-kicker">Workflow</p>
          <h2>System Pipeline</h2>
          <div className="workflow">
            {["Research", "Design", "Develop", "Test", "Deploy"].map((step) => (
              <div className="workflow-step" key={step}>
                <span>{step.slice(0, 1)}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="section reveal">
          <p className="section-kicker">Selected Work</p>
          <h2>Project Showcase</h2>
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card glass-panel" key={project.title}>
                <div className="project-shot">Project Screenshot</div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="row-actions">
                  <a className="btn-primary" href="https://github.com">
                    GitHub
                  </a>
                  <a className="btn-ghost" href="#">
                    Live Demo
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact reveal">
          <div>
            <p className="section-kicker">Contact</p>
            <h2>Let&apos;s build something meaningful.</h2>
            <p>
              Open to collaborations, product builds, and systems-focused engineering
              projects. If you have a vision, let&apos;s architect and ship it.
            </p>
            <div className="contact-links">
              <a href="https://github.com">GitHub</a>
              <a href="https://linkedin.com">LinkedIn</a>
              <a href="mailto:ani@example.com">Email</a>
            </div>
          </div>
          <form className="glass-panel contact-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" placeholder="Your name" />
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" />
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} placeholder="Tell me about your project" />
            <button type="submit" className="btn-primary">
              Send message
            </button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <p>ANI.DEV</p>
        <div>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
        <div>
          <a href="https://github.com">GitHub</a>
          <a href="https://linkedin.com">LinkedIn</a>
          <a href="mailto:ani@example.com">Email</a>
        </div>
      </footer>
    </>
  );
}
