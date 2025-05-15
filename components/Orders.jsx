import { useContext, useEffect, useState } from 'react';
import AuthContext from '../store/AuthContext';
import UserProgressContext, { PROGRESS_STEPS } from '../store/UserProgressContext';
import Button from './UI/Button';
import Error from './UI/Error';
import { currencyFormatter } from '../util/formatting';

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
        const res = await fetch('/api/orders', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authCtx.token}`
          }
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Nie udało się pobrać zamówień');
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

  if (!authCtx.isLoggedIn) {
    return null;
  }

  return (
    <dialog open className="orders-modal" onClose={handleClose}>
      <h2>Twoje zamówienia</h2>
      <Button textOnly onClick={handleClose}>Zamknij</Button>

      {isLoading && <p>Ładowanie zamówień...</p>}
      {error && <Error title="Błąd" message={error} />}
      {!isLoading && !error && orders.length === 0 && <p>Brak zamówień.</p>}

      {!isLoading && !error && orders.length > 0 && (
        <ul className="orders-list">
          {orders.map(order => (
            <li key={order._id} className="order-item">
              <h3>Zamówienie z {new Date(order.createdAt).toLocaleString()}</h3>
              <p>Status: <strong>{order.status}</strong></p>
              <p>Kwota: {currencyFormatter.format(order.totalPrice)}</p>
              <ul>
                {order.items.map((it, idx) => (
                  <li key={idx}>
                    {it.quantity}× {it.name} ({currencyFormatter.format(it.price)})
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
