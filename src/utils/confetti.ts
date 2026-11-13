import confetti from 'canvas-confetti';

/**
 * Fires a joyful, organic climate-themed confetti burst
 * using lush forest greens, golds, and emerald sparkles.
 */
export function fireCelebrationConfetti() {
  // Burst 1: Central fan
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#4A6741', '#78B169', '#A8C7A0', '#D4AF37', '#2E4726', '#E8EFE5'],
    disableForReducedMotion: true,
  });

  // Burst 2: Left and right flanking sparkles with slight delay
  setTimeout(() => {
    confetti({
      particleCount: 35,
      angle: 60,
      spread: 55,
      origin: { x: 0.15, y: 0.7 },
      colors: ['#4A6741', '#8C7851', '#78B169', '#FFFFFF'],
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 35,
      angle: 120,
      spread: 55,
      origin: { x: 0.85, y: 0.7 },
      colors: ['#4A6741', '#8C7851', '#78B169', '#FFFFFF'],
      disableForReducedMotion: true,
    });
  }, 180);
}
