"use client";

import { useState } from "react";

export function useAccordion(initialIndex = 0) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const toggleIndex = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const isOpen = (index) => activeIndex === index;

  return { activeIndex, toggleIndex, isOpen, setActiveIndex };
}
