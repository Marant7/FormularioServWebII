import React, { useMemo, useState, useRef } from 'react'
import { RequestItem } from '../App'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const COLORS = {
  PENDIENTE: '#f59e0b',
  APROBADA: '#10b981',
  RECHAZADA: '#ef4444'
}

export default function Reports({ requests, arduinoRequests }: { requests: RequestItem[], arduinoRequests: any[] }) {
  const [historialTab, setHistorialTab] = useState<'servidores' | 'arduino'>('servidores')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroSemestre, setFiltroSemestre] = useState('')
  const [exportando, setExportando] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // Filtrar solicitudes por búsqueda y semestre PRIMERO
  const requestsFiltrados = useMemo(() => {
    return requests.filter(r => {
      const matchSearch = searchTerm === '' || 
        r.docenteResponsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.servidor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.estudiante?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchSemestre = filtroSemestre === '' || r.semestre === filtroSemestre
      
      return matchSearch && matchSemestre
    })
  }, [requests, searchTerm, filtroSemestre])

  const arduinoRequestsFiltrados = useMemo(() => {
    return arduinoRequests.filter(r => {
      const matchSearch = searchTerm === '' || 
        r.docenteResponsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.curso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.kitArduino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.temaProyecto?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchSemestre = filtroSemestre === '' || r.semestre === filtroSemestre
      
      return matchSearch && matchSemestre
    })
  }, [arduinoRequests, searchTerm, filtroSemestre])

  // Estadísticas generales de SERVIDORES (usando datos filtrados)
  const stats = useMemo(() => {
    const total = requestsFiltrados.length
    const pendientes = requestsFiltrados.filter((r) => r.status === 'PENDIENTE').length
    const aprobadas = requestsFiltrados.filter((r) => r.status === 'APROBADA').length
    const rechazadas = requestsFiltrados.filter((r) => r.status === 'RECHAZADA').length
    return { total, pendientes, aprobadas, rechazadas }
  }, [requestsFiltrados])

  // Estadísticas generales de ARDUINO (usando datos filtrados)
  const statsArduino = useMemo(() => {
    const total = arduinoRequestsFiltrados.length
    const pendientes = arduinoRequestsFiltrados.filter((r) => r.status === 'PENDIENTE').length
    const aprobadas = arduinoRequestsFiltrados.filter((r) => r.status === 'APROBADA').length
    const rechazadas = arduinoRequestsFiltrados.filter((r) => r.status === 'RECHAZADA').length
    return { total, pendientes, aprobadas, rechazadas }
  }, [arduinoRequestsFiltrados])

  // Datos para gráfico de torta - Estados (dinámico según pestaña)
  const pieData = useMemo(() => {
    const statsActual = historialTab === 'servidores' ? stats : statsArduino
    return [
      { name: 'Pendientes', value: statsActual.pendientes, color: COLORS.PENDIENTE },
      { name: 'Aprobadas', value: statsActual.aprobadas, color: COLORS.APROBADA },
      { name: 'Rechazadas', value: statsActual.rechazadas, color: COLORS.RECHAZADA }
    ].filter(item => item.value > 0)
  }, [stats, statsArduino, historialTab])

  // Servidores más solicitados (usando datos filtrados)
  const servidoresMasSolicitados = useMemo(() => {
    const counts: Record<string, number> = {}
    requestsFiltrados.forEach(r => {
      counts[r.servidor] = (counts[r.servidor] || 0) + 1
    })
    return Object.entries(counts)
      .map(([servidor, cantidad]) => ({ servidor, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
  }, [requestsFiltrados])

  // Kits Arduino más solicitados (usando datos filtrados)
  const kitsMasSolicitados = useMemo(() => {
    const counts: Record<string, number> = {}
    arduinoRequestsFiltrados.forEach(r => {
      counts[r.kitArduino] = (counts[r.kitArduino] || 0) + 1
    })
    return Object.entries(counts)
      .map(([kit, cantidad]) => ({ kit, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
  }, [arduinoRequestsFiltrados])

  // Solicitudes por semestre (dinámico según pestaña)
  const porSemestre = useMemo(() => {
    const counts: Record<string, number> = {}
    const datosActuales = historialTab === 'servidores' ? requestsFiltrados : arduinoRequestsFiltrados
    datosActuales.forEach(r => {
      counts[r.semestre] = (counts[r.semestre] || 0) + 1
    })
    return Object.entries(counts)
      .map(([semestre, cantidad]) => ({ semestre, cantidad }))
      .sort((a, b) => a.semestre.localeCompare(b.semestre))
  }, [requestsFiltrados, arduinoRequestsFiltrados, historialTab])

  // Semestres únicos para el filtro
  const semestresUnicos = useMemo(() => {
    const semestres = new Set([
      ...requests.map(r => r.semestre),
      ...arduinoRequests.map(r => r.semestre)
    ])
    return Array.from(semestres).filter(Boolean).sort().reverse()
  }, [requests, arduinoRequests])

  // Función para exportar a PDF
  const exportarPDF = async () => {
    if (!reportRef.current) return
    
    setExportando(true)
    
    try {
      // Capturar el contenido del reporte
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      
      // Agregar primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      // Agregar páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // Generar nombre del archivo con fecha y filtros
      const fecha = new Date().toISOString().split('T')[0]
      const filtro = filtroSemestre ? `_${filtroSemestre}` : ''
      const tipo = historialTab === 'servidores' ? 'Servidores' : 'Arduino'
      const nombreArchivo = `Reporte_${tipo}${filtro}_${fecha}.pdf`
      
      pdf.save(nombreArchivo)
      alert('✅ Reporte exportado exitosamente')
    } catch (error) {
      console.error('Error al exportar PDF:', error)
      alert('❌ Error al exportar el reporte')
    } finally {
      setExportando(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Reportes y Métricas</h2>
        <button 
          onClick={exportarPDF}
          disabled={exportando}
          className="primary"
          style={{ 
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.95rem'
          }}
        >
          {exportando ? (
            <>⏳ Generando PDF...</>
          ) : (
            <>📄 Exportar a PDF</>
          )}
        </button>
      </div>

      {/* Historial Completo de Solicitudes - ARRIBA */}
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)', margin: 0 }}>
            Historial Completo de Solicitudes
          </h3>
        </div>

        {/* Buscador y Filtros - FUERA del PDF */}
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          marginBottom: 16, 
          flexWrap: 'wrap',
          background: 'var(--bg)',
          padding: 16,
          borderRadius: 8,
          border: '1px solid var(--border)'
        }}>
          <input
            type="text"
            placeholder="Buscar por docente, curso, servidor, estudiante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1, 
              minWidth: 250,
              padding: '10px 14px',
              fontSize: '0.95rem'
            }}
          />
          <select
            value={filtroSemestre}
            onChange={(e) => setFiltroSemestre(e.target.value)}
            style={{ 
              padding: '10px 14px',
              fontSize: '0.95rem',
              minWidth: 150
            }}
          >
            <option value="">Todos los semestres</option>
            {semestresUnicos.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
          {(searchTerm || filtroSemestre) && (
            <button 
              onClick={() => { setSearchTerm(''); setFiltroSemestre(''); }}
              className="small"
              style={{ whiteSpace: 'nowrap' }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button 
            className={historialTab === 'servidores' ? 'primary' : ''}
            onClick={() => setHistorialTab('servidores')}
            style={{ padding: '10px 20px' }}
          >
            Servidores ({requestsFiltrados.length})
          </button>
          <button 
            className={historialTab === 'arduino' ? 'primary' : ''}
            onClick={() => setHistorialTab('arduino')}
            style={{ padding: '10px 20px' }}
          >
            Kits Arduino ({arduinoRequestsFiltrados.length})
          </button>
        </div>

        {/* Tabla de Servidores */}
        {historialTab === 'servidores' && (
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Docente</th>
                <th>Curso</th>
                <th>Semestre</th>
                <th>Servidor</th>
                <th>Estudiante</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {requestsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                    {searchTerm || filtroSemestre ? 'No se encontraron solicitudes con los filtros aplicados' : 'No hay solicitudes registradas'}
                  </td>
                </tr>
              ) : (
                requestsFiltrados.map((r) => (
                  <tr key={r.id}>
                    <td>{r.fecha}</td>
                    <td>{r.docenteResponsable}</td>
                    <td>{r.curso}</td>
                    <td>{r.semestre}</td>
                    <td>{r.servidor}</td>
                    <td>{r.estudiante?.nombre || 'N/A'}</td>
                    <td>
                      <span className={`badge ${r.status.toLowerCase()}`}>
                        {r.status === 'PENDIENTE' ? 'Pendiente' : r.status === 'APROBADA' ? 'Aprobada' : 'Rechazada'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Tabla de Arduino */}
        {historialTab === 'arduino' && (
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Docente</th>
                <th>Curso</th>
                <th>Semestre</th>
                <th>Kit Arduino</th>
                <th>Proyecto</th>
                <th>Responsable</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {arduinoRequestsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                    {searchTerm || filtroSemestre ? 'No se encontraron solicitudes con los filtros aplicados' : 'No hay solicitudes registradas'}
                  </td>
                </tr>
              ) : (
                arduinoRequestsFiltrados.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.fecha).toLocaleDateString()}</td>
                    <td>{r.docenteResponsable}</td>
                    <td>{r.curso}</td>
                    <td>{r.semestre}</td>
                    <td>{r.kitArduino}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.temaProyecto}
                    </td>
                    <td>{r.nombreResponsable}</td>
                    <td>
                      <span className={`badge ${r.status?.toLowerCase()}`}>
                        {r.status === 'PENDIENTE' ? 'Pendiente' : r.status === 'APROBADA' ? 'Aprobada' : 'Rechazada'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Contenido para PDF - Empieza aquí */}
      <div ref={reportRef} style={{ background: '#fff', padding: '20px' }}>
        
        {/* Título del Reporte */}
        <div style={{ marginBottom: 24, borderBottom: '3px solid var(--accent)', paddingBottom: 12 }}>
          <h2 style={{ margin: 0, color: 'var(--accent)' }}>
            Reporte de {historialTab === 'servidores' ? 'Servidores' : 'Kits Arduino'}
          </h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>
            Generado: {new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
            {filtroSemestre && ` | Semestre: ${filtroSemestre}`}
          </p>
        </div>

      {/* Stats Cards - SERVIDORES */}
      {historialTab === 'servidores' && (
        <>
          <h3 style={{ marginTop: 24, marginBottom: 12, fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>
            Estadísticas de Servidores
          </h3>
          <div className="stats">
        <div className="stat">
          <strong>{stats.total}</strong>
          <div>Total de Solicitudes</div>
        </div>
        <div className="stat">
          <strong style={{ color: COLORS.PENDIENTE }}>{stats.pendientes}</strong>
          <div>Pendientes</div>
        </div>
        <div className="stat">
          <strong style={{ color: COLORS.APROBADA }}>{stats.aprobadas}</strong>
          <div>Aprobadas</div>
        </div>
        <div className="stat">
          <strong style={{ color: COLORS.RECHAZADA }}>{stats.rechazadas}</strong>
          <div>Rechazadas</div>
        </div>
      </div>
        </>
      )}

      {/* Stats Cards - ARDUINO */}
      {historialTab === 'arduino' && (
        <>
          <h3 style={{ marginTop: 24, marginBottom: 12, fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>
            Estadísticas de Kits Arduino
          </h3>
          <div className="stats">
        <div className="stat">
          <strong>{statsArduino.total}</strong>
          <div>Total de Solicitudes</div>
        </div>
        <div className="stat">
          <strong style={{ color: COLORS.PENDIENTE }}>{statsArduino.pendientes}</strong>
          <div>Pendientes</div>
        </div>
        <div className="stat">
          <strong style={{ color: COLORS.APROBADA }}>{statsArduino.aprobadas}</strong>
          <div>Aprobadas</div>
        </div>
        <div className="stat">
          <strong style={{ color: COLORS.RECHAZADA }}>{statsArduino.rechazadas}</strong>
          <div>Rechazadas</div>
        </div>
      </div>
        </>
      )}

      {/* Gráficos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px' 
      }}>
        {/* Gráfico de Torta - Estados */}
        <div style={{ 
          background: 'var(--card)', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', fontWeight: 600 }}>
            Distribución por Estado
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => {
                    const totalActual = historialTab === 'servidores' ? stats.total : statsArduino.total
                    return `${entry.name}: ${((entry.value / totalActual) * 100).toFixed(0)}%`
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px' }}>
              No hay datos para mostrar
            </p>
          )}
        </div>

        {/* Gráfico de Barras - Servidores o Kits más solicitados */}
        <div style={{ 
          background: 'var(--card)', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', fontWeight: 600 }}>
            {historialTab === 'servidores' ? 'Servidores Más Solicitados' : 'Kits Arduino Más Solicitados'}
          </h3>
          {((historialTab === 'servidores' && servidoresMasSolicitados.length > 0) || 
            (historialTab === 'arduino' && kitsMasSolicitados.length > 0)) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={historialTab === 'servidores' ? servidoresMasSolicitados : kitsMasSolicitados}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey={historialTab === 'servidores' ? 'servidor' : 'kit'} tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="var(--accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px' }}>
              No hay datos para mostrar
            </p>
          )}
        </div>
      </div>

      {/* Gráfico de Barras - Por Semestre */}
      {porSemestre.length > 0 && (
        <div style={{ 
          background: 'var(--card)', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          marginBottom: '32px'
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', fontWeight: 600 }}>
            Solicitudes por Semestre
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={porSemestre}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="semestre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#6366f1" name="Solicitudes" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      </div> {/* Fin del contenido para PDF */}
    </div>
  )
}
