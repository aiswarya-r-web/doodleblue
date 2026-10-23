import { useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Loader2, SearchX } from 'lucide-react'
import CategoryFilter from '../components/CategoryFilter'
import { EmptyState, ErrorState } from '../components/ErrorState'
import FlashSaleBanner from '../components/FlashSaleBanner'
import FlashSaleCarousel from '../components/FlashSaleCarousel'
import PageWrapper from '../components/PageWrapper'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/LoadingSkeleton'
import { PAGE_SIZE, SORT_OPTIONS } from '../constants'
import {
  fetchProducts,
  setCategory,
  setPage,
  setSearchQuery,
  setSort,
} from '../features/products/productsSlice'
import { selectFlashSaleProducts } from '../utils/flashSale'

export default function HomePage() {
  const dispatch = useDispatch()
  const gridRef = useRef(null)
  const { items, status, error, searchQuery, category, sort, page } =
    useSelector((state) => state.products)

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

  const flashItems = useMemo(() => selectFlashSaleProducts(items), [items])

  const totalPages = Math.ceil(visibleProducts.length / PAGE_SIZE)
  const safePage = Math.min(page, totalPages || 1)
  const pageItems = visibleProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const handlePageChange = (next) => {
    dispatch(setPage(next))
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleClearFilters = () => {
    dispatch(setSearchQuery(''))
    dispatch(setCategory('all'))
    dispatch(setSort('featured'))
  }

  return (
    <PageWrapper>
      <div className="container">
        {status === 'succeeded' && flashItems.length > 0 && <FlashSaleBanner />}

        <div className="page-head">
          <h1 className="page-title">Shop products</h1>
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

        {status === 'succeeded' && flashItems.length > 0 && (
          <FlashSaleCarousel items={flashItems} />
        )}

        {status === 'succeeded' && visibleProducts.length > 0 && (
          <div ref={gridRef} style={{ scrollMarginTop: 84 }}>
            <h2 className="related-title" style={{ marginBottom: 14 }}>
              Products
            </h2>
            <motion.div
              className="product-grid"
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {pageItems.map((product) => (
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
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
