/**
 * Shared screen anchor for the hero globe's home marker (Kochi).
 *
 * The globe publishes the marker's projected position in normalized device
 * coordinates plus its canvas; readers resolve it to viewport pixels on demand,
 * so the answer stays correct while the canvas is still being laid out.
 */
const anchor = {
  ndcX: 0,
  ndcY: 0,
  facing: false,
  canvas: null as HTMLCanvasElement | null,
};

export function publishGlobeAnchor(canvas: HTMLCanvasElement, ndcX: number, ndcY: number, facing: boolean) {
  anchor.canvas = canvas;
  anchor.ndcX = ndcX;
  anchor.ndcY = ndcY;
  anchor.facing = facing;
}

export function clearGlobeAnchor(canvas: HTMLCanvasElement) {
  if (anchor.canvas === canvas) anchor.canvas = null;
}

/** Viewport position of the home marker, or null when the globe is not available. */
export function readGlobeAnchor(): { x: number; y: number } | null {
  const canvas = anchor.canvas;
  if (!canvas || !anchor.facing || !canvas.isConnected) return null;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  return {
    x: rect.left + ((anchor.ndcX + 1) / 2) * rect.width,
    y: rect.top + ((1 - anchor.ndcY) / 2) * rect.height,
  };
}
