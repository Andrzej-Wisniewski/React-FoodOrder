import { useId } from 'react';
import { useContext } from 'react';
import { useActionState } from 'react';
import CartContext from '../store/CartContext';
import Modal from './UI/Modal';
import { currencyFormatter } from '../util/formatting';
import Input from './UI/Input';
import Button from './UI/Button';
import UserProgressContext, { PROGRESS_STEPS } from '../store/UserProgressContext';
import Error from './UI/Error';

export default function Checkout() {
  const formId = useId();
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price, 0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  async function checkoutAction(_, formData) {
    const customerData = {
      name: formData.get('name'),
      email: formData.get('email'),
      street: formData.get('street'),
      postalCode: formData.get('postalCode'),
      city: formData.get('city')
    };

    // logika zamówienia...
  }

  const [formState, formAction, isSending] = useActionState(checkoutAction, null);

  return (
    <Modal open={userProgressCtx.progress === PROGRESS_STEPS.CHECKOUT} onClose={handleClose}>
      <form action={formAction} id={formId}>
        <h2>Zamówienie</h2>
        <p>Całkowita kwota: {currencyFormatter.format(cartTotal)}</p>

        <Input label="Imię i Nazwisko" type="text" id={`${formId}-name`} name="name" required />
        <Input label="E-Mail" type="email" id={`${formId}-email`} name="email" required />
        <Input label="Ulica" type="text" id={`${formId}-street`} name="street" required />
        <div className="control-row">
          <Input label="Kod Pocztowy" type="text" id={`${formId}-postalCode`} name="postalCode" required />
          <Input label="Miasto" type="text" id={`${formId}-city`} name="city" required />
        </div>
        <p className="modal-actions">
          <Button textOnly type="button" onClick={handleClose}>Zamknij</Button>
          <Button type="submit" disabled={isSending}>{isSending ? 'Wysyłanie...' : 'Złóż zamówienie'}</Button>
        </p>
      </form>
    </Modal>
  );
}
