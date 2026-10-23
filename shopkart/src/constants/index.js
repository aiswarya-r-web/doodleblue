export const API_BASE_URL = 'https://fakestoreapi.com'

export const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'jewelery', label: 'Jewelery' },
  { value: "men's clothing", label: "Men's clothing" },
  { value: "women's clothing", label: "Women's clothing" },
]

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

// Free shipping threshold is applied on the merchandise subtotal before discounts.
export const FREE_SHIPPING_THRESHOLD = 100
export const STANDARD_SHIPPING_FEE = 5

// Demo coupons. These are client-side demo offers only — they are NOT
// provided or validated by the Fake Store API.
export const DEMO_COUPONS = {
  WELCOME10: {
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    description: '10% off eligible merchandise',
  },
  SHOP5: {
    code: 'SHOP5',
    type: 'fixed',
    value: 5,
    description: '$5 off your order',
  },
}

// Demo-only promotional labels shown on product cards for visual parity
// with real storefronts. Not sourced from the API.
export const DEMO_BADGES = {
  sale: 'Sale',
  topRated: 'Top Rated',
}

// Demo flash sale. Client-side promotion only — the Fake Store API has no
// discount data, so reduced prices are computed locally and labelled demo.
export const FLASH_SALE = {
  discountPercent: 35,
  category: 'electronics', // fallback: first items in the catalog
  maxItems: 4,
}
