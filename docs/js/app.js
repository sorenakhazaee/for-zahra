import PageManager from "./pageManager.js";

import { renderPage01 } from "./pages/page01.js";
import { renderPage02 } from "./pages/page02.js";
import { renderPage03 } from "./pages/page03.js";
import { renderPages04to13 } from "./pages/page04to13.js";
import { renderPage14 } from "./pages/page14.js";

console.log("For Zahra project started successfully.");

const pageManager = new PageManager();

const scene = document.querySelector("#scene");

const backgroundMusic = document.querySelector("#backgroundMusic");
const musicToggle = document.querySelector("#musicToggle");

musicToggle.style.position = "fixed";
musicToggle.style.left = "55%";
musicToggle.style.top = "auto";
musicToggle.style.right = "auto";
musicToggle.style.bottom = "30px";
musicToggle.style.transform = "translateX(-50%)";
musicToggle.style.zIndex = "2147483647";

if (backgroundMusic && musicToggle) {
  musicToggle.addEventListener("click", async (event) => {
    event.stopPropagation();

    try {
      if (backgroundMusic.paused) {
        backgroundMusic.volume = 0.55;

        await backgroundMusic.play();

        musicToggle.textContent = "🔊";
        musicToggle.setAttribute("aria-label", "توقف موسیقی");
      } else {
        backgroundMusic.pause();

        musicToggle.textContent = "🎵";
        musicToggle.setAttribute("aria-label", "پخش موسیقی");
      }
    } catch (error) {
      console.error("Music playback error:", error);
    }
  });
}

/* =========================================
   INITIAL PAGE STRUCTURE
   ========================================= */

scene.innerHTML = `
    <div class="page-layer page01-layer">
        ${renderPage01()}
    </div>

    <div class="page-layer page02-layer">
        ${renderPage02()}
    </div>

    <div class="page-layer page03-layer">
        ${renderPage03()}
    </div>

    ${renderPages04to13()}

    <div class="page-layer page14-layer">
        ${renderPage14()}
    </div>

`;

/* =========================================
   PAGE INDICATOR
   ========================================= */

const pageIndicator = document.createElement("div");

pageIndicator.id = "page-indicator";

pageIndicator.innerHTML = `
    <div class="page-progress">

        <div class="page-progress-counter">
            <span id="current-page-number">01</span>
            <span class="page-progress-divider">/</span>
            <span id="total-page-number">14</span>
        </div>

        <div
            id="page-progress-track"
            class="page-progress-track"
        >
            <div
                id="page-progress-fill"
                class="page-progress-fill"
            ></div>
        </div>

    </div>
`;

document.body.appendChild(pageIndicator);

/* =========================================
   PAGE 01 PARTICLES
   ========================================= */

const particles = document.querySelectorAll(".page01-layer .particle");

const particlePositions = [
  { left: "8%", top: "78%", delay: "0s" },
  { left: "18%", top: "62%", delay: "1.2s" },
  { left: "27%", top: "82%", delay: "2.8s" },
  { left: "38%", top: "70%", delay: "0.7s" },
  { left: "48%", top: "88%", delay: "3.5s" },
  { left: "57%", top: "73%", delay: "1.8s" },
  { left: "67%", top: "84%", delay: "4.2s" },
  { left: "76%", top: "63%", delay: "2.4s" },
  { left: "84%", top: "78%", delay: "0.9s" },
  { left: "91%", top: "58%", delay: "3.1s" },
  { left: "42%", top: "55%", delay: "4.8s" },
  { left: "72%", top: "45%", delay: "1.5s" },
];

particles.forEach((particle, index) => {
  const position = particlePositions[index];

  if (!position) {
    return;
  }

  particle.style.left = position.left;
  particle.style.top = position.top;
  particle.style.animationDelay = position.delay;

  const duration = 5 + Math.random() * 4;

  particle.style.setProperty("--particle-duration", `${duration}s`);
});

/* =========================================
   PARALLAX / TOUCH MOVEMENT
   ========================================= */

let targetX = 0;
let targetY = 0;

let currentX = 0;
let currentY = 0;

