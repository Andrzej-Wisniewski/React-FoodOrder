import { useEffect, useState } from "react";

export default function AllReviews() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error("Błąd podczas pobierania recenzji.");
        setReviews(data.data || []);
      })
      .catch((err) =>
        setError(err.message || "Błąd połączenia z serwerem.")
      );
  }, []);

  if (error) {
    return <p className="error">Nie udało się załadować recenzji: {error}</p>;
  }

  if (!reviews.length) return null;

  return (
    <section className="review-list">
      <h2 style={{ gridColumn: "1/-1", textAlign: "center", color: "#ffc404" }}>
        Opinie użytkowników
      </h2>
      {reviews.map((r, i) => (
        <li key={i} className="card review-item">
          <article style={{ padding: "1rem", textAlign: "left" }}>
            <p><strong>{r.userName}</strong> ocenił <em>danie</em> na <div style={{ color: "#ffc404", fontSize: "1.1rem" }}>
              {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
            </div></p>
            <p className="review-quote">„{r.comment}”</p>

            <p style={{ fontSize: "0.85rem", color: "#aaa", marginTop: "0.5rem" }}>
              Zamówienie: {" "}
              {r.mealNames?.map((name, idx) => (
                <span key={idx} style={{ color: "#ffc404" }}>
                  {name}
                  {idx < r.mealNames.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <p style={{ color: "#999", fontSize: "0.8rem" }}>
              {new Date(r.createdAt).toLocaleDateString("pl-PL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              o godz: {new Date(r.createdAt).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
            </p>

          </article>
        </li>
      ))}
    </section >
  );
}
