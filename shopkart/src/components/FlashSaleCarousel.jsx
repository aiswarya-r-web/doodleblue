import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { toast } from 'sonner'
import { FLASH_SALE } from '../constants'
import { addToCart, decrease, increase } from '../features/cart/cartSlice'
import { selectCartItemById } from '../features/cart/cartSelectors'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { getCardTint } from '../utils/cardTint'
import { formatCurrency } from '../utils/formatCurrency'
import { getFlashSalePercent, getFlashSalePrice } from '../utils/flashSale'
import QuantityStepper from './QuantityStepper'

function FlashCard({ product }) {
  const dispatch = useDispatch()
  const requireAuth = useRequireAuth()
  const tint = getCardTint(product.id)
  const cartItem = useSelector((state) =>
    selectCartItemById(state, product.id),
  )
  const salePrice = getFlashSalePrice(product.price)
  const percent = getFlashSalePercent(salePrice, product.price)

  const handleAdd = () => {
    if (!requireAuth()) return
    dispatch(addToCart({ ...product, price: salePrice, quantity: 1 }))
    toast.success('Added to cart', { description: product.title })
  }

  return (
    <article className="flash-card">
      <span className="badge badge-sale flash-card-badge">−{percent}%</span>
      <Link
        to={`/product/${product.id}`}
        className="flash-card-media"
        style={{ background: tint }}
        aria-label={`View ${product.title}`}
      >
        <img src={product.image} alt={product.title} loading="lazy" />
      </Link>
      <span className="product-category">{product.category}</span>
      <Link to={`/product/${product.id}`} className="flash-card-title">
        {product.title}
      </Link>
      <div className="flash-card-rating">
        <Star size={14} fill="var(--color-star)" color="var(--color-star)" />
        <span>
          {product.rating?.rate?.toFixed(1)} ({product.rating?.count ?? 0}{' '}
          reviews)
        </span>
      </div>
      <div className="flash-card-foot">
        <div className="flash-card-price">
          <span className="price">{formatCurrency(salePrice)}</span>
          <span className="price-compare">
            {formatCurrency(product.price)}
          </span>
        </div>
        {cartItem ? (
          <QuantityStepper
            small
            value={cartItem.quantity}
            onIncrease={() => dispatch(increase(product.id))}
            onDecrease={() => dispatch(decrease(product.id))}
            label={`Quantity of ${product.title}`}
          />
        ) : (
          <button
            type="button"
            className="btn btn-primary flash-add"
            onClick={handleAdd}
          >
            Add to cart
          </button>
        )}
      </div>
    </article>
  )
}

export default function FlashSaleCarousel({ items }) {
  const trackRef = useRef(null)

  const scroll = (direction) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({
      left: direction * track.clientWidth * 0.7,
      behavior: 'smooth',
    })
  }

  if (!items.length) return null

  return (
    <section
      id="flash-sale"
      className="flash-deals"
      aria-labelledby="flash-deals-title"
    >
      <div className="flash-deals-head">
        <h2 className="related-title" id="flash-deals-title">
          Flash deals — up to {FLASH_SALE.discountPercent}% off
        </h2>
        <div className="flash-nav">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous deals"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next deals"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="flash-track" ref={trackRef}>
        {items.map((product) => (
          <FlashCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
