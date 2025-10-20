import React, { useState, useEffect } from 'react'
import RequestForm from './components/RequestForm'
import ArduinoKitForm from './components/ArduinoKitForm'
import Navbar from './components/Navbar'
import Authorization from './pages/Authorization'
import Reports from './pages/Reports'
import Login from './pages/Login'
import MisSolicitudes from './pages/MisSolicitudes'
import * as api from './services/api'

export type Status = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'

export type RequestItem = {
  id: string
  docenteResponsable: string
  curso: string
  semestre: string
  fecha: string
  horaEntrada: string
  horaSalida: string
  servidor: string
  serieServidor: string
  tipoServidor: string
  caracteristicas: string
  incluirMonitor: boolean
  incluirTeclado: boolean
  incluirMouse: boolean
  codigoResponsable: string
  nombreResponsable: string
  integrantes: any[]
  soporte: string
  status: Status
  createdAt?: string
  estudiante?: {
    nombre: string
    email: string
  }
  autorizacion?: {
    accion: string
    razon?: string
    soporte: {
      nombre: string
    }
  }
}

export default function App() {
  const [view, setView] = useState<'nuevo' | 'nuevo-arduino' | 'autorizacion' | 'reportes' | 'inicio' | 'mis-solicitudes'>('inicio')
  const [user, setUser] = useState<api.User | null>(null)
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [arduinoRequests, setArduinoRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const currentUser = api.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      loadRequests()
      if (currentUser.role === 'ESTUDIANTE') {
        setView('mis-solicitudes')
      } else if (currentUser.role === 'SOPORTE') {
        setView('autorizacion')
      } else if (currentUser.role === 'METRICAS') {
        setView('reportes')
      }
    }
  }, [])

  const loadRequests = async () => {
    setLoading(true)
    setError('')
    try {
      const [serverData, arduinoData] = await Promise.all([
        api.getRequests(),
        api.getArduinoRequests()
      ])
      setRequests(serverData as any)
      setArduinoRequests(arduinoData as any)
    } catch (err: any) {
      setError(err.message)
      console.error('Error cargando solicitudes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData: api.User, token?: string) => {
    setUser(userData)
    loadRequests()
    if (userData.role === 'ESTUDIANTE') {
      setView('mis-solicitudes')
    } else if (userData.role === 'SOPORTE') {
      setView('autorizacion')
    } else if (userData.role === 'METRICAS') {
      setView('reportes')
    }
  }

  const handleLogout = () => {
    api.logout()
    setUser(null)
    setRequests([])
    setView('inicio')
  }

  const addRequest = async (data: Omit<RequestItem, 'id' | 'status'>) => {
    setLoading(true)
    setError('')
    try {
      const newRequest = await api.createRequest(data)
      setRequests((prev) => [newRequest as any, ...prev])
      setView('mis-solicitudes')
      alert('✅ Solicitud creada exitosamente')
    } catch (err: any) {
      setError(err.message)
      alert('❌ Error al crear solicitud: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const addArduinoRequest = async (data: any) => {
    setLoading(true)
    setError('')
    try {
      const newRequest = await api.createArduinoRequest(data)
      console.log('Solicitud de Arduino creada:', newRequest)
      setView('mis-solicitudes')
      alert('✅ Solicitud de Kit Arduino creada exitosamente')
    } catch (err: any) {
      setError(err.message)
      alert('❌ Error al crear solicitud: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    const razon = prompt('Razón de aprobación (opcional):')
    setLoading(true)
    try {
      await api.authorizeRequest(id, 'APROBADA', razon || undefined)
      await loadRequests()
      alert('✅ Solicitud aprobada')
    } catch (err: any) {
      alert('❌ Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (id: string) => {
    const razon = prompt('Razón del rechazo (requerida):')
    if (!razon) {
      alert('La razón es requerida para rechazar')
      return
    }
    setLoading(true)
    try {
      await api.authorizeRequest(id, 'RECHAZADA', razon)
      await loadRequests()
      alert('✅ Solicitud rechazada')
    } catch (err: any) {
      alert('❌ Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveArduino = async (id: string) => {
    const razon = prompt('Razón de aprobación (opcional):')
    setLoading(true)
    try {
      await api.authorizeArduinoRequest(id, 'APROBADA', razon || undefined)
      await loadRequests()
      alert('✅ Solicitud de Arduino aprobada')
    } catch (err: any) {
      alert('❌ Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRejectArduino = async (id: string) => {
    const razon = prompt('Razón del rechazo (requerida):')
    if (!razon) {
      alert('La razón es requerida para rechazar')
      return
    }
    setLoading(true)
    try {
      await api.authorizeArduinoRequest(id, 'RECHAZADA', razon)
      await loadRequests()
      alert('✅ Solicitud de Arduino rechazada')
    } catch (err: any) {
      alert('❌ Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <Login onLoginSuccess={handleLogin} />
  }

  return (
    <div>
      <Navbar onNavigate={setView} userRole={user.role} />
      <div className="container">
        {/* Barra de usuario */}
        <div style={{
          background: 'var(--card)',
          padding: '16px 20px',
          borderRadius: 8,
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          <div>
            <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>
              {user.nombre}
            </strong>
            <span style={{ marginLeft: 12, color: 'var(--text-light)', fontSize: '0.875rem' }}>
              {user.role === 'ESTUDIANTE' ? 'Estudiante' : user.role === 'SOPORTE' ? 'Soporte Técnico' : 'Jefe de Laboratorio'} • {user.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: 'var(--danger)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--danger-hover)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'var(--danger)'}
          >
            Cerrar Sesión
          </button>
        </div>

        {error && (
          <div className="errors">
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>
            Cargando...
          </div>
        )}        {/* VISTAS PARA ESTUDIANTE */}
        {user.role === 'ESTUDIANTE' && view === 'mis-solicitudes' && (
          <MisSolicitudes requests={requests} arduinoRequests={arduinoRequests} />
        )}

        {user.role === 'ESTUDIANTE' && view === 'nuevo' && (
          <>
            <h1>Nueva Solicitud - Servidor</h1>
            <RequestForm onCreate={(data) => addRequest(data as any)} />
          </>
        )}

        {user.role === 'ESTUDIANTE' && view === 'nuevo-arduino' && (
          <>
            <h1>Solicitud de Préstamo de Kit Arduino</h1>
            <ArduinoKitForm onCreate={(data) => addArduinoRequest(data)} />
          </>
        )}

        {user.role === 'SOPORTE' && view === 'autorizacion' && (
          <Authorization
            requests={requests}
            arduinoRequests={arduinoRequests}
            onApprove={handleApprove}
            onReject={handleReject}
            onApproveArduino={handleApproveArduino}
            onRejectArduino={handleRejectArduino}
          />
        )}

        {user.role === 'METRICAS' && view === 'reportes' && (
          <Reports requests={requests} arduinoRequests={arduinoRequests} />
        )}

        {((user.role === 'SOPORTE' && view !== 'autorizacion') ||
          (user.role === 'METRICAS' && view !== 'reportes')) && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <h2>⚠️ Vista no disponible</h2>
            <p>No tienes permisos para acceder a esta sección</p>
          </div>
        )}
      </div>
    </div>
  )
}
