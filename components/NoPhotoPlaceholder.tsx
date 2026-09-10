type Props = {
  label: string;
  className?: string;
};

export function NoPhotoPlaceholder({ label, className = "" }: Props) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-bg-soft px-4 ${className}`}
      aria-label={label}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(229,165,0,0.08))]" />
        <div className="no-photo-dust absolute bottom-[28%] left-[18%] h-1.5 w-1.5 rounded-full bg-accent/50" />
        <div className="no-photo-dust absolute bottom-[34%] left-[42%] h-1 w-1 rounded-full bg-accent/40 [animation-delay:0.4s]" />
        <div className="no-photo-dust absolute bottom-[30%] left-[58%] h-1.5 w-1.5 rounded-full bg-steel/60 [animation-delay:0.8s]" />
      </div>

      <svg
        viewBox="0 0 160 96"
        className="relative h-16 w-28 text-accent sm:h-20 sm:w-36"
        aria-hidden="true"
      >
        <path
          d="M8 78h144"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <path
          className="no-photo-dirt"
          d="M92 78c4-6 10-10 18-12 6 2 10 7 12 12H92z"
          fill="currentColor"
          fillOpacity="0.35"
        />

        <g className="no-photo-machine origin-[70px_62px]">
          <rect x="48" y="42" width="34" height="22" fill="currentColor" fillOpacity="0.9" />
          <rect x="52" y="46" width="14" height="10" fill="#f3f4f5" fillOpacity="0.85" />
          <rect x="82" y="50" width="28" height="14" fill="currentColor" fillOpacity="0.75" />
          <rect x="46" y="64" width="66" height="10" rx="2" fill="currentColor" fillOpacity="0.55" />
          <circle cx="56" cy="69" r="4" fill="#141618" fillOpacity="0.35" />
          <circle cx="78" cy="69" r="4" fill="#141618" fillOpacity="0.35" />
          <circle cx="100" cy="69" r="4" fill="#141618" fillOpacity="0.35" />

          <g className="no-photo-arm origin-[110px_54px]">
            <path
              d="M108 54 L132 40"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="square"
            />
            <path
              className="no-photo-bucket"
              d="M128 36 l14 2 -2 14 -12-4 z"
              fill="currentColor"
              fillOpacity="0.95"
            />
          </g>
        </g>
      </svg>

      <p className="relative max-w-[16ch] text-center text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-text-muted sm:text-xs">
        {label}
      </p>
    </div>
  );
}
