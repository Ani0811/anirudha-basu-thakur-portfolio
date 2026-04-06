"use client";

import React from "react";
import Navbar from "../components/Navbar";
import RoastMyCode from "../components/RoastMyCode";
import Footer from "../components/Footer";

export default function RoastPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 font-sans">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <Navbar
        scrollY={0}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="relative z-10 pt-24 pb-32">
        <RoastMyCode />
      </main>

      <Footer />
    </div>
  );
}
