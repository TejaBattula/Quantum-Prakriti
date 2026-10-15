import React, { useEffect, useRef, useState } from "react";
import "./InfiniteSpiral.css";

const defaultItems = [
  {
    number: "01",
    title: "Quantum Computing",
    description:
      "Unlocking computational possibilities beyond classical systems.",
    tag: "COMPUTE",
  },
  {
    number: "02",
    title: "Quantum AI",
    description:
      "Bringing quantum technologies and intelligent systems together.",
    tag: "INTELLIGENCE",
  },
  {
    number: "03",
    title: "Quantum Security",
    description:
      "Building stronger foundations for tomorrow's digital security.",
    tag: "SECURITY",
  },
  {
    number: "04",
    title: "Quantum Research",
    description:
      "Exploring new frontiers through advanced scientific innovation.",
    tag: "DISCOVERY",
  },
  {
    number: "05",
    title: "Quantum Hardware",
    description:
      "Advancing the technologies that power quantum computation.",
    tag: "ENGINEERING",
  },
  {
    number: "06",
    title: "Quantum Networks",
    description:
      "Connecting quantum systems through next-generation networks.",
    tag: "CONNECTIVITY",
  },
  {
    number: "07",
    title: "Quantum Innovation",
    description:
      "Transforming emerging quantum possibilities into real solutions.",
    tag: "INNOVATION",
  },
  {
    number: "08",
    title: "Quantum Future",
    description:
      "Creating new opportunities for the quantum era.",
    tag: "POSSIBILITY",
  },
];

