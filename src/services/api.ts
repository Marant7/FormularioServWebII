import { API_ENDPOINTS, authFetch } from '../config/api';

// ========================================
// TIPOS
// ========================================

export interface User {
  id: string;
  email: string;
  nombre: string;
  role: 'ESTUDIANTE' | 'SOPORTE' | 'METRICAS';
}

export interface Request {
  id: string;
  docenteResponsable: string;
  curso: string;
  semestre: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  servidor: string;
  serieServidor: string;
  tipoServidor: string;
  caracteristicas: string;
  incluirMonitor: boolean;
  incluirTeclado: boolean;
  incluirMouse: boolean;
  codigoResponsable: string;
  nombreResponsable: string;
  integrantes: any[];
  soporte: string;
  status: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  createdAt: string;
  updatedAt: string;
  estudiante?: {
    id: string;
    nombre: string;
    email: string;
  };
  autorizacion?: {
    accion: string;
    razon?: string;
    soporte: {
      nombre: string;
    };
  };
}

// ========================================
// AUTENTICACIÓN
// ========================================

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ========================================
// SOLICITUDES
// ========================================

export const getRequests = async (): Promise<Request[]> => {
  const result = await authFetch(API_ENDPOINTS.requests);
  return result.requests;
};

export const createRequest = async (data: any): Promise<Request> => {
  const result = await authFetch(API_ENDPOINTS.requests, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.request;
};

export const authorizeRequest = async (
  id: string,
  accion: 'APROBADA' | 'RECHAZADA',
  razon?: string
): Promise<Request> => {
  const result = await authFetch(API_ENDPOINTS.authorizeRequest(id), {
    method: 'PUT',
    body: JSON.stringify({ accion, razon }),
  });
  return result.request;
};

export const deleteRequest = async (id: string): Promise<void> => {
  await authFetch(API_ENDPOINTS.requestById(id), {
    method: 'DELETE',
  });
};

// ========================================
// SOLICITUDES DE ARDUINO
// ========================================

export const getArduinoRequests = async (): Promise<any[]> => {
  const result = await authFetch('http://localhost:3000/api/arduino-requests');
  return result;
};

export const createArduinoRequest = async (data: any): Promise<any> => {
  const result = await authFetch('http://localhost:3000/api/arduino-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result;
};

export const authorizeArduinoRequest = async (
  id: string,
  accion: 'APROBADA' | 'RECHAZADA',
  razon?: string
): Promise<any> => {
  const result = await authFetch(`http://localhost:3000/api/arduino-requests/${id}/authorize`, {
    method: 'PUT',
    body: JSON.stringify({ accion, razon }),
  });
  return result;
};

// ========================================
// REPORTES
// ========================================

export const getStats = async () => {
  return authFetch(API_ENDPOINTS.stats);
};
