import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Audio', 'Wearables', 'Smart Home', 'Computing', 'Accessories'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;

    api
      .get('/products', { params })
      .then(({ data }) => {
        if (active) setProducts(data);
      })
      .catch(() => {
        if (active) setError('Could not load products. Is the backend server running?');
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [search, category]);

  const heading = useMemo(() => {
    if (search) return `Results for "${search}"`;
    if (category !== 'All') return category;
    return 'Featured catalog';
  }, [search, category]);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-text">
          <span className="eyebrow">Full-stack demo store</span>
          <h1>
            Gear for the orbit
            <br />
            you're building.
          </h1>
          <p>
            Browse audio, wearables, smart home, and computing gear. Add to cart, check out,
            and track your orders — all backed by a real API and database.
          </p>
        </div>
        <div className="hero-graphic" aria-hidden="true">
          <div className="orbit-ring orbit-ring-1" />
          <div className="orbit-ring orbit-ring-2" />
          <div className="orbit-ring orbit-ring-3" />
          <div className="orbit-core" />
        </div>
      </section>

      <section className="category-bar">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`chip ${category === c ? 'chip-active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </section>

      <section className="catalog">
        <h2>{heading}</h2>

        {loading && <p className="status-text">Loading products…</p>}
        {error && <p className="status-text status-error">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="status-text">No products match that search yet.</p>
        )}

        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
