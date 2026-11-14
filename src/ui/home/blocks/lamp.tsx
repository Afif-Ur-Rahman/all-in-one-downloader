export const Lamp = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
    >
      <div className="lamp-sway relative flex flex-col items-center">
        <span className="h-10 w-px bg-border sm:h-14" />

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
    </div>
  );
};