scene.addEventListener("pointermove", (event) => {
  const rect = scene.getBoundingClientRect();

  targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;

  targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
});

function animateScene() {
  currentX += (targetX - currentX) * 0.03;
  currentY += (targetY - currentY) * 0.03;

  document.documentElement.style.setProperty("--scene-x", `${currentX}px`);

  document.documentElement.style.setProperty("--scene-y", `${currentY}px`);

  requestAnimationFrame(animateScene);
}

animateScene();

/* =========================================
   PAGE CLASS MANAGEMENT
   ========================================= */

function activatePage(pageNumber) {
  /* =========================================
   UPDATE PAGE INDICATOR
   ========================================= */

  const currentPageNumber = document.querySelector("#current-page-number");

  const pageProgressFill = document.querySelector("#page-progress-fill");

  if (currentPageNumber) {
    currentPageNumber.textContent = String(pageNumber).padStart(2, "0");
  }

  if (pageProgressFill) {
    const progress = (pageNumber / pageManager.totalPages) * 100;

    pageProgressFill.style.width = `${progress}%`;
  }

  const classesToRemove = [
    "page2-active",
    "page3-active",

    "story-page-04-active",
    "story-page-05-active",
    "story-page-06-active",
    "story-page-07-active",
    "story-page-08-active",
    "story-page-09-active",
    "story-page-10-active",
    "story-page-11-active",
    "story-page-12-active",
    "story-page-13-active",
    "page14-active",
  ];

  scene.classList.remove(...classesToRemove);

  if (pageNumber === 2) {
    scene.classList.add("page2-active");
    return;
  }

  if (pageNumber === 3) {
    scene.classList.add("page3-active");
    return;
  }

  if (pageNumber >= 4 && pageNumber <= 13) {
    scene.classList.add(
      `story-page-${String(pageNumber).padStart(2, "0")}-active`,
    );

    return;
  }

  if (pageNumber === 14) {
    scene.classList.add("page14-active");
  }
}

/* =========================================
   PAGE NAVIGATION
   ========================================= */

scene.addEventListener("click", (event) => {
  if (pageManager.isTransitioning) {
    return;
  }

  const rect = scene.getBoundingClientRect();

  const clickX = event.clientX - rect.left;
  const middle = rect.width / 2;

  // =========================================
  // RIGHT SIDE → NEXT PAGE
  // =========================================

  if (clickX >= middle) {
    if (pageManager.currentPage >= pageManager.totalPages) {
      return;
    }

    pageManager.next();

    activatePage(pageManager.currentPage);

    return;
  }

  // =========================================
  // LEFT SIDE → PREVIOUS PAGE
  // =========================================

  if (pageManager.currentPage <= 1) {
    return;
  }

  pageManager.previous();

  activatePage(pageManager.currentPage);
});

/* =========================================
   MOBILE SWIPE NAVIGATION
   ========================================= */

let touchStartX = 0;
let touchStartY = 0;
let lastTouchTime = 0;

const SWIPE_THRESHOLD = 50;

scene.addEventListener(
  "touchstart",
  (event) => {
    if (!event.touches.length) {
      return;
    }

    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  },
  { passive: true },
);

scene.addEventListener(
  "touchend",
  (event) => {
    if (!event.changedTouches.length) {
      return;
    }

    lastTouchTime = Date.now();

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    /*
     * فقط حرکت افقی را بررسی می‌کنیم.
     */
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    /*
     * حرکت کمتر از حد مشخص، Swipe نیست.
     */
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
      return;
    }

    // =========================================
    // SWIPE LEFT → NEXT PAGE
    // =========================================

    if (deltaX < 0) {
      if (
        pageManager.isTransitioning ||
        pageManager.currentPage >= pageManager.totalPages
      ) {
        return;
      }

      pageManager.next();

      activatePage(pageManager.currentPage);

      return;
    }

    // =========================================
    // SWIPE RIGHT → PREVIOUS PAGE
    // =========================================

    if (deltaX > 0) {
      if (pageManager.isTransitioning || pageManager.currentPage <= 1) {
        return;
      }

      pageManager.previous();

      activatePage(pageManager.currentPage);

      return;
    }
  },
  { passive: true },
);
