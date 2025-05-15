import React, { useId, useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import AuthContext from '../store/AuthContext';
import UserProgressContext, { PROGRESS_STEPS } from '../store/UserProgressContext';
import CartContext from '../store/CartContext';
import Modal from './UI/Modal';
import Button from './UI/Button';
import Error from './UI/Error';
import { currencyFormatter } from '../util/formatting';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const authCtx = useContext(AuthContext);

  const cartTotal = cartCtx.items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  if (userProgressCtx.progress !== PROGRESS_STEPS.CHECKOUT) {
    return null;
  }

  return (
    <Modal open onClose={handleClose}>
      <h2>Złóż zamówienie</h2>
      <p>Kwota do zapłaty: {currencyFormatter.format(cartTotal)}</p>
      <Elements stripe={stripePromise}>
        <CheckoutForm
          items={cartCtx.items}
          authToken={authCtx.token}
          onSuccess={() => {
            cartCtx.clearCart();
            userProgressCtx.hideCheckout();
          }}
        />
      </Elements>
    </Modal>
  );
}

function CheckoutForm({ items, authToken, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const piRes = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ items })
      });
      const { clientSecret } = await piRes.json();

      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardElement } }
      );
      if (stripeError) throw stripeError;

      if (paymentIntent.status === 'succeeded') {
        const orderPayload = {
          order: {
            items: items.map(i => ({
              id: i.id,
              name: i.name,
              quantity: i.quantity,
              price: i.price
            })),
            customer: {}
          }
        };
        await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify(orderPayload)
        });

        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ hidePostalCode: true }} />
      {error && <Error title="Błąd płatności" message={error} />}
      <div className="modal-actions">
        <Button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? 'Przetwarzanie…' : 'Zapłać teraz'}
        </Button>
      </div>
    </form>
  );
}