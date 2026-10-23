import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Heart,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import { selectTotalItems } from '../features/cart/cartSelectors'
import ApiStatus from './ApiStatus'
import { selectWishlistCount } from '../features/wishlist/wishlistSlice'
import {
  logout,
  selectAuthUser,
  selectIsAuthenticated,
} from '../features/auth/authSlice'
import { setSearchQuery } from '../features/products/productsSlice'

function SearchBar({ className }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const query = useSelector((state) => state.products.searchQuery)

  const handleChange = (event) => {
    dispatch(setSearchQuery(event.target.value))
    if (location.pathname !== '/') navigate('/')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (location.pathname !== '/') navigate('/')
  }

  return (
    <form
      className={`header-search ${className ?? ''}`}
      role="search"
      onSubmit={handleSubmit}
    >
      <label htmlFor="site-search" className="visually-hidden">
        Search products
      </label>
      <input
        id={className ? `site-search-${className}` : 'site-search'}
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={handleChange}
        autoComplete="off"
      />
      <button type="submit" className="search-btn" aria-label="Search">
        <Search size={18} />
      </button>
    </form>
  )
}

function CartBadge({ count }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {count > 0 && (
        <motion.span
          key={count}
          className="nav-badge"
          initial={{ scale: 0.4 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function AccountMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const dispatch = useDispatch()
  const user = useSelector(selectAuthUser)

  useEffect(() => {
    if (!open) return undefined
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div className="account-menu" ref={ref}>
      <button
        type="button"
        className="nav-link nav-link-icon"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        style={{ border: 'none', background: 'transparent' }}
      >
        <User size={20} />
        <span className="nav-text">{user?.name?.split(' ')[0] ?? 'Account'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="account-popover"
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <div className="popover-head">
              <div className="popover-name">{user?.name}</div>
              <div className="popover-email">{user?.email}</div>
            </div>
            <Link to="/orders" onClick={() => setOpen(false)}>
              <Package size={16} /> Orders
            </Link>
            <Link to="/wishlist" onClick={() => setOpen(false)}>
              <Heart size={16} /> Wishlist
            </Link>
            <button
              type="button"
              onClick={() => {
                dispatch(logout())
                setOpen(false)
              }}
            >
              <LogOut size={16} /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const totalItems = useSelector(selectTotalItems)
  const wishlistCount = useSelector(selectWishlistCount)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const location = useLocation()
  const [prevPath, setPrevPath] = useState(location.pathname)

  // Close the mobile menu when the route changes (adjust-during-render).
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="ShopKart home">
          Shop<span className="brand-accent">Kart</span>
          <span className="brand-dot">.</span>
        </Link>

        <SearchBar className="header-search-desktop" />

        <nav className="header-nav" aria-label="Primary">
          <ApiStatus />
          <Link to="/" className="nav-link nav-link-products">
            <Package size={19} />
            <span className="nav-text">Products</span>
          </Link>

          <Link to="/wishlist" className="nav-link nav-link-icon">
            <Heart size={20} />
            <span className="nav-text">Wishlist</span>
            <CartBadge count={wishlistCount} />
          </Link>

          <Link to="/cart" className="nav-link nav-link-icon" aria-label="Cart">
            <ShoppingCart size={20} />
            <span className="nav-text">Cart</span>
            <CartBadge count={totalItems} />
          </Link>

          {isAuthenticated ? (
            <AccountMenu />
          ) : (
            <Link to="/login" className="nav-link">
              <User size={19} />
              <span className="nav-text">Sign in</span>
            </Link>
          )}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      <div className="container header-search-mobile">
        <SearchBar />
      </div>

      <div className="container">
        <nav
          className={`mobile-nav ${menuOpen ? 'open' : ''}`}
          aria-label="Mobile"
          onClick={(event) => {
            if (event.target.closest('a')) setMenuOpen(false)
          }}
        >
          <Link to="/" className="nav-link">
            <Package size={18} /> Products
          </Link>
          <Link to="/orders" className="nav-link">
            <ShoppingCart size={18} /> Orders
          </Link>
          {isAuthenticated ? (
            <button
              type="button"
              className="nav-link"
              style={{
                border: 'none',
                background: 'transparent',
                width: '100%',
                textAlign: 'left',
              }}
              onClick={() => dispatch(logout())}
            >
              <LogOut size={18} /> Sign out
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              <User size={18} /> Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
