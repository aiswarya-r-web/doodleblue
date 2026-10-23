import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronRight,
  Heart,
  ImageOff,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import { ErrorState } from '../components/ErrorState'
import PageWrapper from '../components/PageWrapper'
import ProductCard from '../components/ProductCard'
import { ProductDetailsSkeleton } from '../components/LoadingSkeleton'
import QuantityStepper from '../components/QuantityStepper'
import RatingStars from '../components/RatingStars'
import { FREE_SHIPPING_THRESHOLD } from '../constants'
import { addToCart } from '../features/cart/cartSlice'
import {
  clearSelected,
  fetchProductById,
  fetchProducts,
} from '../features/products/productsSlice'
import {
  selectIsWishlisted,
  toggleWishlist,
} from '../features/wishlist/wishlistSlice'
import { toast } from 'sonner'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { formatCurrency } from '../utils/formatCurrency'

// The API returns a single image per product. The remaining gallery slots
// are honest placeholders rather than fabricated extra photos.
function Gallery({ product }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const thumbs = [
    { type: 'image', src: product.image },
    { type: 'placeholder' },
    { type: 'placeholder' },
    { type: 'placeholder' },
  ]

  return (
    <div className="pdp-gallery">
      <div className="pdp-main-image">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={product.image}
            alt={product.title}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        </AnimatePresence>
      </div>
      <div className="pdp-thumbs">
        {thumbs.map((thumb, index) =>
          thumb.type === 'image' ? (
            <button
              key={index}
              type="button"
              className={`pdp-thumb ${activeIndex === index ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Product image ${index + 1}`}
              aria-pressed={activeIndex === index}
            >
              <img src={thumb.src} alt="" />
            </button>
          ) : (
            <div
              key={index}
              className="pdp-thumb placeholder"
              title="No additional image available from the demo API"
              aria-hidden="true"
            >
              <ImageOff size={20} />
            </div>
          ),
        )}
      </div>
    </div>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const productId = Number(id)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [prevProductId, setPrevProductId] = useState(productId)

  const { item: product, status, error } = useSelector(
    (state) => state.products.selected,
  )
  const productsStatus = useSelector((state) => state.products.status)
  const allItems = useSelector((state) => state.products.items)
  const wishlisted = useSelector((state) =>
    selectIsWishlisted(state, productId),
  )
  const requireAuth = useRequireAuth()

  const validId = Number.isInteger(productId) && productId > 0

  // Reset the chosen quantity when navigating between products
  // (adjust-during-render pattern).
  if (prevProductId !== productId) {
    setPrevProductId(productId)
    setQuantity(1)
  }

  useEffect(() => {
    if (validId) dispatch(fetchProductById(productId))
    return () => dispatch(clearSelected())
  }, [dispatch, productId, validId])

  // Ensure the catalog is loaded for the "You may also like" rail.
  useEffect(() => {
    if (productsStatus === 'idle') dispatch(fetchProducts())
  }, [productsStatus, dispatch])

  const related = product
    ? allItems
        .filter(
          (entry) =>
            entry.category === product.category && entry.id !== product.id,
        )
        .slice(0, 4)
    : []

  const handleAddToCart = () => {
    if (!requireAuth()) return
    dispatch(addToCart({ ...product, quantity }))
    toast.success(`Added ${quantity} to cart`, { description: product.title })
  }

  const handleWishlist = () => {
    dispatch(toggleWishlist(product))
    if (wishlisted) {
      toast('Removed from wishlist')
    } else {
      toast.success('Added to wishlist', { description: product.title })
    }
  }

  let content
  if (!validId) {
    content = (
      <ErrorState
        title="Invalid product"
        message="The product link appears to be malformed."
      />
    )
  } else if (status === 'loading' || status === 'idle') {
    content = <ProductDetailsSkeleton />
  } else if (status === 'failed') {
    content = (
      <ErrorState
        title="Couldn't load this product"
        message={error}
        onRetry={() => dispatch(fetchProductById(productId))}
      />
    )
  } else if (!product) {
    content = (
      <ErrorState
        title="Product not found"
        message="This product is no longer available."
      />
    )
  } else {
    content = (
      <>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
          <ChevronRight size={13} />
          <span className="current">{product.title}</span>
        </nav>

        <div className="pdp-grid">
          <Gallery product={product} />

          <div className="pdp-info">
            <span className="product-category">{product.category}</span>
            <h1 className="pdp-title">{product.title}</h1>
            <div className="rating-row">
              <RatingStars rate={product.rating?.rate ?? 0} size={16} />
              <span>
                {product.rating?.rate?.toFixed(1)} ·{' '}
                {product.rating?.count ?? 0} reviews
              </span>
            </div>

            <p className="pdp-price">{formatCurrency(product.price)}</p>

            <p className="pdp-desc">{product.description}</p>

            <hr className="pdp-divider" />

            <div className="pdp-actions">
              <QuantityStepper
                value={quantity}
                onIncrease={() => setQuantity((q) => Math.min(q + 1, 99))}
                onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
                label="Select quantity"
              />
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <motion.button
                type="button"
                className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
                style={{ position: 'static', width: 52, height: 52 }}
                onClick={handleWishlist}
                aria-label={
                  wishlisted ? 'Remove from wishlist' : 'Add to wishlist'
                }
                aria-pressed={wishlisted}
                whileTap={{ scale: 1.2 }}
              >
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </motion.button>
            </div>

            <div style={{ marginTop: 14 }}>
              <button
                type="button"
                className="btn btn-outline btn-lg"
                onClick={() => navigate('/cart')}
              >
                Go to Cart
              </button>
            </div>

            <hr className="pdp-divider" />

            <div className="pdp-perks">
              <div className="perk">
                <Truck size={17} color="var(--color-success)" />
                <span>
                  <strong>Free shipping</strong> on orders of{' '}
                  {formatCurrency(FREE_SHIPPING_THRESHOLD)} or more — otherwise{' '}
                  {formatCurrency(5)} flat.
                </span>
              </div>
              <div className="perk">
                <RotateCcw size={17} color="var(--color-muted)" />
                <span>
                  <strong>30-day returns</strong> — demo return policy, no real
                  orders are fulfilled.
                </span>
              </div>
              <div className="perk">
                <ShieldCheck size={17} color="var(--color-muted)" />
                <span>
                  <strong>Secure demo checkout</strong> — no payment details are
                  collected.
                </span>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="related-section" aria-labelledby="related-title">
            <h2 className="related-title" id="related-title">
              You may also like
            </h2>
            <div className="product-grid">
              {related.map((entry) => (
                <ProductCard key={entry.id} product={entry} />
              ))}
            </div>
          </section>
        )}
      </>
    )
  }

  return (
    <PageWrapper>
      <div className="container">{content}</div>
    </PageWrapper>
  )
}
