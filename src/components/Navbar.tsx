import React from 'react'

export default function Navbar({ onNavigate }: { onNavigate: (v: 'nuevo' | 'autorizacion' | 'reportes' | 'inicio') => void }) {
  return (
    <nav className="navbar">
      <div className="brand">Préstamo de Servidores</div>
      <div className="nav-actions">
        <button onClick={() => onNavigate('inicio')}>Inicio</button>
        <button onClick={() => onNavigate('nuevo')}>Nuevo Préstamo</button>
        <button onClick={() => onNavigate('autorizacion')}>Autorización</button>
        <button onClick={() => onNavigate('reportes')}>Reportes</button>
      </div>
    </nav>
  )
}
