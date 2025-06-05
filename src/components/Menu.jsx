import { useContext, useEffect, useState } from "react";
import Modal from "./UI/Modal";
import Button from "./UI/Button";
import Input from "./UI/Input";
import AuthContext from "../store/AuthContext";
import UserProgressContext, {
  PROGRESS_STEPS,
} from "../store/UserProgressContext";

const CATEGORIES = ["Przystawka", "Zupa", "Danie główne", "Deser", "Napoje"];

export default function Menu() {
  const authCtx = useContext(AuthContext);
  const userProgressCtx = useContext(UserProgressContext);

  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    category: "",
  });
  const [editingMeal, setEditingMeal] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAdmin = authCtx?.user?.role === "admin";

  useEffect(() => {
    if (authCtx.token && isAdmin) {
      fetchMeals();
    }
  }, [authCtx.token, authCtx.user]);

  async function fetchMeals() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/meals", {
        headers: { Authorization: `Bearer ${authCtx.token}` },
      });

      if (!res.ok) throw new Error(`Błąd serwera: ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Odpowiedź nie zawiera tablicy.");

      data.sort((a, b) => {
        const indexA = CATEGORIES.indexOf(a.category);
        const indexB = CATEGORIES.indexOf(b.category);
        return indexA - indexB;
      });

      setMeals(data);
    } catch (err) {
      setError("Błąd pobierania posiłków: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddMeal() {
    const { name, price, description, image, category } = newMeal;
    if (!name || !price || !description || !image || !category) {
      setError("Uzupełnij wszystkie pola.");
      return;
    }
    if (!CATEGORIES.includes(category)) {
      setError("Nieprawidłowa kategoria.");
      return;
    }

    try {
      const res = await fetch("/api/admin/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.token}`,
        },
        body: JSON.stringify({
          name,
          price,
          description,
          image: "placeholder.jpg",
          category,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      const result = await res.json();
      const mealId = result.id;

      const formData = new FormData();
      formData.append("image", image);

      const imgRes = await fetch(`/api/admin/meals/${mealId}/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authCtx.token}` },
        body: formData,
      });

      if (!imgRes.ok) {
        const errData = await imgRes.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${imgRes.status}`);
      }

      setNewMeal({
        name: "",
        price: "",
        description: "",
        image: null,
        category: "",
      });
      fetchMeals();
    } catch (err) {
      setError("Nie udało się dodać posiłku: " + err.message);
    }
  }

  async function handleDeleteMeal(id) {
    try {
      const res = await fetch(`/api/admin/meals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authCtx.token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      fetchMeals();
    } catch (err) {
      setError("Nie udało się usunąć posiłku: " + err.message);
    }
  }

  async function handleSaveEdit() {
    const { name, price, description, category } = editingMeal;
    if (!name || !price || !description || !category) {
      setError("Uzupełnij wszystkie pola.");
      return;
    }
    if (!CATEGORIES.includes(category)) {
      setError("Nieprawidłowa kategoria.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/meals/${editingMeal._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.token}`,
        },
        body: JSON.stringify(editingMeal),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      if (selectedImageFile) {
        const imageForm = new FormData();
        imageForm.append("image", selectedImageFile);

        const imgRes = await fetch(`/api/admin/meals/${editingMeal._id}/image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${authCtx.token}` },
          body: imageForm,
        });

        if (!imgRes.ok) {
          const err = await imgRes.json().catch(() => ({}));
          throw new Error(err.message || `HTTP ${imgRes.status}`);
        }
      }

      setEditingMeal(null);
      setSelectedImageFile(null);
      fetchMeals();
    } catch (err) {
      setError("Nie udało się zaktualizować dania: " + err.message);
    }
  }

  function handleClose() {
    userProgressCtx.hideMenu();
  }

  if (!authCtx.token || !authCtx.user || authCtx.user.role !== "admin") {
    return null;
  }

  return (
    <Modal
      open={userProgressCtx.progress === PROGRESS_STEPS.MENU}
      onClose={handleClose}
      className="menu-modal"
    >
      <h2>Zarządzaj menu</h2>
      {isLoading && <p>Ładowanie posiłków...</p>}
      {error && <p className="error">{error}</p>}

      <ul style={{ padding: 0, listStyle: "none" }}>
        {meals.map((meal) => (
          <li key={meal._id} style={{ marginBottom: "1rem" }}>
            {editingMeal?._id === meal._id ? (
              <>
                {meal.image && (
                  <img
                    src={`/images/${meal.image}`}
                    alt=""
                    style={{ width: "120px", borderRadius: "6px" }}
                  />
                )}
                <Input
                  label="Nazwa"
                  value={editingMeal.name}
                  onChange={(e) =>
                    setEditingMeal({ ...editingMeal, name: e.target.value })
                  }
                />
                <Input
                  label="Cena"
                  type="number"
                  value={editingMeal.price}
                  onChange={(e) =>
                    setEditingMeal({ ...editingMeal, price: e.target.value })
                  }
                />
                <textarea
                  className="control"
                  rows="3"
                  style={{
                    width: "100%",
                    maxWidth: "30rem",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    font: "inherit",
                    resize: "vertical",
                  }}
                  placeholder="Opis"
                  value={editingMeal.description}
                  onChange={(e) =>
                    setEditingMeal({
                      ...editingMeal,
                      description: e.target.value,
                    })
                  }
                />
                <select
                  value={editingMeal.category}
                  onChange={(e) =>
                    setEditingMeal({ ...editingMeal, category: e.target.value })
                  }
                >
                  <option value="">-- wybierz kategorię --</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImageFile(e.target.files[0])}
                />
                <div className="modal-actions">
                  <Button onClick={handleSaveEdit}>Zapisz zmiany</Button>
                  <Button onClick={() => setEditingMeal(null)}>Anuluj</Button>
                </div>
              </>
            ) : (
              <>
                <strong>
                  {meal.name} — {Number(meal.price).toFixed(2)} zł ({meal.category})
                </strong>
                <div className="modal-actions" style={{ marginTop: "0.5rem" }}>
                  <Button onClick={() => setEditingMeal(meal)}>Edytuj</Button>
                  <Button onClick={() => handleDeleteMeal(meal._id)}>Usuń</Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Dodaj nowy posiłek</h2>
      <div className="control">
        <Input
          label="Nazwa"
          value={newMeal.name}
          onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
        />
        <Input
          label="Cena"
          type="number"
          value={newMeal.price}
          onChange={(e) => setNewMeal({ ...newMeal, price: e.target.value })}
        />
        <textarea
          className="control"
          rows="3"
          placeholder="Opis"
          value={newMeal.description}
          onChange={(e) =>
            setNewMeal({ ...newMeal, description: e.target.value })
          }
        />
        <select
          value={newMeal.category}
          onChange={(e) => setNewMeal({ ...newMeal, category: e.target.value })}
        >
          <option value="">-- wybierz kategorię --</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewMeal({ ...newMeal, image: e.target.files[0] })}
        />
      </div>

      <div className="modal-actions">
        <Button onClick={handleAddMeal}>Dodaj</Button>
        <Button onClick={handleClose}>Zamknij</Button>
      </div>
    </Modal>
  );
}
