
import { useContext, useEffect, useState } from "react";
import AuthContext from "../store/AuthContext";
import UserProgressContext from "../store/UserProgressContext";
import Button from "./UI/Button";
import Error from "./UI/Error";
import Modal from "./UI/Modal";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";

function translateStatus(status) {
  switch (status) {
    case "pending": return "Oczekujące";
    case "in progress": return "W trakcie";
    case "completed": return "Zrealizowane";
    case "cancelled": return "Anulowane";
    default: return status;
  }
}

export default function Orders() {
  const authCtx = useContext(AuthContext);
  const userProgressCtx = useContext(UserProgressContext);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/orders/${reviewingOrderId}/review`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx.token}`,
          },
        });

        const { data } = await res.json();
        if (!res.ok) throw new Error(data?.message || "Nie udało się pobrać zamówień");
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (authCtx.isLoggedIn) fetchOrders();
  }, [authCtx.token, authCtx.isLoggedIn]);

  function handleClose() {
    userProgressCtx.hideOrders();
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Nie udało się zaktualizować statusu.");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setErrorModal({
        title: "Błąd aktualizacji",
        message: err.message,
      });
    }
  }

  async function submitReview() {
    if (!reviewingItem) return;

    console.log("reviewingItem", reviewingItem);

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/meals/${reviewingItem.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.token}`,
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewText,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Nie udało się dodać recenzji");
      }

      setReviewingItem(null);
      setReviewText("");
      setReviewRating(5);
    } catch (err) {
      setErrorModal({
        title: "Błąd recenzji",
        message: err.message,
      });
    } finally {
      setIsSubmittingReview(false);
    }
  }


  if (!authCtx.isLoggedIn) return null;

  return (
    <>
      <Modal open onClose={handleClose} className="orders-modal">
        <h2>Twoje zamówienia</h2>

        {isLoading && <p>Ładowanie zamówień...</p>}
        {error && <Error title="Błąd" message={error} />}
        {!isLoading && !error && orders.length === 0 && <p>Brak zamówień.</p>}

        {!isLoading && !error && orders.length > 0 && (
          <ul className="orders-list">
            {orders.map((order) => (
              <li key={order._id} className="order-item">
                <h3>Zamówienie z {new Date(order.createdAt).toLocaleString()}</h3>

                <p>
                  Status:{" "}
                  <span className={`order-status ${order.status.replace(/\s/g, "-")}`}>
                    {translateStatus(order.status)}
                  </span>
                  {authCtx.user?.role === "admin" && (
                    <select
                      className="order-status-selector"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="pending">Oczekujące</option>
                      <option value="in progress">W trakcie</option>
                      <option value="completed">Zrealizowane</option>
                      <option value="cancelled">Anulowane</option>
                    </select>
                  )}
                </p>

                <p>
                  Kwota:{" "}
                  {currencyFormatter.format(
                    order.totalPrice ||
                    order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
                  )}
                </p>

                <ul>
                  {order.items.map((it, idx) => {
                    const mealId = typeof it.mealId === 'object' && it.mealId.$oid
                      ? it.mealId.$oid
                      : String(it.mealId);
                    return (
                      <li key={idx}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <span>
                            {it.quantity}× {it.name} ({currencyFormatter.format(it.price)})
                          </span>
                          {order.status === "completed" && (
                            <Button
                              onClick={() => {
                                console.log("Setting reviewingItem with:", { mealId, name: it.name, raw: it });
                                setReviewingItem({ id: mealId, name: it.name });
                              }}
                            >
                              Dodaj recenzję
                            </Button>

                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}

        <div className="modal-actions" style={{ justifyContent: "flex-end" }}>
          <Button onClick={handleClose}>Zamknij</Button>
        </div>
      </Modal>

      {errorModal && (
        <Modal open className="error-modal">
          <Error title={errorModal.title} message={errorModal.message} />
          <div className="modal-actions" style={{ justifyContent: "flex-end" }}>
            <Button onClick={() => setErrorModal(null)}>Zamknij</Button>
          </div>
        </Modal>
      )}

      {reviewingItem && (
        <Modal open className="review-modal" onClose={() => setReviewingItem(null)}>
          <h2>Recenzja: {reviewingItem.name}</h2>
          <div className="control">
            <label>Ocena (1–5):</label>
            <select
              className="rating-select"
              style={{ fontSize: "1.1rem", padding: "0.4rem", width: "5rem" }}
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="control">
            <label>Komentarz:</label>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div className="modal-actions">
            <Button onClick={submitReview} disabled={isSubmittingReview}>
              {isSubmittingReview ? "Wysyłanie…" : "Wyślij"}
            </Button>
            <Button onClick={() => setReviewingItem(null)}>Anuluj</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