export default function InfiniteSpiral({
  items = defaultItems,
  animationMode = "all",
  direction = "up",
  speed = 0.32,
  radius = 170,
  cardWidth = 190,
  cardHeight = 210,
  verticalSpacing = 62,
  perspective = 1100,
  cardsPerTurn = 7,
  rotation = 0,
  cardTilt = 0,
  cardRadius = 14,
  centerScale = 1.1,
  edgeFade = 0.2,
  edgeBlur = 1,
  pauseOnHover = true,
  className = "",
}) {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const animationRef = useRef({
    rotation: rotation,
    scroll: 0,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLightTheme, setIsLightTheme] = useState(false);

  const content = items?.length ? items : defaultItems;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      const root = document.documentElement;
      const body = document.body;

      const isLight =
        root.dataset.theme === "light" ||
        body.dataset.theme === "light" ||
        root.classList.contains("light") ||
        body.classList.contains("light") ||
        root.classList.contains("light-theme") ||
        body.classList.contains("light-theme") ||
        root.getAttribute("data-theme") === "light";

      setIsLightTheme(isLight);
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return undefined;

    let animationFrame;
    let lastTime = 0;
    let scrollTarget = 0;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      scrollTarget =
        (viewportHeight - rect.top) /
        (viewportHeight + rect.height);

      scrollTarget = Math.max(0, Math.min(1, scrollTarget));
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    const animate = (time) => {
      if (!containerRef.current) return;

      const delta = lastTime ? Math.min(time - lastTime, 40) : 16;
      lastTime = time;

      const state = animationRef.current;

      const shouldPause = pauseOnHover && isHovered;
      const shouldAnimate = isVisible && !shouldPause;

      if (shouldAnimate) {
        if (animationMode === "auto" || animationMode === "all") {
          state.rotation +=
            speed * delta * (direction === "down" ? -1 : 1);
        }

        if (animationMode === "scroll" || animationMode === "all") {
          state.scroll += (scrollTarget - state.scroll) * 0.06;
        }
      }

      const cards = container.querySelectorAll(
        ".infinite-spiral__card"
      );

      const total = cards.length;

      cards.forEach((card, index) => {
        const baseAngle =
          (index / total) * Math.PI * 2 * cardsPerTurn;

        const scrollAngle =
          animationMode === "scroll" || animationMode === "all"
            ? state.scroll * Math.PI * 2
            : 0;

        const angle = baseAngle + state.rotation + scrollAngle;

        const verticalOffset =
          index * verticalSpacing -
          (total * verticalSpacing) / 2;

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const y =
          verticalOffset +
          Math.sin(angle * 0.65) * 20;

        const depthScale =
          0.82 + ((z + radius) / (radius * 2)) * 0.24;

        const scale =
          depthScale *
          (Math.abs(Math.sin(angle)) < 0.25
            ? centerScale
            : 1);

        const opacity = Math.max(
          0.25,
          1 - Math.abs(z) / (radius * 2) * edgeFade
        );

        const blur =
          Math.abs(z) / (radius * 2) * edgeBlur;

        const tilt = cardTilt;

        card.style.transform = `
          translate3d(${x}px, ${y}px, ${z}px)
          rotateY(${-angle * (180 / Math.PI) + 90}deg)
          rotateZ(${tilt}deg)
          scale(${scale})
        `;

        card.style.opacity = opacity;
        card.style.filter = `blur(${blur}px)`;

        card.style.zIndex = String(
          Math.round(z + radius + index)
        );

        card.style.setProperty(
          "--spiral-angle",
          `${angle}rad`
        );
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, [
    animationMode,
    direction,
    speed,
    radius,
    verticalSpacing,
    cardsPerTurn,
    cardTilt,
    centerScale,
    edgeFade,
    edgeBlur,
    pauseOnHover,
    isHovered,
    isVisible,
  ]);

  return (
    <div
      ref={containerRef}
      className={[
        "infinite-spiral",
        isLightTheme
          ? "infinite-spiral--light"
          : "infinite-spiral--dark",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--spiral-card-width": `${cardWidth}px`,
        "--spiral-card-height": `${cardHeight}px`,
        "--spiral-card-radius": `${cardRadius}px`,
        "--spiral-perspective": `${perspective}px`,
        "--spiral-radius": `${radius}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="infinite-spiral__ambient infinite-spiral__ambient--one" />
      <div className="infinite-spiral__ambient infinite-spiral__ambient--two" />

      <div className="infinite-spiral__header">
        <span className="infinite-spiral__eyebrow">
          <span className="infinite-spiral__status-dot" />
          THE QUANTUM ECOSYSTEM
        </span>

        <span className="infinite-spiral__index">
          Q<span>/</span>01
        </span>
      </div>

      <div className="infinite-spiral__stage">
        <div className="infinite-spiral__orbit infinite-spiral__orbit--outer" />
        <div className="infinite-spiral__orbit infinite-spiral__orbit--inner" />

        <div className="infinite-spiral__core">
          <span className="infinite-spiral__core-symbol">Q</span>
          <span className="infinite-spiral__core-label">
            QUANTUM
          </span>
        </div>

        <div className="infinite-spiral__scene">
          {content.map((item, index) => (
            <article
              key={`${item.number || index}-${item.title}`}
              className="infinite-spiral__card"
              style={{
                borderRadius: `var(--spiral-card-radius)`,
              }}
            >
              <div className="infinite-spiral__card-top">
                <span className="infinite-spiral__card-number">
                  {item.number ||
                    String(index + 1).padStart(2, "0")}
                </span>

                <span className="infinite-spiral__card-symbol">
                  ◇
                </span>
              </div>

              <div className="infinite-spiral__card-content">
                <span className="infinite-spiral__card-tag">
                  {item.tag || "QUANTUM TECHNOLOGY"}
                </span>

                <h3 className="infinite-spiral__card-title">
                  {item.title}
                </h3>

                <p className="infinite-spiral__card-description">
                  {item.description}
                </p>
              </div>

              <div className="infinite-spiral__card-footer">
                <span>Q-PRAKRITI</span>

                <span className="infinite-spiral__card-arrow">
                  ↗
                </span>
              </div>

              <div className="infinite-spiral__card-glow" />
            </article>
          ))}
        </div>
      </div>

      <div className="infinite-spiral__footer">
        <span className="infinite-spiral__footer-line" />

        <span className="infinite-spiral__footer-text">
          EXPLORING THE QUANTUM FRONTIER
        </span>

        <span className="infinite-spiral__footer-line" />
      </div>
    </div>
  );
}