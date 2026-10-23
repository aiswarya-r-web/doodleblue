export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton sk-media" />
      <div className="sk-body">
        <div className="skeleton" style={{ height: 12, width: '40%' }} />
        <div className="skeleton" style={{ height: 15, width: '92%' }} />
        <div className="skeleton" style={{ height: 15, width: '65%' }} />
        <div className="skeleton" style={{ height: 20, width: '35%' }} />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function ProductDetailsSkeleton() {
  return (
    <div className="pdp-grid" aria-hidden="true">
      <div>
        <div
          className="skeleton"
          style={{ aspectRatio: '1/1', borderRadius: 15 }}
        />
        <div className="pdp-thumbs">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="skeleton"
              style={{ aspectRatio: '1/1', borderRadius: 12 }}
            />
          ))}
        </div>
      </div>
      <div
        className="pdp-info"
        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
      >
        <div className="skeleton" style={{ height: 14, width: '30%' }} />
        <div className="skeleton" style={{ height: 26, width: '85%' }} />
        <div className="skeleton" style={{ height: 14, width: '45%' }} />
        <div className="skeleton" style={{ height: 34, width: '30%' }} />
        <div className="skeleton" style={{ height: 90, width: '100%' }} />
        <div className="skeleton" style={{ height: 52, width: '60%' }} />
      </div>
    </div>
  )
}
