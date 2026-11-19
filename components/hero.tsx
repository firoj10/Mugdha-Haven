"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { t: "slide1t", img: "/images/hero-1.webp" },
  { t: "slide2t", img: "/images/hero-2.webp" },
  { t: "slide3t", img: "/images/hero-3.webp" },
] as const;

const BANNERS = [
  { k: "banner1", src: "/images/banner-1.webp", w: 1920, h: 788 },
  { k: "banner2", src: "/images/banner-2.webp", w: 1920, h: 788 },
  { k: "banner3", src: "/images/banner-3.webp", w: 1365, h: 679 },
] as const;

const arrow =
  "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/80 p-2 shadow transition-transform duration-500 hover:scale-105";

export function Hero() {
  const t = useTranslations("site");
  const [i, setI] = useState(0);
  const go = (n: number) => setI((n + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-gradient-to-b from-secondary/70 to-transparent">
      <div className="container py-8 md:py-14">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Left: slider */}
          <div className="relative overflow-hidden rounded-xl bg-secondary">
            <div className="relative aspect-[3/2] w-full">
              {SLIDES.map((sl, idx) => (
                <Link
                  key={sl.t}
                  href="/shop"
                  aria-hidden={idx !== i}
                  tabIndex={idx === i ? 0 : -1}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    idx === i ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  <Image
                    src={sl.img}
                    alt={t(sl.t)}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </Link>
              ))}
            </div>
            <button aria-label="Previous slide" onClick={() => go(i - 1)} className={`${arrow} left-4`}>
              <ChevronLeft className="size-5" />
            </button>
            <button aria-label="Next slide" onClick={() => go(i + 1)} className={`${arrow} right-4`}>
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === i ? "w-6 bg-primary" : "w-2 bg-card/80"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: one wide banner + two small */}
          <div className="flex flex-col gap-4">
            <Banner b={BANNERS[0]} alt={t(BANNERS[0].k)} />
            <div className="grid grid-cols-2 gap-4">
              <Banner b={BANNERS[1]} alt={t(BANNERS[1].k)} />
              <Banner b={BANNERS[2]} alt={t(BANNERS[2].k)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Banner({
  b,
  alt,
}: {
  b: { src: string; w: number; h: number };
  alt: string;
}) {
  return (
    <Link href="/shop" className="group relative block flex-1 overflow-hidden rounded-xl">
      <Image
        src={b.src}
        alt={alt}
        width={b.w}
        height={b.h}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </Link>
  );
}
