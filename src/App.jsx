import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Header from "./components/Header";
import Meals from "./components/Meals";
import Login from "./components/Login";
import Register from "./components/Register";

import { CartContextProvider } from "./store/CartContext";
import { UserProgressContextProvider } from "./store/UserProgressContext";
import { AuthContextProvider } from "./store/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <UserProgressContextProvider>
        <CartContextProvider>
          <Header />
          <Meals />
          <Cart />
          <Checkout />
          <Login />
          <Register />
        </CartContextProvider>
      </UserProgressContextProvider>
    </AuthContextProvider>
  );
}

export default App;
