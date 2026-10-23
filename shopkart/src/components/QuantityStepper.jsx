import { Minus, Plus } from 'lucide-react'

export default function QuantityStepper({
  value,
  onIncrease,
  onDecrease,
  small = false,
  min = 1,
  max = 99,
  label = 'Quantity',
}) {
  return (
    <div
      className={`stepper ${small ? 'stepper-sm' : ''}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= min - 1}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <span className="stepper-value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
