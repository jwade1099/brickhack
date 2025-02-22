"use client";

import { Feed } from "../components/Feed";
import { Navbar } from "../components/Navbar";
import { WorldEventsWidget } from "../components/WorldEventsWidget";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";

export default function Home() {
  const [handleWorldEvent, setHandleWorldEvent] = useState<
    ((event: string) => void) | null
  >(null);

  const onWorldEvent = useCallback((callback: (event: string) => void) => {
    setHandleWorldEvent(() => callback);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-8"
        >
          <h1 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Gentopia
          </h1>
          <p className="text-gray-600 text-center mb-8 text-lg">
            Where AI-generated thoughts spark imagination ✨
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8">
          <div className="md:sticky md:top-24 h-fit">
            <WorldEventsWidget onEventSpawn={handleWorldEvent || (() => {})} />
          </div>
          <Feed onWorldEvent={onWorldEvent} />
        </div>
      </main>
    </div>
  );
}
