import React, { useContext } from 'react';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Header from './components/Header';
import Meals from './components/Meals';
import Login from './components/Login';
import Register from './components/Register';
import Orders from './components/Orders';

import { CartContextProvider } from './store/CartContext';
import { UserProgressContextProvider, default as UserProgressContext } from './store/UserProgressContext';
import { AuthContextProvider } from './store/AuthContext';

function AppContent() {
  const userProgressCtx = useContext(UserProgressContext);

  return (
    <>
      <Header />
      <Meals />
      <Cart />
      <Checkout />
      <Login />
      <Register />
      {userProgressCtx.progress === 'orders' && <Orders />}
    </>
  );
}

export default function App() {
  return (
    <AuthContextProvider>
      <UserProgressContextProvider>
        <CartContextProvider>
          <AppContent />
        </CartContextProvider>
      </UserProgressContextProvider>
    </AuthContextProvider>
  );
}
