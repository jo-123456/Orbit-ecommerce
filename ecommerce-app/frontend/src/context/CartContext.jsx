import { createContext, useContext, useEffect, useState, useRef } from 'react';
import Toast from '../components/Toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('orbit_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    localStorage.setItem('orbit_cart', JSON.stringify(items));
  }, [items]);

  const showToast = (product) => {
    setToast(null); // reset so animation restarts if clicked rapidly
    requestAnimationFrame(() => {
      setToast({ name: product.name, image: product.image, key: Date.now() });
    });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          stock: product.stock,
          quantity,
        },
      ];
    });
    showToast(product);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalAmount }}
    >
      {children}
      <Toast toast={toast} />
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);