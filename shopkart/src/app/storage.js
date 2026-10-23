// redux-persist storage adapter backed by window.localStorage.
// redux-persist's bundled `lib/storage` resolves inconsistently under
// Vite's CJS interop, so we provide the same { getItem, setItem,
// removeItem } contract directly — plus a noop fallback for environments
// where localStorage is unavailable or throws (private mode, quota).

const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
}

function isLocalStorageUsable() {
  try {
    const probe = '__shopkart_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

const storage =
  typeof window !== 'undefined' && isLocalStorageUsable()
    ? {
        getItem: (key) =>
          Promise.resolve(window.localStorage.getItem(key)),
        setItem: (key, value) => {
          try {
            window.localStorage.setItem(key, value)
          } catch {
            // Quota or privacy errors: fail silently rather than crashing.
          }
          return Promise.resolve()
        },
        removeItem: (key) => {
          window.localStorage.removeItem(key)
          return Promise.resolve()
        },
      }
    : noopStorage

export default storage
