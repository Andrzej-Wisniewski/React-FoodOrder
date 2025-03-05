import { useContext } from "react";
import { useActionState } from "react";
import UserProgressContext from "../store/UserProgressContext";
import AuthContext from "../store/AuthContext";
import Modal from "./UI/Modal";
import Button from "./UI/Button";
import Input from "./UI/Input";
import Error from "./UI/Error";

export default function Login() {
  const userProgressCtx = useContext(UserProgressContext);
  const authCtx = useContext(AuthContext);

  function handleClose() {
    userProgressCtx.hideLogin();
  }

  async function loginAction(_, formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    await authCtx.login(email, password); 
    handleClose(); 
  }

  const [formState, formAction, isSending, error] = useActionState(loginAction, null);

  let modalActions = (
    <>
      <Button textOnly onClick={handleClose}>Zamknij</Button>
      <Button type="submit">Zaloguj</Button>
    </>
  );
  if (isSending) {
    modalActions = <p>Logowanie...</p>;
  }

  return (
    <Modal open={userProgressCtx.progress === "login"} onClose={handleClose}>
      <form onAction={formAction}>
        <h2>Logowanie</h2>
        <Input label="E-Mail" type="email" id="email" required />
        <Input label="Hasło" type="password" id="password" required />

        {error && <Error title="Błąd logowania" message={error} />}
        <p className="modal-actions">{modalActions}</p>
      </form>
    </Modal>
  );
}
