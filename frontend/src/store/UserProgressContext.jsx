import { createContext, useState } from "react";

export const PROGRESS_STEPS = {
  CART: "cart",
  CHECKOUT: "checkout",
  LOGIN: "login",
  REGISTER: "register",
  ORDERS: "orders"
};

const UserProgressContext = createContext({
  progress: "",
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
  hideCheckout: () => {},
  showLogin: () => {},
  hideLogin: () => {},
  showRegister: () => {},
  hideRegister: () => {},
  showOrders: () => {},
  hideOrders: () => {}
});

export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState("");

  const setProgress = (step) => setUserProgress(step);
  const clearProgress = () => setUserProgress("");

  const ctx = {
    progress: userProgress,
    showCart: () => setProgress(PROGRESS_STEPS.CART),
    hideCart: clearProgress,
    showCheckout: () => setProgress(PROGRESS_STEPS.CHECKOUT),
    hideCheckout: clearProgress,
    showLogin: () => setProgress(PROGRESS_STEPS.LOGIN),
    hideLogin: clearProgress,
    showRegister: () => setProgress(PROGRESS_STEPS.REGISTER),
    hideRegister: clearProgress,
    showOrders: () => setProgress(PROGRESS_STEPS.ORDERS),
    hideOrders: clearProgress
  };

  return (
    <UserProgressContext.Provider value={ctx}>
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;
