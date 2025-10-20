// Ejemplos de Servicios para conectar Frontend con Backend

import { API_ENDPOINTS, authFetch } from '../config/api';

// ========================================
// AUTENTICACIÓN
// ========================================

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  role?: 'ESTUDIANTE' | 'SOPORTE' | 'METRICAS';
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  role: 'ESTUDIANTE' | 'SOPORTE' | 'METRICAS';
  createdAt: string;
}

// Login
export const login = async (data: LoginData) => {
  const response = await fetch(API_ENDPOINTS.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al iniciar sesión');
  }

  const result = await response.json();
  
  // Guardar token en localStorage
  localStorage.setItem('token', result.token);
  localStorage.setItem('user', JSON.stringify(result.user));
  
  return result;
};

// Register
export const register = async (data: RegisterData) => {
  const response = await fetch(API_ENDPOINTS.register, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al registrar');
  }

  return response.json();
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Obtener usuario actual
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Verificar si está autenticado
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// ========================================
// SOLICITUDES (REQUESTS)
// ========================================

export interface CreateRequestData {
  docenteResponsable: string;
  curso: string;
  semestre: string;
  fecha: string; // ISO string
  horaEntrada: string;
  horaSalida: string;
  servidor: string;
  serieServidor: string;
  tipoServidor: string;
  caracteristicas: string;
  incluirMonitor?: boolean;
  incluirTeclado?: boolean;
  incluirMouse?: boolean;
  codigoResponsable: string;
  nombreResponsable: string;
  integrantes: Array<{
    codigo: string;
    nombre: string;
    rol: 'Estudiante' | 'Docente';
  }>;
  soporte: string;
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
  estudianteId: string;
  estudiante?: {
    id: string;
    nombre: string;
    email: string;
  };
  autorizacion?: {
    id: string;
    accion: string;
    razon?: string;
    createdAt: string;
    soporte: {
      id: string;
      nombre: string;
      email: string;
    };
  };
}

// Obtener todas las solicitudes
export const getRequests = async (): Promise<Request[]> => {
  const result = await authFetch(API_ENDPOINTS.requests);
  return result.requests;
};

// Obtener solicitud por ID
export const getRequestById = async (id: string): Promise<Request> => {
  const result = await authFetch(API_ENDPOINTS.requestById(id));
  return result.request;
};

// Crear solicitud
export const createRequest = async (data: CreateRequestData): Promise<Request> => {
  const result = await authFetch(API_ENDPOINTS.requests, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.request;
};

// Autorizar solicitud (aprobar/rechazar)
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

// Eliminar solicitud
export const deleteRequest = async (id: string): Promise<void> => {
  await authFetch(API_ENDPOINTS.requestById(id), {
    method: 'DELETE',
  });
};

// ========================================
// REPORTES
// ========================================

export interface Stats {
  resumen: {
    total: number;
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
  };
  porServidor: Array<{
    servidor: string;
    cantidad: number;
  }>;
  porSemestre: Array<{
    semestre: string;
    cantidad: number;
  }>;
  topEstudiantes: Array<{
    estudiante: string;
    email: string;
    cantidad: number;
  }>;
}

export interface TimelineItem {
  fecha: string;
  total: number;
  pendientes: number;
  aprobadas: number;
  rechazadas: number;
}

// Obtener estadísticas
export const getStats = async (): Promise<Stats> => {
  return authFetch(API_ENDPOINTS.stats);
};

// Obtener timeline
export const getTimeline = async (): Promise<TimelineItem[]> => {
  const result = await authFetch(API_ENDPOINTS.timeline);
  return result.timeline;
};

// ========================================
// EJEMPLO DE USO EN COMPONENTES
// ========================================

/*

// Login Component
import { login } from './services/api.examples';

const handleLogin = async () => {
  try {
    const result = await login({ 
      email: 'estudiante@unsa.edu.pe', 
      password: 'estudiante123' 
    });
    console.log('Login exitoso:', result.user);
    // Redirigir a dashboard
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Crear Solicitud
import { createRequest } from './services/api.examples';

const handleCreateRequest = async (formData) => {
  try {
    const request = await createRequest(formData);
    console.log('Solicitud creada:', request);
    // Mostrar mensaje de éxito
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Listar Solicitudes
import { getRequests } from './services/api.examples';

const loadRequests = async () => {
  try {
    const requests = await getRequests();
    console.log('Solicitudes:', requests);
    // Actualizar estado
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Aprobar Solicitud
import { authorizeRequest } from './services/api.examples';

const handleApprove = async (id: string) => {
  try {
    await authorizeRequest(id, 'APROBADA', 'Todo en orden');
    console.log('Solicitud aprobada');
    // Recargar solicitudes
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Ver Estadísticas
import { getStats } from './services/api.examples';

const loadStats = async () => {
  try {
    const stats = await getStats();
    console.log('Estadísticas:', stats);
    // Mostrar en dashboard
  } catch (error) {
    console.error('Error:', error.message);
  }
};

*/
