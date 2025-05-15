import Link from 'next/link';
import '@/styles/Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>ChowBox Vending Machine</h1>
          <p className="hero-description">
            A digital vending machine platform with secure user roles for buyers and sellers
          </p>
          <div className="hero-buttons">
            <Link href="/products" className="btn btn-primary">View Products</Link>
            <Link href="/auth/register" className="btn btn-secondary">Sign Up Now</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛒</div>
            <h3>For Buyers</h3>
            <p>Deposit coins, browse products, and make purchases with automatic change calculation</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>For Sellers</h3>
            <p>List your products, manage inventory, and track your sales through an intuitive dashboard</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Platform</h3>
            <p>Role-based access control ensures that only authorized users can perform specific actions</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join our platform today and experience the future of vending machines</p>
        <Link href="/auth/register" className="btn btn-primary">Create Account</Link>
      </section>
    </div>
  );
}