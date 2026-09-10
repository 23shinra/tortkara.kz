export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <video
        className="hero-bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/hero/hero-bg-poster.jpg?v=3"
      >
        <source src="/hero/hero-bg.mp4?v=3" type="video/mp4" />
      </video>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/hero-bg-poster.jpg?v=3" alt="" className="hero-bg-poster" />
    </div>
  );
}
