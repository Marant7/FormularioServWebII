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
  onApprove: (id: string, razon?: string) => void
  onReject: (id: string, razon: string) => void
  onApproveArduino: (id: string, razon?: string) => void
  onRejectArduino: (id: string, razon: string) => void
}) {
  const [selected, setSelected] = useState<RequestItem | any | null>(null)
  const [open, setOpen] = useState(false)
  const [modalType, setModalType] = useState<'servidor' | 'arduino'>('servidor')
  const [tab, setTab] = useState<'servidores' | 'arduino'>('servidores')
  const [vistaTab, setVistaTab] = useState<'pendientes' | 'historial'>('pendientes')
  const [userName, setUserName] = useState<string>('')
  
  // Estados para modal de aprobación
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [approveId, setApproveId] = useState<string>('')
  const [approveType, setApproveType] = useState<'servidor' | 'arduino'>('servidor')
  const [razonAprobacion, setRazonAprobacion] = useState('')
  
  // Estados para modal de rechazo
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectId, setRejectId] = useState<string>('')
  const [rejectType, setRejectType] = useState<'servidor' | 'arduino'>('servidor')
  const [razonRechazo, setRazonRechazo] = useState('')

  // Obtener nombre del usuario actual
  React.useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setUserName(userData.nombre || userData.email)
    }
  }, [])

  const totalServ = requests.length
  const pendientesServ = requests.filter((r) => r.status === 'PENDIENTE').length
  const aprobadasServ = requests.filter((r) => r.status === 'APROBADA').length
  const rechazadasServ = requests.filter((r) => r.status === 'RECHAZADA').length

  const totalArduino = arduinoRequests.length
  const pendientesArduino = arduinoRequests.filter((r) => r.status === 'PENDIENTE').length
  const aprobadasArduino = arduinoRequests.filter((r) => r.status === 'APROBADA').length
  const rechazadasArduino = arduinoRequests.filter((r) => r.status === 'RECHAZADA').length

  function openDetails(r: RequestItem, type: 'servidor' | 'arduino') {
    setSelected(r)
    setModalType(type)
    setOpen(true)
  }

  function handleApprove(id: string, type: 'servidor' | 'arduino') {
    setApproveId(id)
    setApproveType(type)
    setRazonAprobacion('')
    setApproveModalOpen(true)
  }

  function confirmarAprobacion() {
    if (approveType === 'servidor') {
      onApprove(approveId, razonAprobacion || undefined)
    } else {
      onApproveArduino(approveId, razonAprobacion || undefined)
    }
    
    setApproveModalOpen(false)
    setRazonAprobacion('')
  }

  function handleReject(id: string, type: 'servidor' | 'arduino') {
    setRejectId(id)
    setRejectType(type)
    setRazonRechazo('')
    setRejectModalOpen(true)
  }

  function confirmarRechazo() {
    if (!razonRechazo.trim()) {
      alert('Debe indicar un motivo para rechazar la solicitud')
      return
    }
    
    if (rejectType === 'servidor') {
      onReject(rejectId, razonRechazo)
    } else {
      onRejectArduino(rejectId, razonRechazo)
    }
    
    setRejectModalOpen(false)
    setRazonRechazo('')
  }

  return (
    <div>
      <h2>Autorización de Solicitudes</h2>
      
      {/* Pestañas de tipo */}
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

      {/* Sub-pestañas: Pendientes vs Historial */}
      <div style={{ marginBottom: 15, display: 'flex', gap: 10, borderBottom: '2px solid var(--border)', paddingBottom: 10 }}>
        <button 
          className={vistaTab === 'pendientes' ? 'primary' : ''}
          onClick={() => setVistaTab('pendientes')}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          Pendientes ({tab === 'servidores' ? pendientesServ : pendientesArduino})
        </button>
        <button 
          className={vistaTab === 'historial' ? 'primary' : ''}
          onClick={() => setVistaTab('historial')}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          Historial Completo ({tab === 'servidores' ? totalServ : totalArduino})
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
            {requests.filter(r => vistaTab === 'pendientes' ? r.status === 'PENDIENTE' : true).length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                  {vistaTab === 'pendientes' ? 'No hay solicitudes pendientes' : 'No hay solicitudes de servidores para mostrar'}
                </td>
              </tr>
            ) : (
              requests.filter(r => vistaTab === 'pendientes' ? r.status === 'PENDIENTE' : true).map((r) => (
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
                    <button className="small" onClick={() => openDetails(r, 'servidor')}>Ver Detalles</button>
                    {r.status === 'PENDIENTE' && (
                      <>
                        <button className="small primary" onClick={() => handleApprove(r.id, 'servidor')} style={{ marginLeft: 4 }}>
                          Aprobar
                        </button>
                        <button className="small danger" onClick={() => handleReject(r.id, 'servidor')} style={{ marginLeft: 4 }}>
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
            {arduinoRequests.filter(r => vistaTab === 'pendientes' ? r.status === 'PENDIENTE' : true).length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                  {vistaTab === 'pendientes' ? 'No hay solicitudes pendientes' : 'No hay solicitudes de Arduino para mostrar'}
                </td>
              </tr>
            ) : (
              arduinoRequests.filter(r => vistaTab === 'pendientes' ? r.status === 'PENDIENTE' : true).map((r) => (
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
                    <button className="small" onClick={() => openDetails(r, 'arduino')}>Ver Detalles</button>
                    {r.status === 'PENDIENTE' && (
                      <>
                        <button className="small primary" onClick={() => handleApprove(r.id, 'arduino')} style={{ marginLeft: 4 }}>
                          Aprobar
                        </button>
                        <button className="small danger" onClick={() => handleReject(r.id, 'arduino')} style={{ marginLeft: 4 }}>
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

      <DetailsModal open={open} onClose={() => setOpen(false)} request={selected} type={modalType} />

      {/* Modal de Aprobación */}
      {approveModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px', color: 'var(--text)' }}>
              Aprobar Solicitud
            </h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Aprobado por: <strong>{userName}</strong>
            </p>
            
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 600,
              color: 'var(--text)'
            }}>
              Observación (opcional):
            </label>
            <textarea
              value={razonAprobacion}
              onChange={(e) => setRazonAprobacion(e.target.value)}
              placeholder="Puede agregar alguna observación o nota (opcional)..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                fontSize: '0.95rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            
            <div style={{ 
              marginTop: '24px', 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end' 
            }}>
              <button 
                onClick={() => {
                  setApproveModalOpen(false)
                  setRazonAprobacion('')
                }}
                style={{ 
                  padding: '10px 24px',
                  background: 'var(--border)',
                  color: 'var(--text)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarAprobacion}
                className="primary"
                style={{ 
                  padding: '10px 24px',
                  borderRadius: '6px'
                }}
              >
                Confirmar Aprobación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Rechazo */}
      {rejectModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px', color: 'var(--text)' }}>
              Rechazar Solicitud
            </h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Rechazado por: <strong>{userName}</strong>
            </p>
            
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 600,
              color: 'var(--text)'
            }}>
              Motivo del rechazo: <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <textarea
              value={razonRechazo}
              onChange={(e) => setRazonRechazo(e.target.value)}
              placeholder="Indique el motivo por el cual se rechaza la solicitud..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                fontSize: '0.95rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            
            <div style={{ 
              marginTop: '24px', 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end' 
            }}>
              <button 
                onClick={() => {
                  setRejectModalOpen(false)
                  setRazonRechazo('')
                }}
                style={{ 
                  padding: '10px 24px',
                  background: 'var(--border)',
                  color: 'var(--text)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarRechazo}
                className="danger"
                style={{ 
                  padding: '10px 24px',
                  borderRadius: '6px'
                }}
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
