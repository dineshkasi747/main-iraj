"use client";

import { useScroll } from "@/hooks/useScroll";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const { isScrolled } = useScroll(300);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isScrolled) return null;

  return (
    <button
      onClick={scrollToTop}
      className="scroll-to-top"
      aria-label="Scroll to top of page"
      title="Scroll to top"
    >
      <ArrowUp size={22} />
    </button>
  );
}
