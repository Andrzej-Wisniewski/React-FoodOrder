import { useId } from 'react';
import { useContext } from 'react';
import { useActionState } from 'react';
import UserProgressContext from '../store/UserProgressContext';
import AuthContext from '../store/AuthContext';
import Modal from './UI/Modal';
import Button from './UI/Button';
import Input from './UI/Input';
import Error from './UI/Error';

export default function Login() {
  const formId = useId();
  const userProgressCtx = useContext(UserProgressContext);
  const authCtx = useContext(AuthContext);

  function handleClose() {
    userProgressCtx.hideLogin();
  }

  async function loginAction(_, formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    await authCtx.login(email, password);
    handleClose();
  }

  const [formState, formAction, isSending] = useActionState(loginAction, null);

  return (
    <Modal open={userProgressCtx.progress === 'login'} onClose={handleClose}>
      <form action={formAction} id={formId}>
        <h2>Logowanie</h2>
        <Input
          label="E-Mail"
          type="email"
          id={`${formId}-email`}
          name="email"
          autoComplete="email"
          required
        />
        <Input
          label="Hasło"
          type="password"
          id={`${formId}-password`}
          name="password"
          autoComplete="current-password"
          required
        />
        <p className="modal-actions">
          <Button textOnly type="button" onClick={handleClose}>
            Zamknij
          </Button>
          <Button type="submit" disabled={isSending}>
            {isSending ? 'Logowanie...' : 'Zaloguj'}
          </Button>
        </p>
      </form>
    </Modal>
  );
}