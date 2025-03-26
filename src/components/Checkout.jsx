import { useId } from 'react';
import { useContext } from 'react';
import { useActionState } from 'react';
import CartContext from '../store/CartContext';
import Modal from './UI/Modal';
import { currencyFormatter } from '../util/formatting';
import Input from './UI/Input';
import Button from './UI/Button';
import UserProgressContext from '../store/UserProgressContext';
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
      'postal-code': formData.get('postal-code'),
      city: formData.get('city')
    };

  }

  const [formState, formAction, isSending] = useActionState(checkoutAction, null);

  return (
    <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <form action={formAction} id={formId}>
        <h2>Zamówienie</h2>
        <p>Całkowita kwota: {currencyFormatter.format(cartTotal)}</p>
        
        <Input
          label="Imię i Nazwisko"
          type="text"
          id={`${formId}-name`}
          name="name"
          autoComplete="name"
          required
        />
        <Input
          label="E-Mail"
          type="email"
          id={`${formId}-email`}
          name="email"
          autoComplete="email"
          required
        />
        <Input
          label="Ulica"
          type="text"
          id={`${formId}-street`}
          name="street"
          autoComplete="street-address"
          required
        />
        <div className="control-row">
          <Input
            label="Kod Pocztowy"
            type="text"
            id={`${formId}-postal-code`}
            name="postal-code"
            autoComplete="postal-code"
            required
          />
          <Input
            label="Miasto"
            type="text"
            id={`${formId}-city`}
            name="city"
            autoComplete="address-level2"
            required
          />
        </div>
        <p className="modal-actions">
          <Button textOnly type="button" onClick={handleClose}>
            Zamknij
          </Button>
          <Button type="submit" disabled={isSending}>
            {isSending ? 'Wysyłanie...' : 'Złóż zamówienie'}
          </Button>
        </p>
      </form>
    </Modal>
  );
}