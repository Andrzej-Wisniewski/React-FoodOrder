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
    <section id="meals">
      <h2 style={{ gridColumn: "1/-1", textAlign: "center", color: "#ffc404" }}>
        Opinie użytkowników
      </h2>
      {reviews.map((r, i) => (
        <li key={i} className="meal-item">
          <article style={{ padding: "1rem", textAlign: "left" }}>
            <p><strong>{r.userName}</strong> ocenił <em>danie</em> na <strong>{r.rating}/5</strong></p>
            <p style={{ fontStyle: "italic", margin: "0.5rem 0" }}>{r.comment}</p>
            <p style={{ fontSize: "0.8rem", color: "#999" }}>
              {new Date(r.createdAt).toLocaleDateString()}{" "}
              {new Date(r.createdAt).toLocaleTimeString()}
            </p>
          </article>
        </li>
      ))}
    </section >
  );
}
