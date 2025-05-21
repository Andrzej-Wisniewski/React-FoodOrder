import React from "react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthContextProvider } from "../store/AuthContext";
import AuthContext from "../store/AuthContext";

const wrapper = ({ children }) => (
  <AuthContextProvider>{children}</AuthContextProvider>
);

beforeEach(() => {
  localStorage.clear();
  vi.resetAllMocks();
});

describe("AuthContext", () => {
  it("logs in a user successfully", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "fake-token",
        user: { id: "1", email: "test@test.com", name: "Test", role: "user" },
      }),
    });

    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper,
    });

    await act(() => result.current.login("test@test.com", "123456"));

    expect(result.current.token).toBe("fake-token");
    expect(result.current.user.email).toBe("test@test.com");
    expect(result.current.isLoggedIn).toBe(true);
  });

  it("handles login error", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Błąd logowania" }),
    });

    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper,
    });

    await expect(
      result.current.login("wrong@test.com", "wrong")
    ).rejects.toThrow("Błąd logowania");
  });

  it("registers a new user", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "new-token",
        user: { id: "2", email: "new@user.com", name: "New", role: "user" },
      }),
    });

    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper,
    });

    await act(() => result.current.register("New", "new@user.com", "password"));

    expect(result.current.token).toBe("new-token");
    expect(result.current.user.name).toBe("New");
  });

  it("logs out user", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "logout-token",
        user: { id: "3", email: "x@x.com", name: "X", role: "user" },
      }),
    });

    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper,
    });

    await act(() => result.current.login("x@x.com", "pass"));
    act(() => result.current.logout());

    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(result.current.isLoggedIn).toBe(false);
  });
});
