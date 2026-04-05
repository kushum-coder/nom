import { createContext, useContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(null);

  const addToCart = (item) => {
    const itemId = item.id || item._id;

    setCart((prev) => {
      const existing = prev.find((i) => (i.id || i._id) === itemId);

      if (existing) {
        return prev.map((i) =>
          (i.id || i._id) === itemId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        (item.id || item._id) === id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          (item.id || item._id) === id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const saveToken = (jwt) => setToken(jwt);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        getTotal,
        token,
        saveToken,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
