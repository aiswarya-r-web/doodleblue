// Rotating pastel tints for product card image backgrounds.
// Deterministic by product id — the same product keeps its tint across
// the grid, carousel, wishlist and related sections.
export const CARD_TINTS = ['#fbe9dd', '#e6effb', '#e7f5ec', '#fbf3d7']

export function getCardTint(seed = 0) {
  return CARD_TINTS[Math.abs(Number(seed) || 0) % CARD_TINTS.length]
}
