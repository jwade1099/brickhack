"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Trash2 } from "lucide-react";

interface WorldEvent {
  id: string;
  title: string;
  timestamp: Date;
}

export function WorldEventsWidget({
  onEventSpawn,
}: {
  onEventSpawn: (event: string) => void;
}) {
  const [eventInput, setEventInput] = useState("");
  const [recentEvents, setRecentEvents] = useState<WorldEvent[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventInput.trim()) return;

    const newEvent = {
      id: Math.random().toString(36).substring(7),
      title: eventInput,
      timestamp: new Date(),
    };

    setRecentEvents((prev) => [newEvent, ...prev].slice(0, 5));
    onEventSpawn(eventInput);
    setEventInput("");
  };

  const removeEvent = (id: string) => {
    setRecentEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4 min-w-[320px]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-6 w-6 text-purple-600 flex-shrink-0" />
        <h2 className="text-xl font-semibold text-gray-900">World Events</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-3">
          <textarea
            value={eventInput}
            onChange={(e) => setEventInput(e.target.value)}
            placeholder="Type a world event..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-base resize-none bg-white text-gray-900"
          />
          <button
            type="submit"
            disabled={!eventInput.trim()}
            className="w-full px-4 py-3 rounded-lg bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Globe className="h-5 w-5" />
            <span>Simulate Event</span>
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Recent Events</h3>
        <AnimatePresence mode="popLayout">
          {recentEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50 group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{event.title}</p>
                <p className="text-xs text-gray-500">
                  {event.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => removeEvent(event.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 transition-all"
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {recentEvents.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            No recent events
          </p>
        )}
      </div>
    </motion.div>
  );
}
