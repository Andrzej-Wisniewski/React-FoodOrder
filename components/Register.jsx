import { useContext } from "react";
import Modal from "./UI/Modal";
import Button from "./UI/Button";
import Input from "./UI/Input";
import UserProgressContext from "../store/UserProgressContext";
import AuthContext from "../store/AuthContext";
import { useActionState } from "react";

export default function Register() {
  const userProgressCtx = useContext(UserProgressContext);
  const authCtx = useContext(AuthContext);

  function handleClose() {
    userProgressCtx.hideRegister();
  }

  async function registerAction(_, formData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    await authCtx.register(name, email, password);
    handleClose();
  }

  const [formState, formAction, isSending] = useActionState(registerAction, null);

  let actions = (
    <>
      <Button textOnly onClick={handleClose}>Zamknij</Button>
      <Button type="submit">Zarejestruj</Button>
    </>
  );
  if (isSending) {
    actions = <span>Trwa rejestracja...</span>;
  }

  return (
    <Modal open={userProgressCtx.progress === "register"} onClose={handleClose}>
      <form action={formAction}>
        <h2>Rejestracja</h2>
        <Input label="Imię" type="text" name="name" required />
        <Input label="E-Mail" type="email" name="email" required />
        <Input label="Hasło" type="password" name="password" required />
        <div className="modal-actions">
          {actions}
          {formState?.error && <p className="error">{formState.error.message}</p>}
        </div>
      </form>
    </Modal>
  );
}
