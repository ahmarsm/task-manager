import { useState, useEffect } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem('authToken'))
  );

  // Username: emilys
  // Password: emilyspass

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  const [newProductTitle, setNewProductTitle] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);

  const [editingProductId, setEditingProductId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  // NEW: fetch products whenever isLoggedIn becomes true
  useEffect(() => {
    if (!isLoggedIn) return; // don't fetch if not logged in

    async function fetchProducts() {
      setProductsLoading(true);
      setProductsError(null);
      try {
        const res = await fetch('https://dummyjson.com/products?limit=10');
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        setProducts(data.products); // DummyJSON wraps the list inside a "products" key
      } catch (err) {
        setProductsError(err.message);
      } finally {
        setProductsLoading(false);
      }
    }

    fetchProducts();
  }, [isLoggedIn]); // re-run this effect whenever isLoggedIn changes


  // Add a new product 
  async function handleAddProduct(e) {
    e.preventDefault();
    if (!newProductTitle.trim()) return;

    setAddingProduct(true);
    try {
      const res = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProductTitle,
          price: Number(newProductPrice) // convert text input to a number
        })
      });

      if (!res.ok) throw new Error('Failed to add product');

      const newProduct = await res.json();
      setProducts(prevProducts => [newProduct, ...prevProducts]); // add to top of list
      setNewProductTitle('');
      setNewProductPrice('');
    } catch (err) {
      setProductsError(err.message);
    } finally {
      setAddingProduct(false);
    }
  }

  // Delete a Product
  async function handleDeleteProduct(productId) {
    try {
      const res = await fetch(`https://dummyjson.com/products/${productId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete product');

      setProducts(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      );
    } catch (err) {
      setProductsError(err.message);
    }
  }


  // Edit a Product
  async function handleUpdateProduct(productId) {
    try {
      const res = await fetch(`https://dummyjson.com/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editedTitle })
      });
      if (!res.ok) throw new Error('Failed to update product');

      const updatedProduct = await res.json();
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId ? { ...product, title: updatedProduct.title } : product
        )
      );
      setEditingProductId(null); // exit edit mode
    } catch (err) {
      setProductsError(err.message);
    }
  }


  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) throw new Error('Invalid username or password');

      const data = await res.json();
      localStorage.setItem('authToken', data.accessToken);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  }

  return (
    <div>
      <h1>Task Manager</h1>

      {isLoggedIn ? (
        <div>
          <p>You are logged in! ✅</p>
          <button onClick={handleLogout}>Logout</button>

          <br />
          <br />

          <h2>Products</h2>
          {productsLoading && <p>Loading products...</p>}
          {productsError && <p style={{ color: 'red' }}>{productsError}</p>}
          <ul>
            {products.map(product => (
              <li key={product.id}>
                {editingProductId === product.id ? (
                  <>
                    <input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <button onClick={() => handleUpdateProduct(product.id)}>Save</button>
                    <button type="button" onClick={() => setEditingProductId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {product.title} — ${product.price}
                    <button onClick={() => {
                      setEditingProductId(product.id);
                      setEditedTitle(product.title);
                    }}>Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>

          <h3>Add New Product</h3>
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Product title"
              value={newProductTitle}
              onChange={(e) => setNewProductTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
            />
            <button type="submit" disabled={addingProduct}>
              {addingProduct ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}
    </div>
  );
}

export default App;