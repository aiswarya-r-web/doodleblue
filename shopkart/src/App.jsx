import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { CheckCircle2, CircleAlert, Info } from 'lucide-react'
import Footer from './components/Footer'
import Header from './components/Header'
import RequireAuth from './components/RequireAuth'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import OrdersPage from './pages/OrdersPage'
import ProductDetails from './pages/ProductDetails'
import SignupPage from './pages/SignupPage'
import StatusPage from './pages/StatusPage'
import WishlistPage from './pages/WishlistPage'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <CartPage />
            </RequireAuth>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <CheckoutPage />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <Toaster
        position="bottom-center"
        gap={10}
        closeButton
        icons={{
          success: <CheckCircle2 size={19} />,
          error: <CircleAlert size={19} />,
          info: <Info size={19} />,
          warning: <CircleAlert size={19} />,
        }}
        toastOptions={{
          classNames: {
            toast: 'sk-toast',
            success: 'sk-toast-success',
            error: 'sk-toast-error',
            info: 'sk-toast-info',
            warning: 'sk-toast-warning',
            title: 'sk-toast-title',
            description: 'sk-toast-desc',
            icon: 'sk-toast-icon',
            closeButton: 'sk-toast-close',
          },
        }}
      />
    </>
  )
}
