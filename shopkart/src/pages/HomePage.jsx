import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Loader2, SearchX } from 'lucide-react'
import CategoryFilter from '../components/CategoryFilter'
import { EmptyState, ErrorState } from '../components/ErrorState'
import PageWrapper from '../components/PageWrapper'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/LoadingSkeleton'
import { SORT_OPTIONS } from '../constants'
import {
  fetchProducts,
  setCategory,
  setSearchQuery,
  setSort,
} from '../features/products/productsSlice'

export default function HomePage() {
  const dispatch = useDispatch()
  const { items, status, error, searchQuery, category, sort } = useSelector(
    (state) => state.products,
  )

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [status, dispatch])

  const visibleProducts = useMemo(() => {
    let result = items
    if (category !== 'all') {
      result = result.filter((product) => product.category === category)
    }
    const query = searchQuery.trim().toLowerCase()
    if (query) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(query),
      )
    }
    if (sort === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price)
    }
    return result
  }, [items, category, searchQuery, sort])

  const handleClearFilters = () => {
    dispatch(setSearchQuery(''))
    dispatch(setCategory('all'))
    dispatch(setSort('featured'))
  }

  return (
    <PageWrapper>
      <div className="container">
        <div className="page-head">
          <h1 className="page-title">Shop products</h1>
          <p className="page-subtitle">
            Browse the catalog — data from the Fake Store API.
          </p>
        </div>

        <div className="shop-toolbar">
          <CategoryFilter />
          <div className="toolbar-right">
            <span className="results-count" aria-live="polite">
              {status === 'succeeded' &&
                `${visibleProducts.length} product${visibleProducts.length === 1 ? '' : 's'}`}
            </span>
            <label htmlFor="sort-select" className="visually-hidden">
              Sort products
            </label>
            <select
              id="sort-select"
              className="select-input"
              value={sort}
              onChange={(event) => dispatch(setSort(event.target.value))}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {status === 'loading' && (
          <>
            <p className="loading-note" role="status">
              <Loader2 size={16} className="spin-icon" /> Loading products...
            </p>
            <ProductGridSkeleton count={8} />
          </>
        )}

        {status === 'failed' && (
          <ErrorState
            title="Couldn't load products"
            message={error}
            onRetry={() => dispatch(fetchProducts())}
          />
        )}

        {status === 'succeeded' && visibleProducts.length === 0 && (
          <EmptyState
            icon={<SearchX size={28} />}
            title="No products found"
            message={
              searchQuery
                ? `Nothing matches "${searchQuery}". Try a different search or category.`
                : 'No products match the selected filters.'
            }
            onClear={handleClearFilters}
          />
        )}

        {status === 'succeeded' && visibleProducts.length > 0 && (
          <motion.div
            className="product-grid"
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.04 } },
            }}
          >
            {visibleProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageWrapper>
  )
}
