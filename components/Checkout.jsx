import React, { useId, useContext, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import AuthContext from "../store/AuthContext";
import UserProgressContext, {
  PROGRESS_STEPS,
} from "../store/UserProgressContext";
import CartContext from "../store/CartContext";
import Modal from "./UI/Modal";
import Input from "./UI/Input";
import Button from "./UI/Button";
import Error from "./UI/Error";
import { currencyFormatter } from "../util/formatting";

console.log("Stripe key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const authCtx = useContext(AuthContext);

  const cartTotal = cartCtx.items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  if (userProgressCtx.progress !== PROGRESS_STEPS.CHECKOUT) {
    return null;
  }

  console.log("Rendering Checkout. Total:", cartTotal);

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

  const formId = useId();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  console.log("Stripe instance:", stripe);
  console.log("Elements instance:", elements);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const formData = new FormData(e.target);
    const customer = {
      name: formData.get("name"),
      email: formData.get("email"),
      street: formData.get("street"),
      postalCode: formData.get("postalCode"),
      city: formData.get("city"),
    };

    console.log("Wysyłanie danych do Stripe:", customer);

    try {
      const piRes = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ items, currency: "pln", metadata: customer }),
      });

      const { clientSecret } = await piRes.json();
      console.log("Otrzymano clientSecret:", clientSecret);

      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

      if (stripeError) throw stripeError;

      if (paymentIntent.status === "succeeded") {
        console.log("Płatność udana, zapis zamówienia…");

        const orderPayload = {
          order: {
            items: items.map((i) => ({
              id: i.id,
              name: i.name,
              quantity: i.quantity,
              price: i.price,
            })),
            customer,
          },
        };
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(orderPayload),
        });
        if (!orderRes.ok) {
          const data = await orderRes.json().catch(() => ({}));
          throw new Error(data.message || "Błąd zapisu zamówienia");
        }

        console.log("Zamówienie zapisane!");
        onSuccess();
      }
    } catch (err) {
      console.error("Błąd:", err.message);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Input label="Imię i nazwisko" type="text" name="name" required />
      <Input label="E-Mail" type="email" name="email" required />
      <Input label="Ulica" type="text" name="street" required />
      <div className="control-row">
        <Input label="Kod pocztowy" type="text" name="postalCode" required />
        <Input label="Miasto" type="text" name="city" required />
      </div>

      <CardElement options={{ hidePostalCode: true }} />

      {error && <Error title="Błąd płatności" message={error} />}

      <div className="modal-actions">
        <Button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? "Przetwarzanie…" : "Zapłać i złóż zamówienie"}
        </Button>
      </div>
    </form>
  );
}
