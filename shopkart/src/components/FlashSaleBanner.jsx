import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import { FLASH_SALE } from '../constants'
import { getFlashSaleEndsAt } from '../utils/flashSale'

function useCountdown() {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, getFlashSaleEndsAt() - Date.now()),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(Math.max(0, getFlashSaleEndsAt() - Date.now()))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const seconds = Math.floor(remaining / 1000)
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  }
}

function TimeBox({ value, label }) {
  return (
    <div className="flash-timebox">
      <span className="flash-timevalue">
        {String(value).padStart(2, '0')}
      </span>
      <span className="flash-timelabel">{label}</span>
    </div>
  )
}

export default function FlashSaleBanner() {
  const { hours, minutes, seconds } = useCountdown()

  return (
    <section className="flash-banner" aria-label="Flash sale">
      <div className="flash-info">
        <span className="flash-tag">
          <Zap size={14} fill="currentColor" /> Flash Sale
        </span>
        <h2 className="flash-title">
          Up to {FLASH_SALE.discountPercent}% off top electronics
        </h2>
        <p className="flash-sub">
          Demo deals — prices drop until midnight.
        </p>
      </div>

      <div
        className="flash-countdown"
        role="timer"
        aria-label={`Sale ends in ${hours} hours ${minutes} minutes ${seconds} seconds`}
      >
        <TimeBox value={hours} label="Hrs" />
        <span className="flash-colon" aria-hidden="true">
          :
        </span>
        <TimeBox value={minutes} label="Min" />
        <span className="flash-colon" aria-hidden="true">
          :
        </span>
        <TimeBox value={seconds} label="Sec" />
      </div>

      <a href="#flash-sale" className="btn btn-primary btn-lg flash-cta">
        Shop Now
      </a>
    </section>
  )
}
