export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-dot" />
          ORBIT
        </div>
        <p className="footer-tagline">Tech that fits your orbit. Built as a full-stack demo project.</p>
        <p className="footer-year">© {new Date().getFullYear()} Orbit Store</p>
      </div>
    </footer>
  );
}
