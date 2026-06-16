import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: form,
      };
      await api.post('/orders', payload);
      clearCart();
      navigate('/orders', { state: { justOrdered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place your order. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder}>
          <h2>Shipping details</h2>
          <label>
            Full name
            <input required value={form.fullName} onChange={update('fullName')} />
          </label>
          <label>
            Phone number
            <input required value={form.phone} onChange={update('phone')} />
          </label>
          <label>
            Address
            <input required value={form.addressLine} onChange={update('addressLine')} />
          </label>
          <div className="form-row">
            <label>
              City
              <input required value={form.city} onChange={update('city')} />
            </label>
            <label>
              State
              <input required value={form.state} onChange={update('state')} />
            </label>
            <label>
              Pincode
              <input required value={form.pincode} onChange={update('pincode')} />
            </label>
          </div>

          {error && <p className="status-text status-error">{error}</p>}

          <button className="btn btn-accent btn-block" disabled={busy}>
            {busy ? 'Placing order…' : `Place order · ₹${totalAmount.toLocaleString('en-IN')}`}
          </button>
        </form>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          {items.map((item) => (
            <div className="summary-row" key={item.productId}>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
