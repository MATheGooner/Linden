export function nextGalleryIndex(current: number, offset: number, imageCount: number): number {
  if (!Number.isInteger(current) || !Number.isInteger(offset) || !Number.isInteger(imageCount) || imageCount < 1) return 0;
  return ((current + offset) % imageCount + imageCount) % imageCount;
}
