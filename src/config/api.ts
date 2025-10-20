// API Configuration
// Siempre usar Railway en producción
const API_URL = 'https://formularioservwebii-production.up.railway.app';

// Log para debugging
console.log('🔧 API Configuration:', {
  hostname: window.location.hostname,
  API_URL
});

export const API_ENDPOINTS = {
  // Auth
  register: `${API_URL}/api/auth/register`,
  login: `${API_URL}/api/auth/login`,
  me: `${API_URL}/api/auth/me`,
  
  // Requests (Servidores)
  requests: `${API_URL}/api/requests`,
  requestById: (id: string) => `${API_URL}/api/requests/${id}`,
  authorizeRequest: (id: string) => `${API_URL}/api/requests/${id}/authorize`,
  
  // Arduino Requests
  arduinoRequests: `${API_URL}/api/arduino-requests`,
  arduinoRequestById: (id: string) => `${API_URL}/api/arduino-requests/${id}`,
  authorizeArduinoRequest: (id: string) => `${API_URL}/api/arduino-requests/${id}/authorize`,
  
  // Reports
  stats: `${API_URL}/api/reports/stats`,
  timeline: `${API_URL}/api/reports/timeline`,
};

// Helper para hacer fetch con autenticación
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
};

export default API_URL;
