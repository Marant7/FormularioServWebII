import React from 'react'
import { RequestItem } from '../App'

interface DetailsModalProps {
  open: boolean
  onClose: () => void
  request: RequestItem | any | null
  type?: 'servidor' | 'arduino'
}

export default function DetailsModal({ open, onClose, request, type = 'servidor' }: DetailsModalProps) {
  if (!open || !request) return null

  const isArduino = type === 'arduino' || request.kitArduino

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalles de la Solicitud {isArduino ? '- Kit Arduino' : '- Servidor'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <div className="modal-body">
          {/* Sección: Información General */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              marginBottom: '12px', 
              color: 'var(--text)',
              borderBottom: '2px solid var(--border)',
              paddingBottom: '8px'
            }}>
              Información General
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  ID de Solicitud
                </label>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                  {request.id?.slice(0, 12) || 'N/A'}...
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Estado
                </label>
                <span className={`badge ${request.status?.toLowerCase()}`}>
                  {request.status === 'PENDIENTE' && 'Pendiente'}
                  {request.status === 'APROBADA' && 'Aprobada'}
                  {request.status === 'RECHAZADA' && 'Rechazada'}
                </span>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Semestre
                </label>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                  {request.semestre || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Información Académica */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              marginBottom: '12px', 
              color: 'var(--text)',
              borderBottom: '2px solid var(--border)',
              paddingBottom: '8px'
            }}>
              Información Académica
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Docente Responsable
                </label>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                  {request.docenteResponsable || 'N/A'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Curso
                </label>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                  {request.curso || 'N/A'}
                </div>
              </div>
              {isArduino && request.temaProyecto && (
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Tema/Proyecto
                  </label>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                    {request.temaProyecto}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sección: Fecha y Horario */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              marginBottom: '12px', 
              color: 'var(--text)',
              borderBottom: '2px solid var(--border)',
              paddingBottom: '8px'
            }}>
              Fecha y Horario
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Fecha
                </label>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                  {request.fecha || 'N/A'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Hora de Entrada
                </label>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                  {request.horaEntrada || 'N/A'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Hora de Salida
                </label>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                  {request.horaSalida || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Sección específica para Arduino */}
          {isArduino ? (
            <>
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: 600, 
                  marginBottom: '12px', 
                  color: 'var(--text)',
                  borderBottom: '2px solid var(--border)',
                  paddingBottom: '8px'
                }}>
                  Información del Kit Arduino
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Kit Arduino
                    </label>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                      {request.kitArduino || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Estado del Kit
                    </label>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                      {request.estadoKit === 'completo' ? 'Kit Completo' : 'Elementos Específicos'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Componentes Incluidos - Solo para Arduino */}
              {request.componentesIncluidos && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ 
                    fontSize: '1rem', 
                    fontWeight: 600, 
                    marginBottom: '12px', 
                    color: 'var(--text)',
                    borderBottom: '2px solid var(--border)',
                    paddingBottom: '8px'
                  }}>
                    Componentes Seleccionados
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '8px' 
                  }}>
                    {Object.entries(request.componentesIncluidos).map(([key, value]: [string, any]) => {
                      if (value.incluido) {
                        const nombres: Record<string, string> = {
                          microcontroladorWifi: 'Módulo WiFi ESP8266',
                          microcontroladorPlaca: 'Arduino Uno R3',
                          prototipado: 'Protoboard 830 puntos',
                          sensorComunicacion: 'Módulo Bluetooth HC-05',
                          alimentacion: 'Fuente 9V',
                          sensorEntradaUsuario: 'Botones pulsadores',
                          sensorTemperatura: 'Sensor DHT11',
                          sensorInterruptor: 'Sensor Reed',
                          sensorLuz: 'Fotoresistencia LDR',
                          sensorAjusteAnalogico: 'Potenciómetro 10k',
                          controladorLED: 'LEDs RGB',
                          registroDesplazamiento: '74HC595',
                          resistencia: 'Set de resistencias'
                        }
                        return (
                          <div key={key} style={{ 
                            padding: '10px 12px',
                            background: '#f0fdf4',
                            border: '1px solid #86efac',
                            borderRadius: '6px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.875rem'
                          }}>
                            <span style={{ color: '#065f46', fontWeight: 500 }}>
                              ✓ {nombres[key] || key}
                            </span>
                            <span style={{ 
                              background: '#dcfce7', 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#166534'
                            }}>
                              x{value.cantidad}
                            </span>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              )}

              {/* Responsable */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: 600, 
                  marginBottom: '12px', 
                  color: 'var(--text)',
                  borderBottom: '2px solid var(--border)',
                  paddingBottom: '8px'
                }}>
                  Responsable
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Código
                    </label>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                      {request.codigoResponsable || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Nombre
                    </label>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                      {request.nombreResponsable || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Sección: Información del Servidor */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: 600, 
                  marginBottom: '12px', 
                  color: 'var(--text)',
                  borderBottom: '2px solid var(--border)',
                  paddingBottom: '8px'
                }}>
                  Información del Servidor
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Nombre del Servidor
                    </label>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                      {request.servidor || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Serie del Servidor
                    </label>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                      {request.serieServidor || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Tipo
                    </label>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                      {request.tipoServidor || 'N/A'}
                    </div>
                  </div>
                </div>
                {request.caracteristicas && (
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Características
                    </label>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--text)', 
                      background: 'var(--bg)', 
                      padding: '12px', 
                      borderRadius: '6px',
                      border: '1px solid var(--border)'
                    }}>
                      {request.caracteristicas}
                    </div>
                  </div>
                )}
              </div>

              {/* Sección: Accesorios */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: 600, 
                  marginBottom: '12px', 
                  color: 'var(--text)',
                  borderBottom: '2px solid var(--border)',
                  paddingBottom: '8px'
                }}>
                  Accesorios Solicitados
                </h4>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    background: request.incluirMonitor ? '#d1fae5' : 'var(--bg)',
                    border: `1px solid ${request.incluirMonitor ? '#10b981' : 'var(--border)'}`,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: request.incluirMonitor ? '#065f46' : 'var(--text-light)'
                  }}>
                    {request.incluirMonitor ? '✓' : '✗'} Monitor
                  </div>
                  <div style={{ 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    background: request.incluirTeclado ? '#d1fae5' : 'var(--bg)',
                    border: `1px solid ${request.incluirTeclado ? '#10b981' : 'var(--border)'}`,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: request.incluirTeclado ? '#065f46' : 'var(--text-light)'
                  }}>
                    {request.incluirTeclado ? '✓' : '✗'} Teclado
                  </div>
                  <div style={{ 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    background: request.incluirMouse ? '#d1fae5' : 'var(--bg)',
                    border: `1px solid ${request.incluirMouse ? '#10b981' : 'var(--border)'}`,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: request.incluirMouse ? '#065f46' : 'var(--text-light)'
                  }}>
                    {request.incluirMouse ? '✓' : '✗'} Mouse
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Sección: Integrantes */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              marginBottom: '12px', 
              color: 'var(--text)',
              borderBottom: '2px solid var(--border)',
              paddingBottom: '8px'
            }}>
              Integrantes del Grupo
            </h4>
            <div style={{ 
              background: 'var(--bg)', 
              padding: '12px', 
              borderRadius: '6px',
              border: '1px solid var(--border)'
            }}>
              {request.integrantes && request.integrantes.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--text)' }}>
                  {request.integrantes.map((integrante: any, i: number) => (
                    <li key={i} style={{ marginBottom: '4px' }}>
                      {typeof integrante === 'string' 
                        ? integrante 
                        : `${integrante.codigo || ''} - ${integrante.nombre || integrante.rol || JSON.stringify(integrante)}`
                      }
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-light)' }}>
                  Sin integrantes registrados
                </p>
              )}
            </div>
          </div>

          {/* Sección: Información de Soporte */}
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              marginBottom: '12px', 
              color: 'var(--text)',
              borderBottom: '2px solid var(--border)',
              paddingBottom: '8px'
            }}>
              Información Adicional
            </h4>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                {isArduino ? 'Personal de Soporte' : 'Tipo de Soporte'}
              </label>
              <div style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text)', 
                background: 'var(--bg)', 
                padding: '12px', 
                borderRadius: '6px',
                border: '1px solid var(--border)'
              }}>
                {request.soporte || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
