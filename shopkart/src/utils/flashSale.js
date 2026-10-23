import { FLASH_SALE } from '../constants'
import { roundMoney } from './cartCalculations'

// Demo flash-sale pricing — computed locally, not provided by the API.
export function getFlashSalePrice(price) {
  return roundMoney(price * (1 - FLASH_SALE.discountPercent / 100))
}

export function getFlashSalePercent(salePrice, originalPrice) {
  if (!originalPrice) return 0
  return Math.round((1 - salePrice / originalPrice) * 100)
}

// The sale rolls daily: it always ends at the next local midnight, so the
// countdown is meaningful without a backend-provided end time.
export function getFlashSaleEndsAt(now = Date.now()) {
  const end = new Date(now)
  end.setHours(24, 0, 0, 0)
  return end.getTime()
}

export function selectFlashSaleProducts(items) {
  const inCategory = items.filter(
    (product) => product.category === FLASH_SALE.category,
  )
  const pool = inCategory.length > 0 ? inCategory : items
  return pool.slice(0, FLASH_SALE.maxItems)
}
