import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from '../redux/cartSlice';
import './ShoppingCart.css';

function ShoppingCart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  // Sample product for practising the cart
  const product = {
    id: 1,
    name: 'Wireless Headphones',
    price: 50,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="shopping-cart">
      <h1 className="cart-title">Shopping Cart</h1>

      <button
        className="add-product-button"
        onClick={() => dispatch(addToCart(product))}
      >
        Add Wireless Headphones
      </button>

      <section className="cart-card">
        {items.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-product-image">
                    <img
                      src={item.image || product.image}
                      alt={item.name}
                    />
                  </div>

                  <div className="cart-product-details">
                    <h2>{item.name}</h2>
                    <p>${item.price} each</p>
                  </div>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() =>
                        dispatch(decreaseQuantity(item.id))
                      }
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() =>
                        dispatch(increaseQuantity(item.id))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-divider" />

            <div className="cart-subtotal">
              <h2>Subtotal</h2>
              <p>${subtotal.toLocaleString('en-US')}</p>
            </div>

            <p className="cart-description">
              Our target behaviour: one product entry, with a quantity
              that increases.
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default ShoppingCart;