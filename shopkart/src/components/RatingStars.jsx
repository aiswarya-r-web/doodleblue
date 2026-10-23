import { Star, StarHalf } from 'lucide-react'

export default function RatingStars({ rate = 0, size = 14 }) {
  const rounded = Math.round(rate * 2) / 2
  return (
    <span
      className="stars"
      role="img"
      aria-label={`Rated ${rate} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((position) => {
        const filled = rounded >= position
        const half = !filled && rounded >= position - 0.5
        return half ? (
          <StarHalf
            key={position}
            size={size}
            fill="currentColor"
            strokeWidth={0}
          />
        ) : (
          <Star
            key={position}
            size={size}
            fill={filled ? 'currentColor' : 'none'}
            color={filled ? 'currentColor' : '#d0d4de'}
          />
        )
      })}
    </span>
  )
}
