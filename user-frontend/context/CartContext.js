import { createContext, useContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const getId = (item) => item?._id || item?.id;

  const addToCart = (item) => {
    const itemId = getId(item);
    if (!itemId) return;

    setCart((prev) => {
      const existing = prev.find((i) => getId(i) === itemId);

      if (existing) {
        return prev.map((i) =>
          getId(i) === itemId ? { ...i, quantity: (i.quantity || 0) + 1 } : i,
        );
      }

      return [...prev, { ...item, _id: itemId, quantity: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        getId(item) === id
          ? { ...item, quantity: (item.quantity || 0) + 1 }
          : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          getId(item) === id
            ? { ...item, quantity: (item.quantity || 0) - 1 }
            : item,
        )
        .filter((item) => (item.quantity || 0) > 0),
    );
  };

  // ✅ ONLY ADDITION (UNCHANGED EVERYTHING ELSE)
  const clearCart = () => setCart([]);

  const getTotal = () =>
    cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0,
    );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        getTotal,
        clearCart, // already exposed
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
