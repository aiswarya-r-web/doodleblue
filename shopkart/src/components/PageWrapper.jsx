import { motion, useReducedMotion } from 'framer-motion'

export default function PageWrapper({ children, className = 'page' }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.main
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  )
}
