import Cart from "./Cart";
import Checkout from "./Checkout";
import Header from "./Header";
import Meals from "./Meals";
import Login from "./Login";
import Register from "./Register";
import Orders from "./Orders";

import { CartContextProvider } from "../store/CartContext";
import { UserProgressContextProvider } from "../store/UserProgressContext";
import { AuthContextProvider } from "../store/AuthContext";
import { useContext } from "react";
import UserProgressContext, { PROGRESS_STEPS } from "../store/UserProgressContext";

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
