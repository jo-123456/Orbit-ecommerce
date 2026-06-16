import { useEffect, useState } from 'react';
import api from '../../api/axios';

const EMPTY_FORM = { name: '', description: '', price: '', category: 'Audio', image: '', stock: '' };
const CATEGORIES = ['Audio', 'Wearables', 'Smart Home', 'Computing', 'Accessories'];

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/products')
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const startAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the product.');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="page">
      <div className="page-header-row">
        <h1 className="page-title">Manage products</h1>
        <button className="btn btn-accent" onClick={startAdd}>
          + Add product
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={submit}>
          <h2>{editingId ? 'Edit product' : 'New product'}</h2>
          <div className="form-row">
            <label>
              Name
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              Category
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Description
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <div className="form-row">
            <label>
              Price (₹)
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                required
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </label>
          </div>
          <label>
            Image URL
            <input
              required
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
            />
          </label>

          {error && <p className="status-text status-error">{error}</p>}

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button className="btn btn-accent">{editingId ? 'Save changes' : 'Add product'}</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="status-text">Loading…</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><img className="admin-thumb" src={p.image} alt={p.name} /></td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price.toLocaleString('en-IN')}</td>
                  <td className={p.stock === 0 ? 'stock-out' : ''}>{p.stock}</td>
                  <td className="admin-table-actions">
                    <button className="btn-link" onClick={() => startEdit(p)}>Edit</button>
                    <button className="btn-link danger" onClick={() => remove(p._id)}>Delete</button>
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
