import React, { useEffect, useState } from 'react';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

function DeliveryPage({ onNavigate }) {
  const [deliveries, setDeliveries] = useState([]);
  const [codeInputs, setCodeInputs] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDeliveries = () => {
    setLoading(true);
    fetch('/api/deliveries/', { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => setDeliveries(data?.deliveries || []))
      .catch(() => setDeliveries([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const postAction = async (url, body) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': getCookie('csrftoken'),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: body || '',
      credentials: 'same-origin',
    });

    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    return { ok: response.ok, data };
  };

  const acceptDelivery = async (deliveryId) => {
    const { ok, data } = await postAction(`/accept-delivery/${deliveryId}/`);
    setMessage(data.message || (ok ? 'Delivery accepted.' : 'Unable to accept delivery.'));
    if (ok) loadDeliveries();
  };

  const markDelivered = async (deliveryId) => {
    const code = (codeInputs[deliveryId] || '').trim();
    if (!code) {
      setMessage("Please enter the customer's verification key.");
      return;
    }

    const { ok, data } = await postAction(
      `/mark-delivered/${deliveryId}/`,
      `delivery_code=${encodeURIComponent(code)}`
    );
    setMessage(data.message || (ok ? 'Order marked as delivered.' : 'Unable to mark as delivered.'));
    if (ok) {
      setCodeInputs((current) => ({ ...current, [deliveryId]: '' }));
      loadDeliveries();
    }
  };

  return (
    <section>
      <h2>Delivery dashboard</h2>
      <div className="card">
        <p>Track assigned deliveries and update progress from the React delivery view.</p>
        <button className="btn" onClick={() => onNavigate('home')}>Back home</button>
      </div>

      {message && <div className="card" style={{ marginTop: 12 }}>{message}</div>}

      <div className="grid" style={{ marginTop: 20 }}>
        {loading ? (
          <div className="card">Loading deliveries...</div>
        ) : deliveries.length === 0 ? (
          <div className="card">No deliveries assigned.</div>
        ) : (
          deliveries.map((delivery) => (
            <div className="product-card" key={delivery.id}>
              <h3>Order #{delivery.order_id}</h3>
              <p>Status: {delivery.status_display}</p>
              <p>Total: ₹{delivery.total}</p>
              <p>Customer: {delivery.customer}</p>
              <p>Address: {delivery.address ? `${delivery.address}, ${delivery.city}` : 'N/A'}</p>
              <p>Phone: {delivery.phone || 'N/A'}</p>

              {delivery.status === 'assigned' && (
                <button className="btn" onClick={() => acceptDelivery(delivery.id)}>
                  Accept Delivery
                </button>
              )}

              {(delivery.status === 'picked_up' || delivery.status === 'in_transit') && (
                <div style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    placeholder="Enter customer key"
                    maxLength={6}
                    value={codeInputs[delivery.id] || ''}
                    onChange={(event) =>
                      setCodeInputs((current) => ({ ...current, [delivery.id]: event.target.value }))
                    }
                    style={{ marginRight: 8 }}
                  />
                  <button className="btn" onClick={() => markDelivered(delivery.id)}>
                    Mark as Delivered
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default DeliveryPage;
