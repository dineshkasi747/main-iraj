"use client";

import { useAccordion } from "@/hooks/useAccordion";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ items = [], initialIndex = 0 }) {
  const { toggleIndex, isOpen } = useAccordion(initialIndex);

  if (!items || items.length === 0) return null;

  return (
    <div className="faq-accordion-wrapper">
      {items.map((item, index) => {
        const open = isOpen(index);
        return (
          <div
            key={item.id || index}
            className={`accordion-item-custom ${open ? "active" : ""}`}
          >
            <button
              type="button"
              className="accordion-header-custom"
              onClick={() => toggleIndex(index)}
              aria-expanded={open}
            >
              <span>{item.question}</span>
              <ChevronDown
                size={20}
                className="text-primary flex-shrink-0"
                style={{
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s ease",
                }}
              />
            </button>
            {open && (
              <div className="accordion-content-custom">
                <p className="mb-0">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
