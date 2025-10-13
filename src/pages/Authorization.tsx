import React, { useState } from 'react'
import { RequestItem } from '../App'
import DetailsModal from '../components/DetailsModal'

export default function Authorization({ requests, onApprove, onReject }: { requests: RequestItem[]; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  const [selected, setSelected] = useState<RequestItem | null>(null)
  const [open, setOpen] = useState(false)

  const total = requests.length
  const pendientes = requests.filter((r) => r.status === 'Pendiente').length
  const aprobadas = requests.filter((r) => r.status === 'Aprobada').length
  const rechazadas = requests.filter((r) => r.status === 'Rechazada').length

  function openDetails(r: RequestItem) {
    setSelected(r)
    setOpen(true)
  }

  return (
    <div>
      <h2>Autorización de Solicitudes</h2>
      <div className="stats">
        <div className="stat"> <strong>{total}</strong> <div>Total de Solicitudes</div> </div>
        <div className="stat"> <strong>{pendientes}</strong> <div>Solicitudes Pendientes</div> </div>
        <div className="stat"> <strong>{aprobadas}</strong> <div>Solicitudes Aprobadas</div> </div>
        <div className="stat"> <strong>{rechazadas}</strong> <div>Solicitudes Rechazadas</div> </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Docente</th>
            <th>Curso</th>
            <th>Semestre</th>
            <th>Fecha</th>
            <th>Servidor</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.docenteResponsable}</td>
              <td>{r.curso}</td>
              <td>{r.semestre}</td>
              <td>{r.fecha}</td>
              <td>{r.servidor}</td>
              <td><span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span></td>
              <td>
                <button className="small" onClick={() => openDetails(r)}>Detalles</button>
                {r.status === 'Pendiente' && (
                  <>
                    <button className="small primary" onClick={() => onApprove(r.id)}>Aprobar</button>
                    <button className="small danger" onClick={() => onReject(r.id)}>Rechazar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DetailsModal open={open} onClose={() => setOpen(false)} request={selected} />
    </div>
  )
}
