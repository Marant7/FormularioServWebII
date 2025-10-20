import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

interface LoginProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al iniciar sesión');
      }

      const data = await response.json();
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: 24, background: '#f9f9f9', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
        Iniciar Sesión
      </h2>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ddd' }}
            placeholder="estudiante@upt.pe"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ddd' }}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div style={{ padding: 12, background: '#fee', color: '#c00', borderRadius: 6, marginBottom: 16 }}>
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            background: loading ? '#ccc' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div style={{ marginTop: 24, padding: 16, background: '#fff', borderRadius: 6 }}>
        <p style={{ margin: '0 0 12px 0', fontWeight: 600, fontSize: 14 }}>
          Usuarios de Prueba:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={() => quickLogin('estudiante@upt.pe', 'estudiante123')}
            style={{
              padding: 8,
              background: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: 4,
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: 13,
            }}
          >
            <strong>Estudiante:</strong> estudiante@upt.pe
          </button>
          <button
            type="button"
            onClick={() => quickLogin('soporte@upt.pe', 'soporte123')}
            style={{
              padding: 8,
              background: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: 4,
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: 13,
            }}
          >
            <strong>Soporte:</strong> soporte@upt.pe
          </button>
          <button
            type="button"
            onClick={() => quickLogin('jefe@upt.pe', 'metricas123')}
            style={{
              padding: 8,
              background: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: 4,
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: 13,
            }}
          >
            <strong>Métricas/Jefe:</strong> jefe@upt.pe
          </button>
        </div>
      </div>
    </div>
  );
}
