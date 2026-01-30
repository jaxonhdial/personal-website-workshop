"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const menuItems = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/uil-analyzer", label: "UIL Analyzer" },
  { href: "/contact", label: "Contact" },
];

// Arc: sun at bottom-left (phase 0) -> noon (0.5) -> bottom-right (phase 1). Always drawn; clip hides behind mountains.
const FOREST_TOP_RATIO = 0.65; // forest occupies bottom 35%

function getSunPosition(
  phase: number,
  width: number,
  height: number
): { x: number; y: number } {
  const marginX = width * 0.1;
  const topY = height * 0.22; // noon height (above forest)
  const bottomY = height + 60; // below viewport

  // x: left to right with phase
  const x = marginX + (width - 2 * marginX) * phase;
  // y: parabolic arc bottom -> top -> bottom (4*t*(1-t) peaks at 1 at t=0.5)
  const t = phase;
  const y = bottomY - 4 * (bottomY - topY) * t * (1 - t);

  return { x, y };
}

// Smooth day/night sky: noon (phase 0.5) brightest, dawn/dusk/sun-below darker. Gradual blends.
function getSkyStyle(phase: number) {
  const dayness = 1 - 2 * Math.abs(phase - 0.5); // 1 at noon, 0 at phase 0 and 1
  const smooth = (a: number, b: number, t: number) =>
    Math.round(a + (b - a) * t);
  const topR = smooth(15, 12, dayness);
  const topG = smooth(23, 74, dayness);
  const topB = smooth(42, 110, dayness);
  const midR = smooth(30, 2, dayness);
  const midG = smooth(58, 132, dayness);
  const midB = smooth(95, 199, dayness);
  const horR = smooth(249, 56, dayness);
  const horG = smooth(115, 189, dayness);
  const horB = smooth(22, 248, dayness);
  const top = `rgb(${topR}, ${topG}, ${topB})`;
  const mid = `rgb(${midR}, ${midG}, ${midB})`;
  const horizon = `rgb(${horR}, ${horG}, ${horB})`;
  return {
    background: `linear-gradient(180deg, ${top} 0%, ${mid} 35%, ${horizon} 65%, #1a2e1a 82%, #0d1f0d 100%)`,
  };
}

