import { useEffect, useState } from "react";

export default function AllReviews() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/meals/${mealId}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error("Błąd podczas pobierania recenzji.");
        setReviews(data.data || []);
      })
      .catch((err) => setError(err.message || "Błąd połączenia z serwerem."));
  }, []);

  if (error) {
    return <p className="error">Nie udało się załadować recenzji: {error}</p>;
  }

  if (!reviews.length) return null;

  return (
    <section style={{ width: "90%", maxWidth: "70rem", margin: "2rem auto" }}>
      <h2 style={{ textAlign: "center", color: "#ffc404", fontFamily: "Lato, sans-serif" }}>
        Opinie użytkowników
      </h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {reviews.map((r, i) => (
          <li
            key={i}
            className="modal"
            style={{
              marginBottom: "1rem",
              backgroundColor: "#1d1a16",
              color: "#d9e2f1",
              fontSize: "1rem",
            }}
          >
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>{r.userName}</strong> ocenił <em>{r.mealName}</em> na{" "}
              <strong>{r.rating}/5</strong>
            </p>
            <p style={{ marginBottom: "0.5rem", fontStyle: "italic" }}>{r.comment}</p>
            <p style={{ fontSize: "0.8rem", color: "#999" }}>
              {new Date(r.createdAt).toLocaleDateString()}{" "}
              {new Date(r.createdAt).toLocaleTimeString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
