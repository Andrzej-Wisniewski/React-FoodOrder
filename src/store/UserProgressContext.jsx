import { createContext, useState } from "react";

const UserProgressContext = createContext({
  progress: "",
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
  hideCheckout: () => {},
  
  showLogin: () => {},
  hideLogin: () => {},
  showRegister: () => {},
  hideRegister: () => {}
});

export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState("");

  function showCart() {
    setUserProgress("cart");
  }
  function hideCart() {
    setUserProgress("");
  }
  function showCheckout() {
    setUserProgress("checkout");
  }
  function hideCheckout() {
    setUserProgress("");
  }

  function showLogin() {
    setUserProgress("login");
  }
  function hideLogin() {
    setUserProgress("");
  }

  function showRegister() {
    setUserProgress("register");
  }
  function hideRegister() {
    setUserProgress("");
  }

  const ctx = {
    progress: userProgress,
    showCart,
    hideCart,
    showCheckout,
    hideCheckout,
    showLogin,
    hideLogin,
    showRegister,
    hideRegister
  };

  return (
    <UserProgressContext.Provider value={ctx}>
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;
