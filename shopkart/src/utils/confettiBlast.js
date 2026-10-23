import confetti from 'canvas-confetti'

const COLORS = ['#c2410c', '#f59e0b', '#1f6f5a', '#3b82f6', '#ec4899', '#fbe9dd']
const HEART_COLORS = ['#ec4899', '#f43f5e', '#fb7185', '#fda4af', '#fff1f2']

// Small pop from the clicked heart button (clientX/Y are viewport pixels).
export function heartBurst(clientX, clientY) {
  confetti({
    particleCount: 30,
    spread: 70,
    startVelocity: 18,
    gravity: 0.8,
    scalar: 0.7,
    ticks: 90,
    colors: HEART_COLORS,
    origin: {
      x: clientX / window.innerWidth,
      y: clientY / window.innerHeight,
    },
    disableForReducedMotion: true,
  })
}

export function celebrateOrder() {
  const fire = (particleRatio, options) =>
    confetti({
      particleCount: Math.floor(200 * particleRatio),
      colors: COLORS,
      disableForReducedMotion: true,
      ...options,
    })

  fire(0.25, { spread: 26, startVelocity: 55, origin: { y: 0.6 } })
  fire(0.2, { spread: 60, origin: { y: 0.65 } })
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.9,
    origin: { y: 0.6 },
  })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })

  // Side cannons for the "blast" feel
  const end = Date.now() + 900
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: COLORS,
      disableForReducedMotion: true,
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: COLORS,
      disableForReducedMotion: true,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}
