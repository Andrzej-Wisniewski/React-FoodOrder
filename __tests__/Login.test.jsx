import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { TestProviders } from '../test-utils/TestProviders';

describe('Login component', () => {
  it('renders input fields', () => {
    render(<TestProviders><Login /></TestProviders>);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hasło/i)).toBeInTheDocument();
  });

  it('logs in successfully', async () => {
    const user = { id: '1', email: 'test@example.com', name: 'Test', role: 'user' };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: '123', user }),
    });

    render(<TestProviders><Login /></TestProviders>);

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: user.email } });
    fireEvent.change(screen.getByLabelText(/hasło/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByText(/zaloguj/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/login', expect.any(Object));
    });
  });

  it('shows error modal on failed login', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Nieprawidłowe dane' }),
    });

    render(<TestProviders><Login /></TestProviders>);

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'fail@test.com' } });
    fireEvent.change(screen.getByLabelText(/hasło/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText(/zaloguj/i));

    expect(await screen.findByText(/błąd logowania/i)).toBeInTheDocument();
    expect(screen.getByText(/nieprawidłowe dane/i)).toBeInTheDocument();
  });
});
