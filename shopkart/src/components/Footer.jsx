import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Link to="/" className="brand" style={{ fontSize: 20 }}>
            Shop<span className="brand-accent">Kart</span>
            <span className="brand-dot">.</span>
          </Link>
          <p style={{ marginTop: 12, fontSize: 13.5, maxWidth: 300 }}>
            A demo storefront built with React and Redux Toolkit. Product data
            is provided by the Fake Store API.
          </p>
        </div>
        <div>
          <div className="footer-title">Shop</div>
          <ul className="footer-list">
            <li>
              <Link to="/">All products</Link>
            </li>
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            <li>
              <Link to="/status">API status</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="footer-title">Account</div>
          <ul className="footer-list">
            <li>
              <Link to="/login">Sign in</Link>
            </li>
            <li>
              <Link to="/signup">Create account</Link>
            </li>
            <li>
              <Link to="/forgot-password">Forgot password</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Shopkart</span>
        <span>Demo coupons, badges and checkout — no real payments.</span>
      </div>
    </footer>
  )
}
