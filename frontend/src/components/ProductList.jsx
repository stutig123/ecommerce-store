function ProductList({ products }) {
  return (
    <div className="product-list">
      {products.map((p) => (
        <div key={p.id} className="product-card">
          {p.image && (
            <img
              src={p.image}
              alt={p.name}
              style={{ width: '100px' }}
            />
          )}
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
