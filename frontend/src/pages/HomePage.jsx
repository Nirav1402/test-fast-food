import React from 'react';

function HomePage({ onNavigate }) {
  return (
    <section className="hero">
      <div className="hero-card">
        <span className="badge">New React Experience</span>
        <h1>Fast, fresh, and beautifully delivered</h1>
        <p>Browse products, manage addresses, and place orders through a modern React-powered experience connected to your Django backend.</p>
        <div className="row">
          <button className="btn" onClick={() => onNavigate('menu')}>Explore Menu</button>
          <button className="btn" style={{ background: '#111827' }} onClick={() => onNavigate('addresses')}>Manage Addresses</button>
        </div>
      </div>
      <div className="card">
        <h3>What changed</h3>
        <ul>
          <li>React/Vite frontend shell added</li>
          <li>Django APIs for products and addresses</li>
          <li>Single-page navigation without full reload</li>
        </ul>
      </div>
    </section>
  );
}

export default HomePage;
