"use client";
import { motion } from "framer-motion";

const STARS = [
  { top: "12%", left: "15%", size: "text-xs", delay: 0 },
  { top: "25%", left: "80%", size: "text-sm", delay: 0.8 },
  { top: "40%", left: "10%", size: "text-xs", delay: 1.5 },
  { top: "18%", left: "45%", size: "text-base", delay: 0.4 },
  { top: "65%", left: "88%", size: "text-xs", delay: 2.1 },
  { top: "75%", left: "20%", size: "text-sm", delay: 1.2 },
  { top: "50%", left: "70%", size: "text-xs", delay: 0.3 },
  { top: "85%", left: "60%", size: "text-base", delay: 1.8 },
  { top: "8%", left: "90%", size: "text-xs", delay: 2.5 },
  { top: "32%", left: "30%", size: "text-sm", delay: 0.9 },
];

export default function TwinklingStars() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {STARS.map((star, i) => (
        <motion.div
          key={i}
          className={`absolute ${star.size} text-amber-200/60 select-none`}
          style={{ top: star.top, left: star.left }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Subtle glowing moon icon accent */}
      <motion.div
        className="absolute top-12 right-12 text-4xl opacity-30 select-none pointer-events-none"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        🌙
      </motion.div>
    </div>
  );
}
