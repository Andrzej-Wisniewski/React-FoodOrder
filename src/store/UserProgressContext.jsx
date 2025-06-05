import { createContext, useState } from "react";

export const PROGRESS_STEPS = {
  CART: "cart",
  CHECKOUT: "checkout",
  LOGIN: "login",
  REGISTER: "register",
  ORDERS: "orders",
  MENU: "menu",
};

const UserProgressContext = createContext({
  progress: null,
  showCart: () => {},
  showCheckout: () => {},
  showOrders: () => {},
  hideCart: () => {},
  hideCheckout: () => {},
  hideOrders: () => {},
  showMenu: () => {},
  hideMenu: () => {},
  showLogin: () => {},
  showRegister: () => {},
  showSuccessModal: false,
  triggerSuccessModal: () => {},
  hideSuccessModal: () => {},
});

export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const ctxValue = {
    progress: userProgress,
    showCart: () => setUserProgress(PROGRESS_STEPS.CART),
    showCheckout: () => setUserProgress(PROGRESS_STEPS.CHECKOUT),
    showOrders: () => setUserProgress(PROGRESS_STEPS.ORDERS),
    showMenu: () => setUserProgress(PROGRESS_STEPS.MENU),
    showLogin: () => setUserProgress(PROGRESS_STEPS.LOGIN),
    showRegister: () => setUserProgress(PROGRESS_STEPS.REGISTER),
    hideCart: () => setUserProgress(null),
    hideCheckout: () => setUserProgress(null),
    hideOrders: () => setUserProgress(null),
    hideMenu: () => setUserProgress(null),
    hideLogin: () => setUserProgress(null),
    hideRegister: () => setUserProgress(null),
    showSuccessModal,
    triggerSuccessModal: () => setShowSuccessModal(true),
    hideSuccessModal: () => setShowSuccessModal(false),
  };

  return (
    <UserProgressContext.Provider value={ctxValue}>
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;
