import React from 'react';

function CartPage({ cart, addresses, selectedAddress, onSelectAddress, onPlaceOrder }) {
  return (
    <section>
      <h2>Your cart</h2>
      {cart.length === 0 ? (
        <div className="card">Your cart is empty.</div>
      ) : (
        <div className="card">
          {cart.map((item) => (
            <div key={item.id} className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
              <span>{item.name} × {item.quantity}</span>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}
          <div className="form" style={{ marginTop: 16 }}>
            <label htmlFor="address-select">Delivery address</label>
            <select id="address-select" value={selectedAddress} onChange={(e) => onSelectAddress(e.target.value)}>
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>{address.street_address}, {address.city}</option>
              ))}
            </select>
            <button className="btn" onClick={onPlaceOrder}>Place Order</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default CartPage;
