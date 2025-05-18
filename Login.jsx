import { useId, useContext, useState } from "react";
import { useActionState } from "react";
import UserProgressContext, { PROGRESS_STEPS } from "../store/UserProgressContext";
import AuthContext from "../store/AuthContext";
import Modal from "./UI/Modal";
import Button from "./UI/Button";
import Input from "./UI/Input";
import Error from "./UI/Error";

export default function Login() {
  const formId = useId();
  const userProgressCtx = useContext(UserProgressContext);
  const authCtx = useContext(AuthContext);
  const [errorModal, setErrorModal] = useState(null);

  function handleClose() {
    userProgressCtx.hideLogin();
  }

  async function loginAction(_, formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await authCtx.login(email, password);
      handleClose();
    } catch (err) {
      setErrorModal({
        title: "Błąd logowania",
        message: err.message || "Nie udało się zalogować.",
      });
    }
  }

  const [formState, formAction, isSending] = useActionState(loginAction, null);

  return (
    <>
      <Modal open={userProgressCtx.progress === PROGRESS_STEPS.LOGIN} onClose={handleClose}>
        <form action={formAction} id={formId}>
          <h2>Logowanie</h2>
          <Input label="E-Mail" type="email" id={`${formId}-email`} name="email" required />
          <Input label="Hasło" type="password" id={`${formId}-password`} name="password" required />
          <div className="modal-actions">
            <Button textOnly type="button" onClick={handleClose}>
              Zamknij
            </Button>
            <Button type="submit" disabled={isSending}>
              {isSending ? "Logowanie..." : "Zaloguj"}
            </Button>
          </div>
        </form>
      </Modal>

      {errorModal && (
        <Modal open onClose={() => setErrorModal(null)}>
          <div className="error">
            <Error title={errorModal.title} message={errorModal.message} />
          </div>
          <div className="modal-actions" style={{ justifyContent: "flex-end" }}>
            <Button onClick={() => setErrorModal(null)}>Zamknij</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
