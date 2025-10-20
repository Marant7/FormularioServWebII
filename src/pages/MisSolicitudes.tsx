import React from 'react'
import { RequestItem } from '../App'
import DetailsModal from '../components/DetailsModal'

export default function MisSolicitudes({ 
  requests, 
  arduinoRequests 
}: { 
  requests: RequestItem[]
  arduinoRequests: any[]
}) {
  const [selected, setSelected] = React.useState<RequestItem | any | null>(null)
  const [open, setOpen] = React.useState(false)
  const [modalType, setModalType] = React.useState<'servidor' | 'arduino'>('servidor')
  const [tab, setTab] = React.useState<'servidores' | 'arduino'>('servidores')

  // Stats para servidores
  const pendientesServ = requests.filter((r) => r.status === 'PENDIENTE').length
  const aprobadasServ = requests.filter((r) => r.status === 'APROBADA').length
  const rechazadasServ = requests.filter((r) => r.status === 'RECHAZADA').length

  // Stats para Arduino
  const pendientesArduino = arduinoRequests.filter((r) => r.status === 'PENDIENTE').length
  const aprobadasArduino = arduinoRequests.filter((r) => r.status === 'APROBADA').length
  const rechazadasArduino = arduinoRequests.filter((r) => r.status === 'RECHAZADA').length

  function openDetails(r: RequestItem | any, type: 'servidor' | 'arduino') {
    setSelected(r)
    setModalType(type)
    setOpen(true)
  }

  return (
    <div>
      <h2>Mis Solicitudes</h2>
      
      {/* Pestañas */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <button 
          className={tab === 'servidores' ? 'primary' : ''}
          onClick={() => setTab('servidores')}
          style={{ padding: '10px 20px' }}
        >
          Servidores ({requests.length})
        </button>
        <button 
          className={tab === 'arduino' ? 'primary' : ''}
          onClick={() => setTab('arduino')}
          style={{ padding: '10px 20px' }}
        >
          Kits Arduino ({arduinoRequests.length})
        </button>
      </div>

      {/* Estadísticas según pestaña */}
      <div className="stats">
        {tab === 'servidores' ? (
          <>
            <div className="stat">
              <strong>{requests.length}</strong>
              <div>Total de Solicitudes</div>
            </div>
            <div className="stat">
              <strong>{pendientesServ}</strong>
              <div>Pendientes</div>
            </div>
            <div className="stat">
              <strong>{aprobadasServ}</strong>
              <div>Aprobadas</div>
            </div>
            <div className="stat">
              <strong>{rechazadasServ}</strong>
              <div>Rechazadas</div>
            </div>
          </>
        ) : (
          <>
            <div className="stat">
              <strong>{arduinoRequests.length}</strong>
              <div>Total de Solicitudes</div>
            </div>
            <div className="stat">
              <strong>{pendientesArduino}</strong>
              <div>Pendientes</div>
            </div>
            <div className="stat">
              <strong>{aprobadasArduino}</strong>
              <div>Aprobadas</div>
            </div>
            <div className="stat">
              <strong>{rechazadasArduino}</strong>
              <div>Rechazadas</div>
            </div>
          </>
        )}
      </div>

      {/* Tabla de Servidores */}
      {tab === 'servidores' && (
        <>
          {requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, background: '#f9f9f9', borderRadius: 8 }}>
              <p style={{ fontSize: 18, color: '#666' }}>
                No tienes solicitudes de servidores aún
              </p>
              <p style={{ color: '#999' }}>
                Crea tu primera solicitud usando el botón "Servidor"
              </p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha Solicitud</th>
                  <th>Curso</th>
                  <th>Fecha Uso</th>
                  <th>Servidor</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontSize: '0.85em', color: '#666' }}>{r.id.slice(0, 8)}...</td>
                    <td>{new Date(r.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td>{r.curso}</td>
                    <td>{r.fecha}</td>
                    <td>{r.servidor}</td>
                    <td>
                      <span className={`badge ${r.status.toLowerCase()}`}>
                        {r.status === 'PENDIENTE' && 'Pendiente'}
                        {r.status === 'APROBADA' && 'Aprobada'}
                        {r.status === 'RECHAZADA' && 'Rechazada'}
                      </span>
                      {r.status === 'RECHAZADA' && r.autorizacion?.razon && (
                        <div style={{ fontSize: '0.85em', color: '#dc3545', marginTop: 6, fontWeight: 500 }}>
                          Motivo: {r.autorizacion.razon}
                        </div>
                      )}
                      {r.status === 'APROBADA' && r.autorizacion?.razon && (
                        <div style={{ fontSize: '0.85em', color: '#28a745', marginTop: 6 }}>
                          Nota: {r.autorizacion.razon}
                        </div>
                      )}
                    </td>
                    <td>
                      <button className="small" onClick={() => openDetails(r, 'servidor')}>
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Tabla de Arduino */}
      {tab === 'arduino' && (
        <>
          {arduinoRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, background: '#f9f9f9', borderRadius: 8 }}>
              <p style={{ fontSize: 18, color: '#666' }}>
                No tienes solicitudes de Arduino aún
              </p>
              <p style={{ color: '#999' }}>
                Crea tu primera solicitud usando el botón "Kit Arduino"
              </p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha Solicitud</th>
                  <th>Curso</th>
                  <th>Fecha Uso</th>
                  <th>Kit Arduino</th>
                  <th>Proyecto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {arduinoRequests.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontSize: '0.85em', color: '#666' }}>{r.id.slice(0, 8)}...</td>
                    <td>{new Date(r.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td>{r.curso}</td>
                    <td>{new Date(r.fecha).toLocaleDateString()}</td>
                    <td>{r.kitArduino}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.temaProyecto}
                    </td>
                    <td>
                      <span className={`badge ${r.status.toLowerCase()}`}>
                        {r.status === 'PENDIENTE' && 'Pendiente'}
                        {r.status === 'APROBADA' && 'Aprobada'}
                        {r.status === 'RECHAZADA' && 'Rechazada'}
                      </span>
                      {r.status === 'RECHAZADA' && r.autorizacion?.razon && (
                        <div style={{ fontSize: '0.85em', color: '#dc3545', marginTop: 6, fontWeight: 500 }}>
                          Motivo: {r.autorizacion.razon}
                        </div>
                      )}
                      {r.status === 'APROBADA' && r.autorizacion?.razon && (
                        <div style={{ fontSize: '0.85em', color: '#28a745', marginTop: 6 }}>
                          Nota: {r.autorizacion.razon}
                        </div>
                      )}
                    </td>
                    <td>
                      <button className="small" onClick={() => openDetails(r, 'arduino')}>
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      <DetailsModal open={open} onClose={() => setOpen(false)} request={selected} type={modalType} />
    </div>
  )
}
