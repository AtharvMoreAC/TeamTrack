import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Manage Your Projects Smarter with TeamTrack</h1>

        <p>
          Track tasks, manage deadlines, monitor team contributions,
          and collaborate efficiently — all in one place.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>

          <Link to="/login" className="btn-secondary">
            Login
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose TeamTrack?</h2>

        <div className="feature-cards">
          <div className="feature-card">
            <h3>📋 Task Management</h3>
            <p>Create, assign, and track tasks easily.</p>
          </div>

          <div className="feature-card">
            <h3>📅 Deadline Tracking</h3>
            <p>Stay on schedule with project deadlines.</p>
          </div>

          <div className="feature-card">
            <h3>👥 Team Collaboration</h3>
            <p>Work together and monitor contributions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
