import { useDispatch, useSelector } from 'react-redux'
import { CATEGORIES } from '../constants'
import { setCategory } from '../features/products/productsSlice'

export default function CategoryFilter() {
  const dispatch = useDispatch()
  const active = useSelector((state) => state.products.category)

  return (
    <div className="chip-row" role="group" aria-label="Filter by category">
      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          type="button"
          className={`chip ${active === category.value ? 'active' : ''}`}
          onClick={() => dispatch(setCategory(category.value))}
          aria-pressed={active === category.value}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
