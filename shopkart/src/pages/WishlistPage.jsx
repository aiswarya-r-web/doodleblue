import { useSelector } from 'react-redux'
import { Heart } from 'lucide-react'
import { EmptyState } from '../components/ErrorState'
import PageWrapper from '../components/PageWrapper'
import ProductCard from '../components/ProductCard'
import { selectWishlistItems } from '../features/wishlist/wishlistSlice'

export default function WishlistPage() {
  const items = useSelector(selectWishlistItems)

  return (
    <PageWrapper>
      <div className="container">
        <div className="page-head">
          <h1 className="page-title">Wishlist</h1>
          <p className="page-subtitle">
            {items.length} saved item{items.length === 1 ? '' : 's'}
          </p>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={<Heart size={28} />}
            title="Your wishlist is empty"
            message="Save products you're interested in by tapping the heart icon on any product."
            actionLabel="Browse Products"
            actionTo="/"
          />
        ) : (
          <div className="wishlist-grid">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
