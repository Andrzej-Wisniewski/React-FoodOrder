import { createContext, useState } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  isLoggedIn: false,
  login: async (email, password) => {},
  logout: () => {},
  register: async (name, email, password) => {}
});

export function AuthContextProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const isLoggedIn = !!token;

  async function login(email, password) {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Nie udało się zalogować.");
    }
    
    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async function register(name, email, password) {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Nie udało się zarejestrować.");
    }
    
    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  const contextValue = {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;