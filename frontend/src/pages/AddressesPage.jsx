import React from 'react';

function AddressesPage({ addresses }) {
  return (
    <section>
      <h2>Your delivery addresses</h2>
      <div className="grid">
        {addresses.length === 0 ? (
          <div className="card">No addresses found. Add one through the Django flow to see it here.</div>
        ) : (
          addresses.map((address) => (
            <div className="product-card" key={address.id}>
              <h3>{address.street_address}</h3>
              <p>{address.city}, {address.postal_code}</p>
              <p>{address.phone}</p>
              {address.is_default && <span className="badge">Default</span>}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default AddressesPage;
