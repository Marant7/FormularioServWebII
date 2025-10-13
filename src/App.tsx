import React, { useState } from 'react'
import RequestForm from './components/RequestForm'
import Navbar from './components/Navbar'
import Authorization from './pages/Authorization'
import Reports from './pages/Reports'

export type Status = 'Pendiente' | 'Aprobada' | 'Rechazada'

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
  integrantes: string[]
  soporte: string
  status: Status
}

export default function App() {
  const [view, setView] = useState<'nuevo' | 'autorizacion' | 'reportes' | 'inicio'>('inicio')

  const [requests, setRequests] = useState<RequestItem[]>([
    // Datos de ejemplo
    {
      id: '1757028863351',
      docenteResponsable: 'bbb',
      curso: 'bb',
      semestre: '2025-II',
      fecha: '2025-09-04',
      horaEntrada: '08:00',
      horaSalida: '12:00',
      servidor: 'Server2',
      serieServidor: 'wdeew45',
      tipoServidor: 'Torre',
      caracteristicas: '8CPU, 16GB RAM',
      incluirMonitor: false,
      incluirTeclado: false,
      incluirMouse: false,
      codigoResponsable: '',
      nombreResponsable: '',
      integrantes: [],
      soporte: 'Teli Casilla Maquera',
      status: 'Pendiente'
    },
    {
      id: '1757030003366',
      docenteResponsable: 'ccc',
      curso: 'ccc',
      semestre: '2025-II',
      fecha: '2025-09-04',
      horaEntrada: '09:00',
      horaSalida: '13:00',
      servidor: 'Server3',
      serieServidor: 'SRV-999',
      tipoServidor: 'Blade',
      caracteristicas: '24CPU, 64GB RAM',
      incluirMonitor: false,
      incluirTeclado: false,
      incluirMouse: false,
      codigoResponsable: '',
      nombreResponsable: '',
      integrantes: [],
      soporte: '',
      status: 'Pendiente'
    }
  ])

  function addRequest(data: Omit<RequestItem, 'id' | 'status'>) {
    const id = String(Date.now())
    const newReq: RequestItem = { ...data, id, status: 'Pendiente' }
    setRequests((prev) => [newReq, ...prev])
    setView('autorizacion')
  }

  function updateStatus(id: string, status: Status) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  return (
    <div>
      <Navbar onNavigate={setView} />
      <div className="container">
        {view === 'inicio' && (
          <>
            <h1>Formulario de Solicitud</h1>
            <RequestForm onCreate={(data) => addRequest(data as any)} />
          </>
        )}

        {view === 'nuevo' && (
          <>
            <h1>Nuevo Préstamo</h1>
            <RequestForm onCreate={(data) => addRequest(data as any)} />
          </>
        )}

        {view === 'autorizacion' && (
          <Authorization requests={requests} onApprove={(id) => updateStatus(id, 'Aprobada')} onReject={(id) => updateStatus(id, 'Rechazada')} />
        )}

        {view === 'reportes' && <Reports requests={requests} />}
      </div>
    </div>
  )
}
