"use client";

import React, { useState, useEffect, useRef } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

export default function RateMyPortfolioSection() {
  const [formData, setFormData] = useState<{ name: string; email: string; rating: number; feedback: string }>({ name: "", email: "", rating: 0, feedback: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      const response = await fetch('/api/rate-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({ name: "", email: "", rating: 0, feedback: "" });
        setSubmitStatus({ type: 'success', message: "Thank you for your feedback! Your rating has been submitted." });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || "Failed to submit rating. Please try again." });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: "Error connecting to server. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <section id="rate-portfolio" ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-8 sm:pt-10 pb-16">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 via-purple-500/5 to-blue-500/5 blur-3xl animate-pulse" />
        
        <div className="bg-linear-to-br from-[#0f1420]/90 to-[#0a0c14]/90 border border-cyan-500/20 rounded-3xl p-6 sm:p-10 md:p-16 relative backdrop-blur-xl shadow-[0_0_80px_rgba(34,211,238,0.15)] max-w-3xl mx-auto">
          <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-cyan-500/40 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-cyan-500/40 rounded-br-3xl" />
          
          <div className="absolute top-10 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
          <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.8)]" style={{ animationDelay: '1s' }} />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex flex-col items-center mb-4">
                <h3 className={`text-xs sm:text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase font-semibold transition-all ${isVisible ? 'animate-h-reveal' : 'opacity-0'}`}>
                  FEEDBACK
                </h3>
                <div className={`h-px w-32 mt-3 bg-linear-to-r from-transparent via-cyan-500 to-transparent transition-all duration-1000 ${isVisible ? 'animate-u-grow' : 'scale-x-0 opacity-0'}`} />
              </div>
              <h2 className={`text-4xl sm:text-5xl font-black text-white leading-tight mb-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Rate My Portfolio
              </h2>
              <p className={`text-slate-400 text-base sm:text-lg leading-relaxed transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Your feedback helps me improve. Let me know what you think!
              </p>
            </div>

            {/* Form Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 to-purple-500/10 blur-2xl rounded-2xl" />
              <div className="relative bg-[#0a0a0c]/80 p-6 sm:p-8 rounded-2xl border border-cyan-500/20 backdrop-blur-xl shadow-[inset_0_1px_rgba(255,255,255,0.05)]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-xs font-mono text-cyan-400/80 uppercase tracking-wider">
                        &gt; Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#0f1420] border border-cyan-500/20 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all font-mono text-sm"
                        placeholder="John Doe"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-xs font-mono text-cyan-400/80 uppercase tracking-wider">
                        &gt; Your Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#0f1420] border border-cyan-500/20 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all font-mono text-sm"
                        placeholder="john@example.com"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-cyan-400/80 uppercase tracking-wider">
                      &gt; Overall Rating *
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-2">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = star <= (hoveredStar ?? formData.rating);
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingClick(star)}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(null)}
                              disabled={isSubmitting}
                              className="transition-all duration-200 hover:scale-110 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] rounded-full disabled:opacity-50"
                            >
                              <svg
                                className={`w-12 h-12 sm:w-10 sm:h-10 ${
                                  isFilled
                                    ? 'fill-cyan-400 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                                    : 'fill-none text-slate-600 border-cyan-500/30'
                                } transition-all duration-200`}
                                stroke="currentColor"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                              >
                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                              </svg>
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-sm font-mono text-cyan-400 h-6 flex items-center">
                        {formData.rating > 0 || hoveredStar !== null
                          ? ratingLabels[(hoveredStar ?? formData.rating) - 1]
                          : "Select a rating"}
                      </span>
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div className="space-y-2">
                    <label htmlFor="feedback" className="block text-xs font-mono text-cyan-400/80 uppercase tracking-wider">
                      &gt; Your Feedback (Optional)
                    </label>
                    <textarea
                      id="feedback"
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-[#0f1420] border border-cyan-500/20 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all resize-none font-mono text-sm"
                      placeholder="Share your thoughts about the design, content, or user experience..."
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || formData.rating === 0}
                    className="group w-full py-4 bg-linear-to-r from-cyan-500 to-purple-500 text-black font-bold rounded-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 bg-linear-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Rating
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </>
                      )}
                    </span>
                  </button>

                  {/* Status Messages */}
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
