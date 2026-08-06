import { useEffect, useRef, useState } from "react";
import heroScene from "@/assets/hero-scene.mp4.asset.json";

/**
 * Scroll-scrubbed cinematic scene.
 * Scroll progress maps to video timeline with lerp smoothing + rAF.
 */
export function ScrollScene() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const target = useRef(0);
  const current = useRef(0);
  const velocity = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let duration = 0;

    const onMeta = () => {
      duration = video.duration || 0;
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* noop */
      }
      setReady(true);
    };

    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const tick = () => {
      // spring-damped interpolation: physically weighted, never jumps
      const stiffness = 0.085;
      const damping = 0.78;
      const delta = target.current - current.current;
      velocity.current = velocity.current * damping + delta * stiffness;
      current.current += velocity.current;

      if (Math.abs(delta) < 0.00015 && Math.abs(velocity.current) < 0.00015) {
        current.current = target.current;
        velocity.current = 0;
      }

      if (duration > 0 && video.readyState >= 1) {
        const t = current.current * (duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.008) {
          try {
            video.currentTime = t;
          } catch {
            /* seeking guard */
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll, { passive: true });
    readScroll();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <video
        ref={videoRef}
        src={heroScene.url}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        className="h-full w-full object-cover will-change-transform"
        style={{
          transform: "translate3d(0,0,0) scale(1.06)",
          opacity: ready ? 1 : 0,
          transition: "opacity 1.2s ease-out",
        }}
      />
      <div className="pointer-events-none absolute inset-0 cinematic-veil" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 40%, transparent 30%, oklch(0.1 0.02 260 / 0.6) 100%)",
        }}
      />
    </div>
  );
}
