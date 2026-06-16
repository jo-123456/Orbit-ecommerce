import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setError('That product could not be found.'));
  }, [id]);

  if (error) return <div className="page"><p className="status-text status-error">{error}</p></div>;
  if (!product) return <div className="page"><p className="status-text">Loading…</p></div>;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="page">
      <div className="product-detail">
        <div className="product-detail-media">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <span className="category-pill standalone">
            <span className="pill-dot" />
            {product.category}
          </span>
          <h1>{product.name}</h1>
          <p className="rating">★ {product.rating?.toFixed(1)} rating</p>
          <p className="product-detail-desc">{product.description}</p>
          <div className="price-tag price-tag-lg">₹{product.price.toLocaleString('en-IN')}</div>

          <p className={product.stock > 0 ? 'stock-ok' : 'stock-out'}>
            {product.stock > 0 ? `${product.stock} units in stock` : 'Currently out of stock'}
          </p>

          {product.stock > 0 && (
            <div className="qty-row">
              <div className="qty-stepper">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button className="btn btn-accent" onClick={handleAdd}>
                {added ? 'Added ✓' : 'Add to cart'}
              </button>
            </div>
          )}

          <button className="btn-link" onClick={() => navigate(-1)}>
            ← Back to catalog
          </button>
        </div>
      </div>
    </div>
  );
}
