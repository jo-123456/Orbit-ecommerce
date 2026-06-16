import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/orders')])
      .then(([productsRes, ordersRes]) => {
        const revenue = ordersRes.data.reduce((sum, o) => sum + o.totalAmount, 0);
        setStats({ products: productsRes.data.length, orders: ordersRes.data.length, revenue });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Admin dashboard</h1>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Products</span>
          <span className="stat-value">{stats.products}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Orders</span>
          <span className="stat-value">{stats.orders}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Revenue</span>
          <span className="stat-value">₹{stats.revenue.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="admin-links">
        <Link to="/admin/products" className="admin-link-card">
          <h3>Manage products →</h3>
          <p>Add, edit, or remove catalog items and stock levels.</p>
        </Link>
        <Link to="/admin/orders" className="admin-link-card">
          <h3>Manage orders →</h3>
          <p>Review incoming orders and update fulfillment status.</p>
        </Link>
      </div>
    </div>
  );
}
