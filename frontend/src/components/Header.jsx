import { useContext } from "react";
import Button from "./UI/Button";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import AuthContext from "../store/AuthContext";

export default function Header() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const authCtx = useContext(AuthContext);

  const totalCartItems = cartCtx.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  function handleShowCart() {
    userProgressCtx.showCart();
  }

  function handleShowLogin() {
    userProgressCtx.showLogin();
  }

  function handleShowRegister() {
    userProgressCtx.showRegister();
  }

  function handleLogout() {
    authCtx.logout();
  }

  function handleShowOrders() {
    userProgressCtx.showOrders();
  }

  return (
    <header id="main-header">
      <div id="title">
        <h1>FOOD</h1>
      </div>
      <nav>
        {!authCtx.isLoggedIn && (
          <>
            <Button textOnly onClick={handleShowLogin}>
              Zaloguj
            </Button>
            <Button textOnly onClick={handleShowRegister}>
              Rejestracja
            </Button>
          </>
        )}

        {authCtx.isLoggedIn && (
          <>
            <Button textOnly onClick={handleShowOrders}>
              Zamówienia
            </Button>
            <Button textOnly onClick={handleLogout}>
              Wyloguj
            </Button>
          </>
        )}

        <Button textOnly onClick={handleShowCart}>
          Koszyk ({totalCartItems})
        </Button>
      </nav>
    </header>
  );
}
