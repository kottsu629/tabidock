"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { getCoverImageStyle, type TripCoverImage } from "@/lib/trip-cover";
import SiteIcon from "./SiteIcon";

type Props = {
  images: TripCoverImage[];
  alt: string;
  href?: string;
  eager?: boolean;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  offsetX: number;
  moved: boolean;
};

export default function TripCoverCarousel({
  images,
  alt,
  href,
  eager = false,
}: Props) {
  const hasMultipleImages = images.length > 1;
  const slides = hasMultipleImages
    ? [images[images.length - 1], ...images, images[0]]
    : images;
  const [slideIndex, setSlideIndex] = useState(hasMultipleImages ? 1 : 0);
  const [dragOffset, setDragOffset] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);

  if (images.length === 0) {
    return (
      <section
        aria-label={alt}
        className="harbor-surface relative aspect-video flex items-center justify-center"
      >
        {href && (
          <Link
            href={href}
            aria-label={alt}
            className="absolute inset-0 z-10"
          />
        )}
        <SiteIcon name="map" className="size-12 text-white/65" />
      </section>
    );
  }

  const currentImageIndex = hasMultipleImages
    ? (slideIndex - 1 + images.length) % images.length
    : 0;

  const moveBy = (direction: -1 | 1) => {
    if (!hasMultipleImages || isAnimating) return;
    setTransitionEnabled(true);
    setIsAnimating(true);
    setSlideIndex((current) => current + direction);
  };

  const goTo = (imageIndex: number) => {
    if (imageIndex === currentImageIndex || isAnimating) return;
    setTransitionEnabled(true);
    setIsAnimating(true);
    setSlideIndex(imageIndex + 1);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (!hasMultipleImages || !event.isPrimary || isAnimating) return;

    suppressClickRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: 0,
      moved: false,
    };
    setTransitionEnabled(false);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const offsetX = event.clientX - drag.startX;
    const offsetY = event.clientY - drag.startY;
    if (!drag.moved && Math.abs(offsetY) > Math.abs(offsetX)) return;
    if (!drag.moved && Math.abs(offsetX) < 5) return;

    if (!drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    drag.offsetX = offsetX;
    setDragOffset(offsetX);
  };

  const finishDrag = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    setTransitionEnabled(true);
    setDragOffset(0);

    const threshold = Math.min(80, event.currentTarget.clientWidth * 0.16);
    if (Math.abs(drag.offsetX) >= threshold) {
      setIsAnimating(true);
      setSlideIndex((current) => current + (drag.offsetX < 0 ? 1 : -1));
    }
  };

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget) return;

    setIsAnimating(false);
    if (slideIndex === 0) {
      setTransitionEnabled(false);
      setSlideIndex(images.length);
    } else if (slideIndex === images.length + 1) {
      setTransitionEnabled(false);
      setSlideIndex(1);
    }
  };

  const stopControlPointer = (event: React.PointerEvent) => {
    event.stopPropagation();
  };

  return (
    <section
      aria-label={alt}
      className="group/carousel relative aspect-video touch-pan-y overflow-hidden bg-indigo-100"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      <div
        className="flex h-full will-change-transform"
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translate3d(calc(${-slideIndex * 100}% + ${dragOffset}px), 0, 0)`,
          transition: transitionEnabled ? "transform 300ms ease-out" : "none",
        }}
      >
        {slides.map((image, index) => {
          const isClone = hasMultipleImages && (index === 0 || index === slides.length - 1);
          return (
            <div
              key={`${image.image_url}-${index}`}
              aria-hidden={isClone || undefined}
              className="h-full min-w-full overflow-hidden"
            >
              {/* URLはユーザーごとに異なるためNext Imageの固定ホスト制約を適用しない。 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.image_url}
                alt={isClone ? "" : `${alt} ${hasMultipleImages ? `${index}枚目` : ""}`.trim()}
                loading={eager && index === (hasMultipleImages ? 1 : 0) ? "eager" : "lazy"}
                decoding="async"
                referrerPolicy="no-referrer"
                draggable={false}
                className="pointer-events-none h-full w-full select-none object-cover"
                style={getCoverImageStyle(image)}
              />
            </div>
          );
        })}
      </div>

      {href && (
        <Link
          href={href}
          aria-label={alt}
          onClick={(event) => {
            if (suppressClickRef.current) {
              event.preventDefault();
              suppressClickRef.current = false;
            }
          }}
          className="absolute inset-0 z-10"
        />
      )}

      {hasMultipleImages && (
        <>
          <button
            type="button"
            aria-label="前の写真"
            onPointerDown={stopControlPointer}
            onClick={() => moveBy(-1)}
            className="absolute left-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/55 text-2xl leading-none text-white shadow-sm backdrop-blur-sm transition-opacity hover:bg-slate-950/70 sm:opacity-0 sm:group-hover/carousel:opacity-100 sm:focus-visible:opacity-100"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="次の写真"
            onPointerDown={stopControlPointer}
            onClick={() => moveBy(1)}
            className="absolute right-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/55 text-2xl leading-none text-white shadow-sm backdrop-blur-sm transition-opacity hover:bg-slate-950/70 sm:opacity-0 sm:group-hover/carousel:opacity-100 sm:focus-visible:opacity-100"
          >
            ›
          </button>
          <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
            {images.map((image, index) => (
              <button
                key={`${image.image_url}-dot-${index}`}
                type="button"
                aria-label={`${index + 1}枚目の写真を表示`}
                aria-current={index === currentImageIndex ? "true" : undefined}
                onPointerDown={stopControlPointer}
                onClick={() => goTo(index)}
                className="flex size-6 items-center justify-center rounded-full"
              >
                <span
                  className={`size-2.5 rounded-full border border-white/80 shadow-sm transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-slate-950/35"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="absolute right-3 top-3 z-20 rounded-full bg-slate-950/60 px-2.5 py-1 text-[0.68rem] font-semibold tabular-nums text-white backdrop-blur-sm">
            {currentImageIndex + 1} / {images.length}
          </span>
        </>
      )}
    </section>
  );
}
