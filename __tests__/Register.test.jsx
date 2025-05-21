import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../components/Register';
import { TestProviders } from '../test-utils/TestProviders';

describe('Register component', () => {
  it('renders inputs', () => {
    render(<TestProviders><Register /></TestProviders>);
    expect(screen.getByLabelText(/imię/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hasło/i)).toBeInTheDocument();
  });

  it('registers new user', async () => {
    const user = { id: '2', email: 'jan@example.com', name: 'Jan', role: 'user' };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: '456', user }),
    });

    render(<TestProviders><Register /></TestProviders>);

    fireEvent.change(screen.getByLabelText(/imię/i), { target: { value: user.name } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: user.email } });
    fireEvent.change(screen.getByLabelText(/hasło/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/zarejestruj/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/register', expect.any(Object));
    });
  });

  it('shows error modal on failed registration', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Użytkownik już istnieje' }),
    });

    render(<TestProviders><Register /></TestProviders>);

    fireEvent.change(screen.getByLabelText(/imię/i), { target: { value: 'Anna' } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'anna@example.com' } });
    fireEvent.change(screen.getByLabelText(/hasło/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByText(/zarejestruj/i));

    expect(await screen.findByText(/błąd rejestracji/i)).toBeInTheDocument();
    expect(screen.getByText(/użytkownik już istnieje/i)).toBeInTheDocument();
  });
});
