import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page">
      <div className="empty-state">
        <h2>Lost in orbit</h2>
        <p>We couldn't find the page you were looking for.</p>
        <Link to="/" className="btn btn-accent">Back to home</Link>
      </div>
    </div>
  );
}
