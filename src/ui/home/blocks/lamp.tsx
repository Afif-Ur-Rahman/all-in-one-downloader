"use client";

import { useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { toggleTheme } from "@/lib";

const PULL_TO_TOGGLE = 70;
const MAX_PULL = 120;
const CORD_LENGTH = 160;

const limit = (pullX: number, pullY: number): [number, number] => {
  const distance = Math.hypot(pullX, pullY);

  if (distance === 0) return [0, 0];

  const eased = MAX_PULL * (1 - Math.exp(-distance / MAX_PULL));
  const scale = eased / distance;

  return [pullX * scale, pullY * scale];
};

export const Lamp = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const release = useRef<ReturnType<typeof animate>[]>([]);

  const rotate = useTransform([x, y], ([pullX, pullY]: number[]) => {
    const [limitedX, limitedY] = limit(pullX, pullY);

    return -(Math.atan2(limitedX, CORD_LENGTH + limitedY) * 180) / Math.PI;
  });

  const stretch = useTransform([x, y], ([pullX, pullY]: number[]) => {
    const [limitedX, limitedY] = limit(pullX, pullY);

    return Math.max(
      0,
      Math.hypot(limitedX, CORD_LENGTH + limitedY) - CORD_LENGTH,
    );
  });

  const handleDragStart = () => {
    release.current.forEach((controls) => controls.stop());
  };

  const handleDragEnd = () => {
    const [limitedX, limitedY] = limit(x.get(), y.get());

    if (Math.hypot(limitedX, limitedY) >= PULL_TO_TOGGLE) {
      toggleTheme();
    }

    const spring = { type: "spring", stiffness: 70, damping: 5 } as const;

    release.current = [animate(x, 0, spring), animate(y, 0, spring)];
  };

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
      >
        <motion.div
          style={{ rotate, transformOrigin: "top center" }}
          className="relative"
        >
          <div className="lamp-sway relative flex flex-col items-center">
            <span className="h-12 w-px bg-border sm:h-20" />
            <motion.span
              style={{ height: stretch }}
              className="w-px bg-border"
            />

            <div className="relative">
              {/* Light cone, starts under the shade */}
              <span className="absolute top-[78%] left-1/2 h-80 w-80 -translate-x-1/2 bg-linear-to-b from-accent/20 to-transparent opacity-0 transition-opacity duration-700 [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)] sm:w-md dark:opacity-100" />

              {/* Glow around the bulb */}
              <span className="absolute top-[85%] left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-700 dark:opacity-100">
                <span className="bulb-glow block size-full rounded-full bg-accent/30 blur-2xl" />
              </span>

              <svg viewBox="0 0 96 76" className="relative w-20 sm:w-24">
                {/* Bulb */}
                <circle
                  cx="48"
                  cy="63"
                  r="10"
                  strokeWidth="1.5"
                  className="fill-surface-muted stroke-border transition-colors duration-500 dark:fill-white dark:stroke-white"
                />

                {/* Cap */}
                <rect
                  x="44"
                  y="4"
                  width="8"
                  height="10"
                  rx="2"
                  className="fill-muted/60"
                />

                {/* Shade */}
                <path
                  d="M12 56 C12 30 30 14 48 14 C66 14 84 30 84 56 Z"
                  strokeWidth="1.5"
                  className="fill-surface stroke-border transition-colors duration-500 dark:fill-surface-muted"
                />

                {/* Shine */}
                <path
                  d="M24 48 C26 36 34 28 42 25"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="stroke-border/70 dark:stroke-white/10"
                />

                {/* Rim */}
                <rect
                  x="8"
                  y="54"
                  width="80"
                  height="6"
                  rx="3"
                  className="fill-accent"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Invisible drag handle sitting over the lamp's resting position */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-12 z-20 flex justify-center sm:top-20"
      >
        <motion.div
          drag
          dragConstraints={{
            left: -MAX_PULL * 2,
            right: MAX_PULL * 2,
            top: -MAX_PULL / 2,
            bottom: MAX_PULL * 2,
          }}
          dragElastic={0}
          dragMomentum={false}
          style={{ x, y }}
          onTap={toggleTheme}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="pointer-events-auto h-16 w-24 cursor-grab touch-none select-none active:cursor-grabbing sm:h-20 sm:w-28"
        />
      </div>
    </>
  );
};
