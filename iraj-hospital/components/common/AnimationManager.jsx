"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnimationManager() {
  const pathname = usePathname();

  useEffect(() => {
    // Run immediately and after a short delay to catch all rendered DOM elements
    const run = () => {
      initAnimations();
    };

    run();
    const t1 = setTimeout(run, 50);
    const t2 = setTimeout(run, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  const initAnimations = () => {
    // 1. Split Text for .text-anime-style-3
    const textElements = document.querySelectorAll(".text-anime-style-3:not(.split-ready)");
    textElements.forEach((el) => {
      el.classList.add("split-ready");
      const text = el.textContent || "";
      const words = text.trim().split(/\s+/);
      if (words.length === 0 || text.trim() === "") return;

      el.innerHTML = "";
      let charIndex = 0;

      words.forEach((word) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "anime-word";

        const chars = word.split("");
        chars.forEach((char) => {
          const charSpan = document.createElement("span");
          charSpan.className = "anime-char";
          charSpan.textContent = char;
          charSpan.style.transitionDelay = `${0.025 * charIndex}s`;
          wordSpan.appendChild(charSpan);
          charIndex++;
        });

        el.appendChild(wordSpan);
      });
    });

    // 2. Intersection Observer for scroll triggers
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -20px 0px",
      threshold: 0.05,
    };

    const triggerElement = (target) => {
      // WOW Card / Element Animation
      if (target.classList.contains("wow")) {
        const delay = target.getAttribute("data-wow-delay");
        const duration = target.getAttribute("data-wow-duration");
        if (delay) target.style.transitionDelay = delay;
        if (duration) target.style.transitionDuration = duration;
        target.classList.add("animated");
      }

      // 3D Text Anime Style
      if (target.classList.contains("text-anime-style-3")) {
        target.classList.add("animated");
      }

      // Image Reveal
      if (target.classList.contains("reveal")) {
        const delay = target.getAttribute("data-wow-delay");
        const img = target.querySelector("img");
        if (delay && img) {
          img.style.transitionDelay = delay;
        }
        target.classList.add("revealed");
      }

      // Number Counter
      if (target.classList.contains("counter") && !target.classList.contains("counted")) {
        target.classList.add("counted");
        animateCounter(target);
      }

      // Skill bar
      if (target.classList.contains("skillbar")) {
        const countBar = target.querySelector(".count-bar");
        const percent = target.getAttribute("data-percent") || "0%";
        if (countBar) {
          countBar.style.width = percent;
        }
      }
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          triggerElement(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe and check all elements
    const elementsToObserve = document.querySelectorAll(
      ".wow, .text-anime-style-3, .reveal, .counter, .skillbar"
    );

    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    elementsToObserve.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 20 && rect.bottom > 0) {
        // Already in viewport: trigger immediately
        triggerElement(el);
      } else {
        // Below viewport: observe for scroll
        observer.observe(el);
      }
    });
  };

  const animateCounter = (el) => {
    const rawText = el.textContent || "0";
    const targetValue = parseInt(rawText.replace(/\D/g, ""), 10) || 0;
    if (targetValue === 0) return;

    let start = 0;
    const duration = 1800;
    const stepTime = 25;
    const totalSteps = duration / stepTime;
    const increment = targetValue / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        el.textContent = targetValue.toString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start).toString();
      }
    }, stepTime);
  };

  return null;
}
