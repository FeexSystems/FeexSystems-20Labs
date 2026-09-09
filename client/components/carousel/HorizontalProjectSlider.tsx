import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HorizontalProjectSliderProps {
  title?: string;
  badge?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  children: React.ReactNode;
  className?: string;
}

export function HorizontalProjectSlider({
  title = "Featured Living Intelligence Worlds",
  badge = "AUTHORITATIVE // EVIDENCE GROUNDED",
  subtitle = "Horizontal ecosystem stream of active repositories and technological topologies.",
  viewAllLink = "/projects",
  viewAllText = "View All Repositories",
  children,
  className,
}: HorizontalProjectSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 20);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 20);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distance = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative w-full font-mono select-none", className)}>
      {/* Slider Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-gray-20">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[10px] text-[#00F5D4]">
            <span className="size-1.5 rounded-full bg-[#00F5D4] animate-ping" />
            <span className="font-bold tracking-wider">{badge}</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-gray-40 mt-1 max-w-xl">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="flex items-center gap-1.5 text-xs text-gray-40 hover:text-[#00F5D4] transition-colors group mr-2"
            >
              <span>{viewAllText}</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex size-8 items-center justify-center rounded border border-gray-20 bg-[#090a0f] text-gray-40 transition-all hover:border-[#00F5D4]/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              title="Scroll left"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex size-8 items-center justify-center rounded border border-gray-20 bg-[#090a0f] text-gray-40 transition-all hover:border-[#00F5D4]/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              title="Scroll right"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Scroll Area with Gradient Edge Fades */}
      <div className="relative">
        {/* Left Fade */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#040406] to-transparent transition-opacity duration-300",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Scroll Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-4 px-1"
          style={{ scrollbarWidth: "none" }}
        >
          {children}
        </div>

        {/* Right Fade */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#040406] to-transparent transition-opacity duration-300",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </div>
  );
}

export default HorizontalProjectSlider;
