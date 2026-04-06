"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs mb-6" style={{ color: "#000000" }}>
              <span className="w-2 h-2 rounded-full gradient-bg" />
              Scale your video ad creative 100x
            </div>

            <h1 className="text-3xl sm:text-4xl text-black md:text-6xl lg:text-7xl font-bold tracking-tight" style={{ color: "#000000" }}>
              Create{" "}
              <span className="gradient-text">120+ Video Ads</span>
              <span style={{ color: "#000000" }}>{" "}in Minutes</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "#000000" }}>
              Combine your videos with hooks, CTAs, and subtitle styles.
              Adstacker generates every possible combination automatically.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-10">
              <Button render={<Link href="/signup" />} size="lg" className="gradient-bg border-0 hover:opacity-90 gap-2 h-12 px-8 w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button render={<Link href="#how-it-works" />} variant="outline" size="lg" className="bg-white border-gray-300 hover:bg-gray-50 gap-2 h-12 px-8 w-full sm:w-auto" style={{ color: "#000000" }}>
                <Play className="h-4 w-4" style={{ color: "#000000" }} />
                See How It Works
              </Button>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 sm:mt-16 glass-card p-2 sm:p-3 glow-purple"
          >
            <div className="aspect-video bg-gradient-to-br from-[#141832] to-[#0F1221] rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-4 grid-rows-3 gap-1.5 sm:gap-2 p-3 sm:p-6 opacity-60">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-gradient-to-br from-brand-purple/10 to-brand-blue/5 flex items-center justify-center"
                  >
                    <Play className="h-4 w-4 text-white/20" />
                  </div>
                ))}
              </div>
              <div className="relative z-10 text-center">
                <p className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text">120+</p>
                <p className="text-sm mt-1" style={{ color: "#ffffff" }}>Video Variations Generated</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
