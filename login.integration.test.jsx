import { describe, it, expect } from 'vitest';

describe('POST /api/login', () => {
  it('should log in successfully with valid credentials', async () => {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@test.com', 
        password: 'password'
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe('admin@test.com');
  });

  it('should reject login with invalid credentials', async () => {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'fake@test.com',
        password: 'wrongpassword'
      }),
    });

    expect(response.status).toBe(401);
    const data = await response.json();

    expect(data).toHaveProperty('message');
    expect(data.message).toMatch(/nieprawidłowe/i);
  });
});
