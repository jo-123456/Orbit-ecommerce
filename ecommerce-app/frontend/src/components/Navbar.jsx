import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/?search=${encodeURIComponent(query)}` : '/');
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-dot" />
          ORBIT
        </Link>

        <form className="search-form" onSubmit={submitSearch}>
          <input
            type="text"
            placeholder="Search gadgets, audio, smart home..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            ⌕
          </button>
        </form>

        <nav className="navbar-actions">
          <Link to="/cart" className="cart-link">
            <span>Cart</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-menu-trigger" onClick={() => setMenuOpen((v) => !v)}>
                {user.name.split(' ')[0]} ▾
              </button>
              {menuOpen && (
                <div className="user-menu-dropdown" onMouseLeave={() => setMenuOpen(false)}>
                  <Link to="/orders" onClick={() => setMenuOpen(false)}>My orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin dashboard</Link>
                  )}
                  <button onClick={handleLogout}>Log out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-sm btn-outline">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
