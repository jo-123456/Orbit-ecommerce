import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';

const STATUS_LABEL = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    api
      .get('/orders/my')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">My orders</h1>
      {location.state?.justOrdered && (
        <p className="status-text status-success">Order placed! Track its status below.</p>
      )}

      {loading && <p className="status-text">Loading orders…</p>}
      {!loading && orders.length === 0 && (
        <p className="status-text">You haven't placed any orders yet.</p>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-card-header">
              <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
              <span className={`status-badge status-${order.status}`}>{STATUS_LABEL[order.status]}</span>
            </div>
            <div className="order-items">
              {order.items.map((item, idx) => (
                <img key={idx} src={item.image} alt={item.name} title={item.name} />
              ))}
            </div>
            <div className="order-card-footer">
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <span className="price-tag">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
