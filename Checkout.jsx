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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const authCtx = useContext(AuthContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const cartTotal = cartCtx.items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );

  function switchTo(stepFn) {
    userProgressCtx.hideCheckout();
    setTimeout(() => {
      stepFn();
    }, 100);
  }

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  if (userProgressCtx.progress !== PROGRESS_STEPS.CHECKOUT) {
    return null;
  }

  return (
    <>
      {authCtx.token ? (
        <Modal open onClose={handleClose}>
          <h2>Złóż zamówienie</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              items={cartCtx.items}
              authToken={authCtx.token}
              total={cartTotal}
              onSuccess={() => {
                cartCtx.clearCart();
                userProgressCtx.hideCheckout();
                setTimeout(() => {
                  setShowSuccessModal(true);
                }, 100);
              }}
            />
          </Elements>
        </Modal>
      ) : (
        <Modal open onClose={handleClose}>
          <h2>Nie jesteś zalogowany</h2>
          <p>Aby złożyć zamówienie, musisz się zalogować lub zarejestrować.</p>
          <div className="modal-actions" style={{ justifyContent: "flex-end" }}>
            <Button onClick={() => switchTo(userProgressCtx.showLogin)}>
              Zaloguj się
            </Button>
            <Button onClick={() => switchTo(userProgressCtx.showRegister)}>
              Zarejestruj się
            </Button>
            <Button onClick={handleClose}>Zamknij</Button>
          </div>
        </Modal>
      )}

      {showSuccessModal && (
        <Modal
          open
          onClose={() => {
            setShowSuccessModal(false);
            userProgressCtx.showOrders();
          }}
        >
          <h2>Zamówienie przyjęte!</h2>
          <p>Dziękujemy za złożenie zamówienia.</p>
          <div className="modal-actions">
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                userProgressCtx.showOrders();
              }}
            >
              Przejdź do zamówień
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

function CheckoutForm({ items, authToken, total, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const formId = useId();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

      if (!clientSecret || typeof clientSecret !== "string") {
        throw new Error("Nie otrzymano poprawnego clientSecret z serwera.");
      }

      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customer.name,
              email: customer.email,
            },
          },
        });

      if (stripeError) throw stripeError;

      if (paymentIntent.status === "succeeded") {
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
          throw new Error(data.message || "Błąd zapisu zamówienia.");
        }

        console.log("Zamówienie złożone – uruchamiam onSuccess()");
        onSuccess();
      }
    } catch (err) {
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

      <div className="control">
        <label htmlFor="card">Dane karty</label>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "0.5rem",
            backgroundColor: "white",
          }}
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#000",
                  "::placeholder": { color: "#999" },
                  fontFamily: "inherit",
                },
                invalid: {
                  color: "#e5424d",
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      </div>

      {error && <Error title="Błąd płatności" message={error} />}

      <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
        Kwota do zapłaty: {currencyFormatter.format(total)}
      </p>

      <div className="modal-actions">
        <Button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? "Przetwarzanie…" : "Zapłać i złóż zamówienie"}
        </Button>
      </div>
    </form>
  );
}
