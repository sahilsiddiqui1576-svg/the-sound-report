"use client";

import { motion } from "framer-motion";

const bars = [4, 10, 16, 10, 18, 8, 14, 6];

export default function WaveformLogo({ size = 28 }: { size?: number }) {
  return (
    <span
      className="flex items-end gap-[2px]"
      style={{ height: size }}
      role="img"
      aria-label="The Sound Report logo"
    >
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-accent to-accent-soft"
          initial={{ height: h * 0.4 }}
          animate={{ height: [h * 0.4, h, h * 0.4] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatType: "loop",
            delay: i * 0.08,
            ease: "easeInOut"
          }}
        />
      ))}
    </span>
  );
}
