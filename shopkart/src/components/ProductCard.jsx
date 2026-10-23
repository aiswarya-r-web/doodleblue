import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Star } from 'lucide-react'
import { DEMO_BADGES } from '../constants'
import { addToCart, decrease, increase } from '../features/cart/cartSlice'
import { selectCartItemById } from '../features/cart/cartSelectors'
import {
  selectIsWishlisted,
  toggleWishlist,
} from '../features/wishlist/wishlistSlice'
import { toast } from 'sonner'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { getCardTint } from '../utils/cardTint'
import { formatCurrency } from '../utils/formatCurrency'
import { getFlashSalePercent } from '../utils/flashSale'
import QuantityStepper from './QuantityStepper'

export default function ProductCard({ product, salePrice }) {
  const dispatch = useDispatch()
  const cartItem = useSelector((state) => selectCartItemById(state, product.id))
  const wishlisted = useSelector((state) => selectIsWishlisted(state, product.id))
  const requireAuth = useRequireAuth()
  const tint = getCardTint(product.id)

  const flash = salePrice != null
  const displayPrice = flash ? salePrice : product.price
  const onSale = flash || product.price < 50
  const compareAt = flash ? product.price : product.price * 1.25
  const topRated = product.rating?.rate >= 4.5

  const handleAdd = () => {
    if (!requireAuth()) return
    dispatch(addToCart({ ...product, price: displayPrice, quantity: 1 }))
    toast.success('Added to cart', { description: product.title })
  }

  const handleWishlist = () => {
    dispatch(toggleWishlist(product))
    if (wishlisted) {
      toast('Removed from wishlist')
    } else {
      toast.success('Added to wishlist', { description: product.title })
    }
  }

  return (
    <motion.article
      className="product-card"
      whileTap={{ scale: 0.985 }}
      layout
    >
      <Link
        to={`/product/${product.id}`}
        className="product-card-link"
        aria-label={`View ${product.title}`}
      >
        <div className="product-media" style={{ background: tint }}>
          <div className="card-badges">
            {flash ? (
              <span className="badge badge-sale">
                −{getFlashSalePercent(salePrice, product.price)}%
              </span>
            ) : (
              onSale && (
                <span className="badge badge-sale">{DEMO_BADGES.sale}</span>
              )
            )}
            {topRated && (
              <span className="badge badge-top">{DEMO_BADGES.topRated}</span>
            )}
          </div>
          <img src={product.image} alt={product.title} loading="lazy" />
        </div>
        <div className="product-body">
          <span className="product-category">{product.category}</span>
          <h3 className="product-title">{product.title}</h3>
          <div className="flash-card-rating">
            <Star size={14} fill="var(--color-star)" color="var(--color-star)" />
            <span>
              {product.rating?.rate?.toFixed(1)} ({product.rating?.count ?? 0}{' '}
              reviews)
            </span>
          </div>
        </div>
      </Link>

      <motion.button
        type="button"
        className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
        onClick={handleWishlist}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={wishlisted}
        whileTap={{ scale: 1.25 }}
      >
        <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} />
      </motion.button>

      <div className="flash-card-foot">
        <div className="flash-card-price">
          <span className="price">{formatCurrency(displayPrice)}</span>
          {onSale && (
            <span className="price-compare">{formatCurrency(compareAt)}</span>
          )}
        </div>
        {cartItem ? (
          <QuantityStepper
            value={cartItem.quantity}
            small
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
    </motion.article>
  )
}
