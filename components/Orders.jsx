import { useContext, useEffect, useState } from "react";
import AuthContext from "../store/AuthContext";
import UserProgressContext, {
  PROGRESS_STEPS,
} from "../store/UserProgressContext";
import Button from "./UI/Button";
import Error from "./UI/Error";
import { currencyFormatter } from "../util/formatting";

export default function Orders() {
  const authCtx = useContext(AuthContext);
  const userProgressCtx = useContext(UserProgressContext);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/orders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx.token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Nie udało się pobrać zamówień");
        }

        const { data } = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (authCtx.isLoggedIn) {
      fetchOrders();
    }
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
      alert(err.message);
    }
  }

  if (!authCtx.isLoggedIn) return null;

  return (
    <dialog open className="orders-modal" onClose={handleClose}>
      <h2>Twoje zamówienia</h2>
      <Button textOnly onClick={handleClose}>
        Zamknij
      </Button>

      {isLoading && <p>Ładowanie zamówień...</p>}
      {error && <Error title="Błąd" message={error} />}
      {!isLoading && !error && orders.length === 0 && <p>Brak zamówień.</p>}

      {!isLoading && !error && orders.length > 0 && (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <h3>Zamówienie z {new Date(order.createdAt).toLocaleString()}</h3>

              <p>
                Status:
                <span
                  className={`order-status ${order.status.replace(/\s/g, "-")}`}
                >
                  {order.status}
                </span>
                {authCtx.user?.role === "admin" && (
                  <select
                    className="order-status-selector"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
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
                    order.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                )}
              </p>
              <ul>
                {order.items.map((it, idx) => (
                  <li key={idx}>
                    {it.quantity}× {it.name} (
                    {currencyFormatter.format(it.price)})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </dialog>
  );
}
