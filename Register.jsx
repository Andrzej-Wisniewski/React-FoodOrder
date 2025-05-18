import { useContext, useState, useId } from "react";
import Modal from "./UI/Modal";
import Button from "./UI/Button";
import Input from "./UI/Input";
import UserProgressContext from "../store/UserProgressContext";
import AuthContext from "../store/AuthContext";
import Error from "./UI/Error";

export default function Register() {
  const formId = useId();
  const userProgressCtx = useContext(UserProgressContext);
  const authCtx = useContext(AuthContext);
  const [error, setError] = useState(null);

  function handleClose() {
    userProgressCtx.hideRegister();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await authCtx.register(name, email, password);
      handleClose();
    } catch (err) {
      setError({
        title: "Błąd rejestracji",
        message: err.message || "Nie udało się zarejestrować.",
      });
    }
  }

  return (
    <>
      <Modal
        open={userProgressCtx.progress === "register"}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit} id={formId}>
          <h2>Rejestracja</h2>
          <Input label="Imię" type="text" name="name" required />
          <Input label="E-Mail" type="email" name="email" required />
          <Input label="Hasło" type="password" name="password" required />
          <div className="modal-actions">
            <Button textOnly type="button" onClick={handleClose}>
              Zamknij
            </Button>
            <Button type="submit">Zarejestruj</Button>
          </div>
        </form>
      </Modal>

      {error && (
        <Modal open onClose={() => setError(null)}>
          <div className="error">
            <Error title={error.title} message={error.message} />
          </div>
          <div className="modal-actions" style={{ justifyContent: "flex-end" }}>
            <Button onClick={() => setError(null)}>Zamknij</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
