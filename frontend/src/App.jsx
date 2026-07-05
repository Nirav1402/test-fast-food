import React, { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import AddressesPage from './pages/AddressesPage';
import OrdersPage from './pages/OrdersPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import DeliveryPage from './pages/DeliveryPage';

const API_BASE = '/api';

function App() {
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeView, setActiveView] = useState('home');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [message, setMessage] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '', email: '' });

  useEffect(() => {
    fetch(`${API_BASE}/products/`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/delivery-addresses/`, { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        setAddresses(data?.addresses || []);
        if (data?.addresses?.length) {
          setSelectedAddress(String(data.addresses[0].id));
        }
      })
      .catch(() => setAddresses([]));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/orders/`, { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => setOrders(data?.orders || []))
      .catch(() => setOrders([]));
  }, []);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setMessage(`${product.name} added to cart.`);
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    const endpoint = authMode === 'login' ? '/login/' : '/register/';
    const body = new URLSearchParams();
    body.append('username', authForm.username);
    body.append('password', authForm.password);
    if (authMode === 'register') body.append('email', authForm.email);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: body.toString(),
      credentials: 'same-origin'
    });

    if (response.ok) {
      setMessage(authMode === 'login' ? 'Logged in successfully.' : 'Account created successfully.');
      setActiveView('home');
    } else {
      setMessage('Authentication failed.');
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      setMessage('Please choose a delivery address.');
      return;
    }

    const response = await fetch('/place-order/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: `delivery_address=${selectedAddress}`,
      credentials: 'same-origin'
    });

    if (response.ok) {
      setMessage('Order placed successfully.');
      setCart([]);
    } else {
      setMessage('Unable to place order.');
    }
  };

  return (
    <div className="app-shell">
      <nav className="navbar">
        <strong>Fast Food</strong>
        <div className="nav-links">
          <a href="#" onClick={() => setActiveView('home')}>Home</a>
          <a href="#" onClick={() => setActiveView('menu')}>Menu</a>
          <a href="#" onClick={() => setActiveView('cart')}>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</a>
          <a href="#" onClick={() => setActiveView('addresses')}>Addresses</a>
          <a href="#" onClick={() => setActiveView('orders')}>Orders</a>
          <a href="#" onClick={() => setActiveView('admin')}>Admin</a>
          <a href="#" onClick={() => setActiveView('delivery')}>Delivery</a>
          <a href="#" onClick={() => setActiveView('auth')}>Sign In</a>
        </div>
      </nav>

      {activeView === 'home' && <HomePage onNavigate={setActiveView} />}

      {activeView === 'menu' && <MenuPage products={products} onAddToCart={addToCart} />}

      {activeView === 'cart' && (
        <CartPage
          cart={cart}
          addresses={addresses}
          selectedAddress={selectedAddress}
          onSelectAddress={setSelectedAddress}
          onPlaceOrder={placeOrder}
        />
      )}

      {activeView === 'addresses' && <AddressesPage addresses={addresses} />}

      {activeView === 'orders' && <OrdersPage orders={orders} />}

      {activeView === 'auth' && (
        <AuthPage
          authMode={authMode}
          authForm={authForm}
          onChange={(field, value) => setAuthForm({ ...authForm, [field]: value })}
          onSubmit={handleAuth}
          onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        />
      )}

      {activeView === 'admin' && <AdminPage orders={orders} onNavigate={setActiveView} />}
      {activeView === 'delivery' && <DeliveryPage orders={orders} onNavigate={setActiveView} />}

      {message && <div className="card" style={{ marginTop: 16 }}>{message}</div>}
    </div>
  );
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

export default App;
