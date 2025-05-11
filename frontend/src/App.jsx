import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Header from "./components/Header";
import Meals from "./components/Meals";
import Login from "./components/Login";
import Register from "./components/Register";
import Orders from "./components/Orders";

import { CartContextProvider } from "./store/CartContext";
import { UserProgressContextProvider } from "./store/UserProgressContext";
import { AuthContextProvider } from "./store/AuthContext";
import { useContext } from "react";
import UserProgressContext, { PROGRESS_STEPS } from "./store/UserProgressContext";

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
      {userProgressCtx.progress === PROGRESS_STEPS.ORDERS && (
        <Orders onClose={userProgressCtx.hideOrders} />
      )}
    </>
  );
}

function App() {
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

export default App;
