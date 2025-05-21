import React from 'react';
import { AuthContextProvider } from '../store/AuthContext';
import { UserProgressContextProvider } from '../store/UserProgressContext';
import { CartContextProvider } from '../store/CartContext';

export function TestProviders({ children }) {
  return (
    <AuthContextProvider>
      <UserProgressContextProvider>
        <CartContextProvider>
          {children}
        </CartContextProvider>
      </UserProgressContextProvider>
    </AuthContextProvider>
  );
}
