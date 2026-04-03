import { Link } from 'react-router-dom'

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer-inner">
        <div className="public-footer-brand">
          <h3>
            <span>Split</span>Track
          </h3>
          <p>
            A calmer way to track spending, manage budgets, and split money with people.
          </p>
        </div>

        <div className="public-footer-links">
          <div>
            <h4>Product</h4>
            <Link to="/finance">Finance</Link>
            <Link to="/groups">Groups</Link>
            <Link to="/pricing">Pricing</Link>
          </div>

          <div>
            <h4>Company</h4>
            <Link to="/story">Story</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div>
            <h4>Access</h4>
            <Link to="/login">Login</Link>
            <span>Playful</span>
            <span>Premium</span>
          </div>
        </div>
      </div>
    </footer>
  )
}