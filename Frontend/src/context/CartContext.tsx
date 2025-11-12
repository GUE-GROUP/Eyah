import React, { createContext, useContext, useState, useEffect } from 'react';

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  capacity: number;
}

interface CartItem {
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (room: Room, checkIn: string, checkOut: string, guests: number) => void;
  removeFromCart: (roomId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('eyah-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('eyah-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (room: Room, checkIn: string, checkOut: string, guests: number) => {
    const existingItem = cart.find(item => item.room.id === room.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.room.id === room.id
          ? { ...item, checkIn, checkOut, guests }
          : item
      ));
    } else {
      setCart([...cart, { room, checkIn, checkOut, guests }]);
    }
  };

  const removeFromCart = (roomId: string) => {
    setCart(cart.filter(item => item.room.id !== roomId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const checkInDate = new Date(item.checkIn);
      const checkOutDate = new Date(item.checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      return total + (item.room.price * nights);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
