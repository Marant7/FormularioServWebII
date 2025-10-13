import React from 'react'
import { RequestItem } from '../App'

export default function DetailsModal({ open, onClose, request }: { open: boolean; onClose: () => void; request: RequestItem | null }) {
  if (!open || !request) return null

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Detalle de Solicitud</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            <div><strong>ID</strong><div>{request.id}</div></div>
            <div><strong>Docente</strong><div>{request.docenteResponsable}</div></div>
            <div><strong>Curso</strong><div>{request.curso}</div></div>
            <div><strong>Semestre</strong><div>{request.semestre}</div></div>
            <div><strong>Fecha</strong><div>{request.fecha}</div></div>
            <div><strong>Hora Entrada</strong><div>{request.horaEntrada}</div></div>
            <div><strong>Hora Salida</strong><div>{request.horaSalida}</div></div>
            <div><strong>Servidor</strong><div>{request.servidor}</div></div>
            <div><strong>Serie</strong><div>{request.serieServidor}</div></div>
            <div><strong>Tipo</strong><div>{request.tipoServidor}</div></div>
            <div style={{gridColumn: '1 / -1'}}><strong>Características</strong><div>{request.caracteristicas}</div></div>
            <div style={{gridColumn: '1 / -1'}}><strong>Integrantes</strong>
              <ul>
                {request.integrantes.map((it, i) => <li key={i}>{it}</li>)}
              </ul>
            </div>
            <div><strong>Incluir Monitor</strong><div>{request.incluirMonitor ? 'Sí' : 'No'}</div></div>
            <div><strong>Incluir Teclado</strong><div>{request.incluirTeclado ? 'Sí' : 'No'}</div></div>
            <div><strong>Incluir Mouse</strong><div>{request.incluirMouse ? 'Sí' : 'No'}</div></div>
            <div style={{gridColumn: '1 / -1'}}><strong>Soporte</strong><div>{request.soporte}</div></div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="small" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}
