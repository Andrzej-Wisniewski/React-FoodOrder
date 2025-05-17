import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  token: null,
  isLoggedIn: false,
  login: async () => {},
  logout: () => {},
  register: async () => {}
});

export function AuthContextProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const isLoggedIn = !!token;

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  async function login(email, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Nie udało się zalogować.');
    }

    setToken(data.token);
    setUser({
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role 
    });
  }

  async function register(name, email, password) {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Nie udało się zarejestrować.');
    }

    setToken(data.token);
    setUser({
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role 
    });
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
