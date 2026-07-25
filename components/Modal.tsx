"use client";

import { useEffect, useRef } from "react";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
  size?: "md" | "lg";
};

export default function Modal({ onClose, children, size = "md" }: Props) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };

    const scrollY = window.scrollY;
    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;
    const originalBodyStyles = {
      overflow: bodyStyle.overflow,
      position: bodyStyle.position,
      top: bodyStyle.top,
      left: bodyStyle.left,
      right: bodyStyle.right,
      width: bodyStyle.width,
    };
    const originalHtmlStyles = {
      overflow: htmlStyle.overflow,
      overscrollBehavior: htmlStyle.overscrollBehavior,
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    window.addEventListener("keydown", handler);

    return () => {
      bodyStyle.overflow = originalBodyStyles.overflow;
      bodyStyle.position = originalBodyStyles.position;
      bodyStyle.top = originalBodyStyles.top;
      bodyStyle.left = originalBodyStyles.left;
      bodyStyle.right = originalBodyStyles.right;
      bodyStyle.width = originalBodyStyles.width;
      htmlStyle.overflow = originalHtmlStyles.overflow;
      htmlStyle.overscrollBehavior = originalHtmlStyles.overscrollBehavior;
      window.removeEventListener("keydown", handler);
      window.scrollTo(0, scrollY);
    };
  }, []);

  const maxW = size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden overscroll-none p-3 sm:p-4 bg-black/60 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full min-w-0 ${maxW} max-h-[90dvh] overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl shadow-[0_24px_70px_rgba(24,50,46,0.25)] bg-[#fffdf8] text-gray-900`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
