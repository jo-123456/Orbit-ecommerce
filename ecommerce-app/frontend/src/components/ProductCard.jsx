import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-media">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="category-pill">
          <span className="pill-dot" />
          {product.category}
        </span>
      </Link>
      <div className="product-card-body">
        <Link to={`/product/${product._id}`} className="product-card-name">
          {product.name}
        </Link>
        <div className="product-card-meta">
          <span className="rating">★ {product.rating?.toFixed(1)}</span>
          <span className={product.stock > 0 ? 'stock-ok' : 'stock-out'}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        <div className="product-card-footer">
          <span className="price-tag">₹{product.price.toLocaleString('en-IN')}</span>
          <button
            className="btn btn-sm btn-accent"
            disabled={product.stock === 0}
            onClick={() => addToCart(product, 1)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
