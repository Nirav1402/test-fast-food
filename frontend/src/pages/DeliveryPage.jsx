import React from 'react';

function DeliveryPage({ orders, onNavigate }) {
  return (
    <section>
      <h2>Delivery dashboard</h2>
      <div className="card">
        <p>Track assigned deliveries and update progress from the React delivery view.</p>
        <button className="btn" onClick={() => onNavigate('home')}>Back home</button>
      </div>
      <div className="grid" style={{ marginTop: 20 }}>
        {orders.length === 0 ? (
          <div className="card">No deliveries assigned.</div>
        ) : (
          orders.map((order) => (
            <div className="product-card" key={order.id}>
              <h3>Delivery #{order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Total: ₹{order.total}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default DeliveryPage;
