import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { AboutPage } from './components/AboutPage';
import { BlogPage } from './components/BlogPage';
import { BlogDetailPage } from './components/BlogDetailPage';
import { ContactPage } from './components/ContactPage';
import { Footer } from './components/Footer';
import { Product, User, CartItem } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('gaumeoshop_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('gaumeoshop_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('gaumeoshop_cart', JSON.stringify(cart));
  }, [cart]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('gaumeoshop_user', JSON.stringify(loggedInUser));
    if (loggedInUser.role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gaumeoshop_user');
    setCurrentPage('home');
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('gaumeoshop_cart');
  };

  const handleCheckout = (newOrderId: string) => {
    setOrderId(newOrderId);
    clearCart();
    setCurrentPage('order-success');
  };

  const viewProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const viewBlogDetail = (blogId: number) => {
    setSelectedBlogId(blogId);
    setCurrentPage('blog-detail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} addToCart={addToCart} viewProduct={viewProductDetail} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminPage onNavigate={setCurrentPage} />;
      case 'shop':
        return <ShopPage onNavigate={setCurrentPage} addToCart={addToCart} viewProduct={viewProductDetail} />;
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetailPage product={selectedProduct} onNavigate={setCurrentPage} addToCart={addToCart} />
        ) : null;
      case 'cart':
        return (
          <CartPage
            cart={cart}
            onNavigate={setCurrentPage}
            updateQuantity={updateCartQuantity}
            removeItem={removeFromCart}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            cart={cart}
            user={user}
            onNavigate={setCurrentPage}
            onCheckout={handleCheckout}
          />
        );
      case 'order-success':
        return <OrderSuccessPage orderId={orderId} onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} />;
      case 'blog':
        return <BlogPage onNavigate={setCurrentPage} viewBlog={viewBlogDetail} />;
      case 'blog-detail':
        return selectedBlogId ? (
          <BlogDetailPage blogId={selectedBlogId} onNavigate={setCurrentPage} viewBlog={viewBlogDetail} />
        ) : null;
      case 'contact':
        return <ContactPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} addToCart={addToCart} viewProduct={viewProductDetail} />;
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header
        user={user}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        currentPage={currentPage}
      />
      {renderPage()}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}