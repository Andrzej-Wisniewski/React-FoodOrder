import React, { Suspense, useContext } from "react";
import Cart from "./components/Cart";
import Header from "./components/Header";
import Meals from "./components/Meals";
import Login from "./components/Login";
import Register from "./components/Register";
import Modal from "./components/UI/Modal";
import Button from "./components/UI/Button";
import AllReviews from "./components/AllReviews.jsx";

import { CartContextProvider } from "./store/CartContext";
import {
  UserProgressContextProvider,
  default as UserProgressContext,
  PROGRESS_STEPS,
} from "./store/UserProgressContext";
import AuthContext, { AuthContextProvider } from "./store/AuthContext";

const Checkout = React.lazy(() => import("./components/Checkout.jsx"));
const Orders = React.lazy(() => import("./components/Orders.jsx"));
const Menu = React.lazy(() => import("./components/Menu.jsx"));

function SuccessModal() {
  const userProgressCtx = useContext(UserProgressContext);

  if (!userProgressCtx.showSuccessModal) return null;

  return (
    <Modal
      open
      onClose={() => {
        userProgressCtx.hideSuccessModal();
        userProgressCtx.showOrders();
      }}
    >
      <h2>Zamówienie przyjęte!</h2>
      <p>Dziękujemy za złożenie zamówienia.</p>
      <div className="modal-actions">
        <Button
          onClick={() => {
            userProgressCtx.hideSuccessModal();
            userProgressCtx.showOrders();
          }}
        >
          Przejdź do zamówień
        </Button>
      </div>
    </Modal>
  );
}

function AppContent() {
  const userProgressCtx = useContext(UserProgressContext);
  const authCtx = useContext(AuthContext);

  return (
    <>
      <Header />
      <Meals />
      <AllReviews />
      <Cart />
      <Suspense
        fallback={
          <p style={{ textAlign: "center", padding: "2rem" }}>
            Ładowanie płatności...
          </p>
        }
      >
        <Checkout />
      </Suspense>
      <Login />
      <Register />
      <Suspense fallback={<p className="center">Ładowanie…</p>}>
        {userProgressCtx.progress === PROGRESS_STEPS.ORDERS && <Orders />}
        {userProgressCtx.progress === PROGRESS_STEPS.MENU &&
          authCtx.user?.role === "admin" && <Menu />}
      </Suspense>
      <SuccessModal />
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
