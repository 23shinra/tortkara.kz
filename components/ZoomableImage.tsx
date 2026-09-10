"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { MagnifyingGlassMinus, MagnifyingGlassPlus } from "@phosphor-icons/react";

type Props = {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  zoomInLabel?: string;
  zoomOutLabel?: string;
  onSwipePrev?: () => void;
  onSwipeNext?: () => void;
};

const MIN = 0.5;
const MAX = 4;
const STEP = 0.25;
const FIT = 1;

export function ZoomableImage({
  src,
  alt,
  className = "",
  zoomInLabel = "Увеличить",
  zoomOutLabel = "Уменьшить",
  onSwipePrev,
  onSwipeNext,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(FIT);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [interacting, setInteracting] = useState(false);
  const scaleRef = useRef(FIT);
  const offsetRef = useRef({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const pointerDownAt = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const clampOffset = useCallback((nextScale: number, x: number, y: number) => {
    const el = containerRef.current;
    if (!el || nextScale <= FIT) return { x: 0, y: 0 };
    const { width, height } = el.getBoundingClientRect();
    const maxX = ((nextScale - 1) * width) / 2;
    const maxY = ((nextScale - 1) * height) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const applyZoom = useCallback(
    (next: number, originX?: number, originY?: number) => {
      const el = containerRef.current;
      const currentScale = scaleRef.current;
      const currentOffset = offsetRef.current;
      const clamped = Math.min(MAX, Math.max(MIN, Math.round(next * 100) / 100));

      if (!el || clamped <= FIT) {
        scaleRef.current = clamped;
        offsetRef.current = { x: 0, y: 0 };
        setScale(clamped);
        setOffset({ x: 0, y: 0 });
        return;
      }

      let nextOffset = currentOffset;
      if (originX != null && originY != null && currentScale > 0) {
        const rect = el.getBoundingClientRect();
        const cx = originX - rect.left - rect.width / 2;
        const cy = originY - rect.top - rect.height / 2;
        const ratio = clamped / currentScale;
        nextOffset = clampOffset(
          clamped,
          cx - (cx - currentOffset.x) * ratio,
          cy - (cy - currentOffset.y) * ratio,
        );
      } else {
        nextOffset = clampOffset(clamped, currentOffset.x, currentOffset.y);
      }

      scaleRef.current = clamped;
      offsetRef.current = nextOffset;
      setScale(clamped);
      setOffset(nextOffset);
    },
    [clampOffset],
  );

  const reset = useCallback(() => {
    scaleRef.current = FIT;
    offsetRef.current = { x: 0, y: 0 };
    setScale(FIT);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    reset();
  }, [src, reset]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onWheelNative(e: WheelEvent) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      applyZoom(scaleRef.current + delta, e.clientX, e.clientY);
    }
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, [applyZoom]);

  function onPointerDown(e: ReactPointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pointerDownAt.current = { x: e.clientX, y: e.clientY };
    setInteracting(true);
    swiped.current = false;

    if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStart.current = { dist, scale: scaleRef.current };
      dragStart.current = null;
      swipeStart.current = null;
      return;
    }

    if (scaleRef.current > FIT) {
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        ox: offsetRef.current.x,
        oy: offsetRef.current.y,
      };
      swipeStart.current = null;
    } else if (onSwipePrev || onSwipeNext) {
      swipeStart.current = { x: e.clientX, y: e.clientY };
      dragStart.current = null;
    }
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const next = pinchStart.current.scale * (dist / Math.max(pinchStart.current.dist, 1));
      applyZoom(next, midX, midY);
      return;
    }

    if (dragStart.current && scaleRef.current > FIT && pointers.current.size === 1) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const next = clampOffset(
        scaleRef.current,
        dragStart.current.ox + dx,
        dragStart.current.oy + dy,
      );
      offsetRef.current = next;
      setOffset(next);
    }
  }

  function onPointerUp(e: ReactPointerEvent) {
    const start = swipeStart.current;
    const down = pointerDownAt.current;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;

    if (pointers.current.size === 0 && start && scaleRef.current <= FIT && !swiped.current) {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        swiped.current = true;
        if (dx < 0) onSwipeNext?.();
        else onSwipePrev?.();
      }
    }

    if (pointers.current.size === 0) {
      dragStart.current = null;
      swipeStart.current = null;
      pointerDownAt.current = null;
      setInteracting(false);

      if (!swiped.current && down) {
        const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
        if (moved < 12) {
          if (scaleRef.current !== FIT) reset();
          else applyZoom(2.5, e.clientX, e.clientY);
        }
      }
    }
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div
        ref={containerRef}
        className="absolute inset-0 flex touch-none items-center justify-center overflow-hidden bg-bg-elevated"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: scale > FIT ? "grab" : "zoom-in" }}
      >
        <div
          className="flex h-full w-full items-center justify-center will-change-transform"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
            transition: interacting ? "none" : "transform 120ms ease-out",
          }}
        >
          {/* Product / gallery photos may include cache-bust query — skip optimizer */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="pointer-events-none max-h-full max-w-full select-none object-contain"
          />
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1">
        <span className="mr-1 hidden bg-bg/90 px-2 py-1 text-[0.7rem] font-semibold text-text-muted sm:inline">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            applyZoom(scaleRef.current - STEP);
          }}
          disabled={scale <= MIN + 0.001}
          className="inline-flex h-10 w-10 items-center justify-center bg-bg/90 text-text disabled:opacity-40"
          aria-label={zoomOutLabel}
        >
          <MagnifyingGlassMinus size={18} weight="bold" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            applyZoom(scaleRef.current + STEP);
          }}
          disabled={scale >= MAX - 0.001}
          className="inline-flex h-10 w-10 items-center justify-center bg-bg/90 text-text disabled:opacity-40"
          aria-label={zoomInLabel}
        >
          <MagnifyingGlassPlus size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}
