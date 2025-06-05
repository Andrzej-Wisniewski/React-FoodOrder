import { useContext } from "react";

import Modal from "./UI/Modal"; 
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import UserProgressContext, { PROGRESS_STEPS } from "../store/UserProgressContext";
import CartItem from "./UI/CartItem";

export default function Cart() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price, 0
  );

  function handleCloseCart() {
    userProgressCtx.hideCart(); 
  }

  function handleGoToCheckout() {
    userProgressCtx.showCheckout(); 
  }

  return (
    <Modal 
      className="cart" 
      open={userProgressCtx.progress === PROGRESS_STEPS.CART} 
      onClose={userProgressCtx.progress === PROGRESS_STEPS.CART ? handleCloseCart : null}
    >
      <h2>Koszyk</h2>
      <ul>
        {cartCtx.items.map(item => (
          <CartItem 
            key={item._id} 
            name={item.name} 
            quantity={item.quantity} 
            price={item.price}
            onIncrease={() => cartCtx.addItem(item)}
            onDecrease={() => cartCtx.removeItem(item.id)}
          /> 
        ))}
      </ul>
      <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
      <p className="modal-actions">
        <Button textOnly onClick={handleCloseCart}>Zamknij</Button>
        {cartCtx.items.length > 0 && (
          <Button onClick={handleGoToCheckout}>Przejdź do kasy</Button>
        )}
      </p>
    </Modal>
  );
}
