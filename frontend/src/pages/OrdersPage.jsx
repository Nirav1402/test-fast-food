import React from 'react';

function OrdersPage({ orders }) {
  return (
    <section>
      <h2>Order history</h2>
      <div className="grid">
        {orders.length === 0 ? (
          <div className="card">No orders yet.</div>
        ) : (
          orders.map((order) => (
            <div className="product-card" key={order.id}>
              <h3>Order #{order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Total: ₹{order.total}</p>
              <p>Address: {order.delivery_address || 'N/A'}</p>
              {order.delivery_verification_code && (
                <p>Delivery key: <strong style={{display:'inline-block', background:'#ff4d4d', color:'#fff', padding:'4px 14px', borderRadius:'6px', letterSpacing:'4px', fontFamily:'monospace', fontSize:'1.1em'}}>{order.delivery_verification_code}</strong></p>
              )}
              <ul>
                {order.items.map((item, index) => <li key={index}>{item.name} × {item.quantity}</li>)}
              </ul>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default OrdersPage;