export default function Home() {
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const hasDragged = useRef(false);
  const lastTime = useRef(performance.now());
  const rafId = useRef(0);
  const sunSize = 72;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateSize = () => {
      if (containerRef.current) {
        setSize({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const animateSun = useCallback(() => {
    const container = containerRef.current;
    if (!container || isDragging.current) {
      rafId.current = requestAnimationFrame(animateSun);
      return;
    }
    const now = performance.now();
    const dt = (now - lastTime.current) / 1000;
    lastTime.current = now;
    setPhase((p) => (p + dt / 45) % 1); // full cycle ~45 sec
    rafId.current = requestAnimationFrame(animateSun);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(animateSun);
    return () => cancelAnimationFrame(rafId.current);
  }, [animateSun]);

  const handleSunMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.clientX;
    setDragPosition({ x: arcLeftTopRef.current.x, y: arcLeftTopRef.current.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      if (Math.abs(e.clientX - dragStartX.current) > 15) hasDragged.current = true;
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setDragPosition({
          x: e.clientX - rect.left - sunSize / 2,
          y: e.clientY - rect.top - sunSize / 2,
        });
      }
    };
    const handleMouseUp = () => {
      if (isDragging.current && hasDragged.current) {
        setEasterEggActive(true);
      }
      isDragging.current = false;
      setDragPosition(null);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const arcPos = getSunPosition(phase, size.width, size.height);
  const arcLeftTop = { x: arcPos.x - sunSize / 2, y: arcPos.y - sunSize / 2 };
  const sunX = dragPosition ? dragPosition.x : arcLeftTop.x;
  const sunY = dragPosition ? dragPosition.y : arcLeftTop.y;
  const showSun = !easterEggActive;
  const arcLeftTopRef = useRef(arcLeftTop);
  arcLeftTopRef.current = arcLeftTop;

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen w-full overflow-hidden transition-[background] duration-700 ${
        easterEggActive ? "yellow-rock-wallpaper" : ""
      }`}
      style={easterEggActive ? undefined : getSkyStyle(phase)}
    >
      {/* Forest silhouette - only when not easter egg */}
      {!easterEggActive && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[15] h-[35%] min-h-[140px]"
          aria-hidden
        >
          <svg
            viewBox="0 0 1200 400"
            className="h-full w-full object-cover object-bottom"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="forestFill" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#0d1f0d" />
                <stop offset="40%" stopColor="#1a2e1a" />
                <stop offset="100%" stopColor="#0f1410" />
              </linearGradient>
            </defs>
            {/* Layered tree silhouettes */}
            <path fill="url(#forestFill)" d="M0,400 L0,280 Q50,200 80,280 L120,400 Z" opacity="0.9" />
            <path fill="url(#forestFill)" d="M100,400 L100,240 Q180,120 220,240 L280,400 Z" opacity="0.95" />
            <path fill="url(#forestFill)" d="M250,400 L250,200 Q350,80 400,200 L450,400 Z" opacity="0.9" />
            <path fill="url(#forestFill)" d="M400,400 L400,260 Q500,140 540,260 L600,400 Z" opacity="0.95" />
            <path fill="url(#forestFill)" d="M550,400 L550,220 Q650,100 700,220 L750,400 Z" opacity="0.9" />
            <path fill="url(#forestFill)" d="M700,400 L700,240 Q800,120 840,240 L900,400 Z" opacity="0.95" />
            <path fill="url(#forestFill)" d="M850,400 L850,200 Q950,80 1000,200 L1050,400 Z" opacity="0.9" />
            <path fill="url(#forestFill)" d="M1000,400 L1000,260 Q1100,140 1140,260 L1200,400 Z" opacity="0.95" />
            <path fill="url(#forestFill)" d="M1150,400 L1150,280 Q1190,200 1200,280 L1200,400 Z" opacity="0.9" />
          </svg>
        </div>
      )}

      {/* Sun: z-30 so it receives pointer events (draggable). Clipped to sky so appears behind mountains. */}
      {showSun && (
        <div
          className="absolute inset-0 z-30"
          style={{ clipPath: "inset(0 0 35% 0)", pointerEvents: "none" }}
          aria-hidden
        >
          <div
            ref={sunRef}
            role="button"
            tabIndex={0}
            aria-label="Drag the sun (easter egg)"
            onMouseDown={handleSunMouseDown}
            className="absolute cursor-grab select-none overflow-hidden rounded-full transition-transform hover:scale-110 active:cursor-grabbing pointer-events-auto"
            style={{
              left: sunX,
              top: sunY,
              width: sunSize,
              height: sunSize,
            }}
          >
            <Image
              src="/yellow_rock.gif"
              alt="Sun (drag for easter egg)"
              width={sunSize}
              height={sunSize}
              className="pointer-events-none h-full w-full object-cover drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* Menu: z-40 so title draws in front of sun. pointer-events-none on wrapper so clicks on title pass through to sun; nav has pointer-events-auto for links. */}
      <div
        className={`pointer-events-none relative z-40 flex min-h-screen ${easterEggActive ? "cs314-style items-center justify-center p-0" : "flex-col items-center justify-center px-6 py-8"}`}
      >
        {easterEggActive ? (
          /* CS314 / UT Austin classic page mimic - centered, no margin, no white bg */
          <div className="pointer-events-none flex w-full max-w-2xl flex-col items-center justify-center">
            <div className="flex justify-center">
              <table
                className="w-[90%] border-collapse border border-[#111111]"
                style={{ borderWidth: 1 }}
              >
                <tbody>
                  <tr>
                    <td className="border border-[#111111] p-2 text-center">
                      <p className="cs314-title">Jaxon Dial</p>
                      <p className="cs314-subtitle">Personal Website</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="cs314-body text-center">
              Welcome to my personal website.
              <strong className="ml-1">
                {" "}
                Note, this is the easter egg page. Drag the sun on the home
                page to get here.
              </strong>
            </p>
            <p className="cs314-body text-center">
              <strong>Refer to the </strong>
              <Link
                href="/"
                className="cs314-link pointer-events-auto"
                onClick={() => setEasterEggActive(false)}
              >
                <strong>home page</strong>
              </Link>
              <strong> to go back to the main menu.</strong>
            </p>
            <p className="cs314-heading text-center">
              <strong>Key Links:</strong>
            </p>
            <table
              className="w-full border-collapse"
              cellPadding={9}
              cellSpacing={6}
            >
              <tbody>
                {[
                  menuItems.slice(0, 3),
                  [...menuItems.slice(3, 4), null, null],
                ].map((row, ri) => (
                  <tr key={ri}>
                    {row.map((item, ci) => (
                      <td
                        key={item?.href ?? `empty-${ri}-${ci}`}
                        className="border-2 border-[#111111] align-top"
                        style={{ width: "33%" }}
                      >
                        {item ? (
                          <Link
                            href={item.href}
                            className="cs314-link pointer-events-auto"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          "\u00A0"
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <hr className="my-6 w-full border-[#111111]" />
            <p className="text-center">
              <Link
                href="/"
                className="cs314-link pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  setEasterEggActive(false);
                }}
              >
                Jaxon Dial&apos;s Homepage
              </Link>
            </p>
          </div>
        ) : (
          <>
            <div className="pointer-events-none flex flex-1 flex-col items-center justify-center">
              <h1
                className="mb-12 text-center font-bold tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-fredoka), sans-serif" }}
              >
                Jaxon Dial
              </h1>

              <nav
                className="pointer-events-auto flex flex-col gap-4 sm:gap-5"
                style={{ fontFamily: "var(--font-fredoka), sans-serif" }}
              >
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="menu-button block rounded-2xl border-2 border-white/30 bg-white/15 px-10 py-4 text-center text-lg font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/25 hover:shadow-xl hover:shadow-white/10 active:scale-[0.98] sm:px-14 sm:py-4 sm:text-xl"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
