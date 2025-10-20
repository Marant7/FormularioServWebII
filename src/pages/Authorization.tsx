import React, { useState } from 'react'
import { RequestItem } from '../App'
import DetailsModal from '../components/DetailsModal'

export default function Authorization({ 
  requests, 
  arduinoRequests,
  onApprove, 
  onReject,
  onApproveArduino,
  onRejectArduino
}: { 
  requests: RequestItem[]
  arduinoRequests: any[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onApproveArduino: (id: string) => void
  onRejectArduino: (id: string) => void
}) {
  const [selected, setSelected] = useState<RequestItem | null>(null)
  const [selectedArduino, setSelectedArduino] = useState<any | null>(null)
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'servidores' | 'arduino'>('servidores')

  const totalServ = requests.length
  const pendientesServ = requests.filter((r) => r.status === 'PENDIENTE').length
  const aprobadasServ = requests.filter((r) => r.status === 'APROBADA').length
  const rechazadasServ = requests.filter((r) => r.status === 'RECHAZADA').length

  const totalArduino = arduinoRequests.length
  const pendientesArduino = arduinoRequests.filter((r) => r.status === 'PENDIENTE').length
  const aprobadasArduino = arduinoRequests.filter((r) => r.status === 'APROBADA').length
  const rechazadasArduino = arduinoRequests.filter((r) => r.status === 'RECHAZADA').length

  function openDetails(r: RequestItem) {
    setSelected(r)
    setOpen(true)
  }

  function openArduinoDetails(r: any) {
    setSelectedArduino(r)
    setOpen(true)
  }

  return (
    <div>
      <h2>Autorización de Solicitudes</h2>
      
      {/* Pestañas */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <button 
          className={tab === 'servidores' ? 'primary' : ''}
          onClick={() => setTab('servidores')}
          style={{ padding: '10px 20px' }}
        >
          Servidores ({pendientesServ} pendientes)
        </button>
        <button 
          className={tab === 'arduino' ? 'primary' : ''}
          onClick={() => setTab('arduino')}
          style={{ padding: '10px 20px' }}
        >
          Kits Arduino ({pendientesArduino} pendientes)
        </button>
      </div>

      {/* Estadísticas según la pestaña */}
      <div className="stats">
        {tab === 'servidores' ? (
          <>
            <div className="stat"> <strong>{totalServ}</strong> <div>Total de Solicitudes</div> </div>
            <div className="stat"> <strong>{pendientesServ}</strong> <div>Solicitudes Pendientes</div> </div>
            <div className="stat"> <strong>{aprobadasServ}</strong> <div>Solicitudes Aprobadas</div> </div>
            <div className="stat"> <strong>{rechazadasServ}</strong> <div>Solicitudes Rechazadas</div> </div>
          </>
        ) : (
          <>
            <div className="stat"> <strong>{totalArduino}</strong> <div>Total de Solicitudes</div> </div>
            <div className="stat"> <strong>{pendientesArduino}</strong> <div>Solicitudes Pendientes</div> </div>
            <div className="stat"> <strong>{aprobadasArduino}</strong> <div>Solicitudes Aprobadas</div> </div>
            <div className="stat"> <strong>{rechazadasArduino}</strong> <div>Solicitudes Rechazadas</div> </div>
          </>
        )}
      </div>

      {/* Tabla de Servidores */}
      {tab === 'servidores' && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Docente</th>
              <th>Curso</th>
              <th>Semestre</th>
              <th>Fecha</th>
              <th>Servidor</th>
              <th>Estudiante</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                  No hay solicitudes de servidores para mostrar
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontSize: '0.85em', color: '#666' }}>{r.id.slice(0, 8)}...</td>
                  <td>{r.docenteResponsable}</td>
                  <td>{r.curso}</td>
                  <td>{r.semestre}</td>
                  <td>{r.fecha}</td>
                  <td>{r.servidor}</td>
                  <td>{r.estudiante?.nombre || 'N/A'}</td>
                  <td>
                    <span className={`badge ${r.status.toLowerCase()}`}>
                      {r.status === 'PENDIENTE' ? 'Pendiente' : r.status === 'APROBADA' ? 'Aprobada' : 'Rechazada'}
                    </span>
                    {r.status === 'RECHAZADA' && r.autorizacion?.razon && (
                      <div style={{ fontSize: '0.85em', color: '#dc3545', marginTop: 4 }}>
                        Motivo: {r.autorizacion.razon}
                      </div>
                    )}
                    {r.status === 'APROBADA' && r.autorizacion?.razon && (
                      <div style={{ fontSize: '0.85em', color: '#28a745', marginTop: 4 }}>
                        Nota: {r.autorizacion.razon}
                      </div>
                    )}
                  </td>
                  <td>
                    <button className="small" onClick={() => openDetails(r)}>Ver Detalles</button>
                    {r.status === 'PENDIENTE' && (
                      <>
                        <button className="small primary" onClick={() => onApprove(r.id)} style={{ marginLeft: 4 }}>
                          Aprobar
                        </button>
                        <button className="small danger" onClick={() => onReject(r.id)} style={{ marginLeft: 4 }}>
                          Rechazar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Tabla de Arduino */}
      {tab === 'arduino' && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Docente</th>
              <th>Curso</th>
              <th>Semestre</th>
              <th>Fecha</th>
              <th>Kit Arduino</th>
              <th>Proyecto</th>
              <th>Estudiante</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {arduinoRequests.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                  No hay solicitudes de Arduino para mostrar
                </td>
              </tr>
            ) : (
              arduinoRequests.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontSize: '0.85em', color: '#666' }}>{r.id.slice(0, 8)}...</td>
                  <td>{r.docenteResponsable}</td>
                  <td>{r.curso}</td>
                  <td>{r.semestre}</td>
                  <td>{new Date(r.fecha).toLocaleDateString()}</td>
                  <td>{r.kitArduino}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.temaProyecto}
                  </td>
                  <td>{r.estudiante?.nombre || 'N/A'}</td>
                  <td>
                    <span className={`badge ${r.status.toLowerCase()}`}>
                      {r.status === 'PENDIENTE' ? 'Pendiente' : r.status === 'APROBADA' ? 'Aprobada' : 'Rechazada'}
                    </span>
                    {r.status === 'RECHAZADA' && r.autorizacion?.razon && (
                      <div style={{ fontSize: '0.85em', color: '#dc3545', marginTop: 4 }}>
                        Motivo: {r.autorizacion.razon}
                      </div>
                    )}
                    {r.status === 'APROBADA' && r.autorizacion?.razon && (
                      <div style={{ fontSize: '0.85em', color: '#28a745', marginTop: 4 }}>
                        Nota: {r.autorizacion.razon}
                      </div>
                    )}
                  </td>
                  <td>
                    <button className="small" onClick={() => openArduinoDetails(r)}>Ver Detalles</button>
                    {r.status === 'PENDIENTE' && (
                      <>
                        <button className="small primary" onClick={() => onApproveArduino(r.id)} style={{ marginLeft: 4 }}>
                          Aprobar
                        </button>
                        <button className="small danger" onClick={() => onRejectArduino(r.id)} style={{ marginLeft: 4 }}>
                          Rechazar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <DetailsModal open={open} onClose={() => setOpen(false)} request={selected} />
    </div>
  )
}
