import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Mail, Send, Truck, ShieldCheck, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

const PERKS = [
  { icon: Truck, title: 'Free shipping', text: 'On orders over $100' },
  { icon: ShieldCheck, title: 'Secure demo', text: 'No real payments processed' },
  { icon: RefreshCcw, title: 'Easy returns', text: 'Frontend demo flow' },
]

function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) {
      toast.error('Enter your email to subscribe')
      return
    }
    toast.success('Subscribed to ShopKart updates')
    setEmail('')
  }

  return (
    <form className="footer-news" onSubmit={handleSubmit} noValidate>
      <label className="footer-title" htmlFor="footer-news">
        Stay in the loop
      </label>
      <div className="footer-news-row">
        <Mail size={15} className="footer-news-icon" aria-hidden="true" />
        <input
          id="footer-news"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-label="Email address for newsletter"
        />
        <button type="submit" aria-label="Subscribe">
          <Send size={15} />
        </button>
      </div>
      <p className="footer-news-hint">Deals and drops, straight to your inbox.</p>
    </form>
  )
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <button
        type="button"
        className="footer-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp size={16} /> Back to top
      </button>

      <div className="container footer-perks">
        {PERKS.map(({ icon: Icon, title, text }) => (
          <div className="footer-perk" key={title}>
            <span className="footer-perk-icon">
              <Icon size={18} />
            </span>
            <div>
              <div className="footer-perk-title">{title}</div>
              <div className="footer-perk-text">{text}</div>
            </div>
          </div>
        ))}
      </div>

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
          <div className="footer-badges">
            <span>React</span>
            <span>Redux Toolkit</span>
            <span>Vite</span>
          </div>
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
        <Newsletter />
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Shopkart</span>
        <span>React · Redux Toolkit · Fake Store API</span>
      </div>
    </footer>
  )
}
