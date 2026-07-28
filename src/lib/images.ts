export const MAX_EDGE_PX = 1024;
export const JPEG_QUALITY = 0.7;

/**
 * Scale (width, height) so the longest edge is at most maxEdge, preserving
 * aspect ratio. Never upscales.
 */
export function fitWithin(
  width: number,
  height: number,
  maxEdge = MAX_EDGE_PX
): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= maxEdge) return { width, height };
  const scale = maxEdge / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** Browser-only: read a photo file, downscale it, and return a JPEG data URL. */
export async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = fitWithin(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas ikke understøttet");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}
