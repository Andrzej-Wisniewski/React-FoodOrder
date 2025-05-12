import { useContext, useEffect, useState } from "react";
import AuthContext from "../store/AuthContext";
import Button from "./UI/Button";

export default function Orders({ onClose }) {
  const authCtx = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/api/orders", {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Nie udało się pobrać zamówień.");
        }

        const data = await response.json();
        setOrders(data.data);
      } catch (err) {
        setError(err.message || "Błąd pobierania zamówień.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [authCtx.token]);

  return (
    <div className="orders">
      <h2>Twoje zamówienia</h2>
      <Button textOnly onClick={onClose}>
        Zamknij
      </Button>

      {isLoading && <p>Ładowanie zamówień...</p>}
      {error && <p className="error">{error}</p>}

      {!isLoading && orders.length === 0 && <p>Brak zamówień.</p>}

      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <h3>
              Zamówienie z {new Date(order.createdAt).toLocaleDateString()}
            </h3>
            <p>
              Status: <strong>{order.status}</strong>
            </p>
            <p>Kwota: {order.totalPrice} PLN</p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.quantity}x {item.name} ({item.price} PLN)
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
