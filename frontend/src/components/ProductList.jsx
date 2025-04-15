function ProductList({ products }) {
  const backendUrl = "http://localhost:5000";
  return (
    <div className="product-list">
      {products.map((p) => (
        <div key={p.id} className="product-card">
          {p.image && (
            <img
              src={p.image.startsWith('http') ? p.image : `${backendUrl}${p.image}`}
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
