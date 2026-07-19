"use client";

import { useEffect } from "react";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
  size?: "md" | "lg";
};

export default function Modal({ onClose, children, size = "md" }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  const maxW = size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden p-3 sm:p-4 bg-black/60 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <div
        className={`w-full min-w-0 ${maxW} max-h-[90dvh] overflow-x-hidden overflow-y-auto rounded-2xl shadow-[0_24px_70px_rgba(24,50,46,0.25)] bg-[#fffdf8] text-gray-900`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
