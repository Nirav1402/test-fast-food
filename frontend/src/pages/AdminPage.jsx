import React from 'react';

function AdminPage({ orders, onNavigate }) {
  return (
    <section>
      <h2>Admin dashboard</h2>
      <div className="card">
        <p>Monitor incoming orders and delivery status from the React dashboard.</p>
        <button className="btn" onClick={() => onNavigate('home')}>Back home</button>
      </div>
      <div className="grid" style={{ marginTop: 20 }}>
        {orders.length === 0 ? (
          <div className="card">No orders available.</div>
        ) : (
          orders.map((order) => (
            <div className="product-card" key={order.id}>
              <h3>Order #{order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Total: ₹{order.total}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default AdminPage;
