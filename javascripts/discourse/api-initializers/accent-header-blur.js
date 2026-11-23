import { apiInitializer } from "discourse/lib/api";

// Matches the `animation-range` end in common/common.scss. Past this scroll
// offset the header must be blurred regardless of what the CSS scroll
// timeline reports (Safari can leave it stuck at 0% after SPA scroll jumps,
// e.g. opening a topic deep at the last-read post).
const BLUR_AFTER_PX = 200;

export default apiInitializer((api) => {
  const root = document.documentElement;
  let ticking = false;

  const sync = () => {
    ticking = false;
    root.classList.toggle(
      "accent-header-blurred",
      window.scrollY >= BLUR_AFTER_PX
    );
  };

  const requestSync = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(sync);
    }
  };

  window.addEventListener("scroll", requestSync, { passive: true });
  api.onPageChange(requestSync);
  requestSync();
});
