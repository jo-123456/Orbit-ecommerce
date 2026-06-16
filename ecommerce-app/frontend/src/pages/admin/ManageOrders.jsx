import { useEffect, useState } from 'react';
import api from '../../api/axios';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/orders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
  };

  return (
    <div className="page">
      <h1 className="page-title">Manage orders</h1>

      {loading ? (
        <p className="status-text">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="status-text">No orders have been placed yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name || 'Unknown'}<br /><span className="text-muted">{o.user?.email}</span></td>
                  <td>{o.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                  <td>₹{o.totalAmount.toLocaleString('en-IN')}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
