import React from 'react';

function MenuPage({ products, onAddToCart }) {
  return (
    <section>
      <h2>Menu</h2>
      <div className="grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <h3>{product.name}</h3>
            <p className="muted">{product.category}</p>
            <p>{product.description}</p>
            <strong>₹{product.price}</strong>
            <div style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => onAddToCart(product)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MenuPage;
