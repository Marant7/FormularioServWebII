import React from 'react'

export default function Navbar({ 
  onNavigate, 
  userRole 
}: { 
  onNavigate: (v: 'nuevo' | 'nuevo-arduino' | 'autorizacion' | 'reportes' | 'inicio' | 'mis-solicitudes') => void
  userRole?: 'ESTUDIANTE' | 'SOPORTE' | 'METRICAS'
}) {
  return (
    <nav className="navbar">
      <div className="brand">
        Sistema de Préstamo de Servidores
      </div>
      <div className="nav-actions">
        {/* ESTUDIANTE: Solo puede crear y ver sus solicitudes */}
        {userRole === 'ESTUDIANTE' && (
          <>
            <button onClick={() => onNavigate('mis-solicitudes')}>
              Mis Solicitudes
            </button>
            <button onClick={() => onNavigate('nuevo')} className="primary">
              Nueva Solicitud - Servidor
            </button>
            <button onClick={() => onNavigate('nuevo-arduino')} className="primary">
              Nueva Solicitud - Kit Arduino
            </button>
          </>
        )}

        {/* SOPORTE: Solo puede autorizar solicitudes */}
        {userRole === 'SOPORTE' && (
          <button onClick={() => onNavigate('autorizacion')}>
            Autorización de Solicitudes
          </button>
        )}

        {/* METRICAS (Jefe): Solo puede ver reportes */}
        {userRole === 'METRICAS' && (
          <button onClick={() => onNavigate('reportes')}>
            Reportes y Estadísticas
          </button>
        )}
      </div>
    </nav>
  )
}
