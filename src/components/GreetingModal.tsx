"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, X } from "lucide-react";

interface GreetingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function GreetingModal({ isOpen, onClose }: GreetingModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen !== undefined) {
      setVisible(isOpen);
      return;
    }

    // Auto open on first load of session
    const hasSeenGreeting = sessionStorage.getItem("hasSeenGreeting_v1");
    if (!hasSeenGreeting) {
      setVisible(true);
      sessionStorage.setItem("hasSeenGreeting_v1", "true");
    }
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-gradient-to-b from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 border-2 border-pink-300/50 dark:border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center"
        >
          {/* Background decor */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-300/30 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white glass hover:bg-black/5 transition-all"
          >
            <X size={18} />
          </button>

          {/* Header Icon */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-500/30 text-white"
          >
            <Heart size={32} fill="white" className="animate-pulse" />
          </motion.div>

          {/* Greeting Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-pink-500" /> Special Note for Thamizh <Sparkles size={14} className="text-pink-500" />
          </div>

          {/* Main Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-pink-100 mb-3 tracking-tight">
            Congratulations, Thamizh! 🌟
          </h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-purple-200 text-sm sm:text-base leading-relaxed mb-6">
            Congratulations for all your excellent work and dedication on these times! You are making such wonderful progress every single day. Keep shining bright! ✨
          </p>

          {/* Love Message Box */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 p-0.5 rounded-2xl shadow-lg shadow-pink-500/20 mb-6"
          >
            <div className="bg-white dark:bg-gray-900/90 rounded-[14px] p-4 text-center">
              <p className="text-xs uppercase font-bold tracking-widest text-pink-500 mb-1">
                With all my love 💖
              </p>
              <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-300">
                {"{ Boopathi love <3 }"}
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <button
            onClick={handleClose}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base shadow-lg shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Thank You! Let's Achieve More! 🚀
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
