import React, { useEffect, useState } from 'react'

type ServerOption = {
  id: string
  name: string
  serie: string
  tipo: string
  caracteristicas: string
}

type FormState = {
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
  integrantes: Array<{ codigo: string; nombre: string; rol: 'Estudiante' | 'Docente' }>
  soporte: string
}

const SERVERS: ServerOption[] = [
  { id: 'server1', name: 'Server1', serie: 'ABC123', tipo: 'Torre', caracteristicas: '8CPU, 16GB RAM' },
  { id: 'server2', name: 'Server2', serie: 'wdeew45', tipo: 'Rack', caracteristicas: '16CPU, 32GB RAM' },
  { id: 'server3', name: 'Server3', serie: 'SRV-999', tipo: 'Blade', caracteristicas: '24CPU, 64GB RAM' }
]

export default function RequestForm({ onCreate }: { onCreate?: (data: any) => void }) {
  const [form, setForm] = useState<FormState>({
    docenteResponsable: '',
    curso: 'Redes I',
    semestre: '2025-II',
    fecha: '',
    horaEntrada: '',
    horaSalida: '',
    servidor: SERVERS[0].id,
    serieServidor: SERVERS[0].serie,
    tipoServidor: SERVERS[0].tipo,
    caracteristicas: SERVERS[0].caracteristicas,
    incluirMonitor: false,
    incluirTeclado: false,
    incluirMouse: false,
    codigoResponsable: '',
    nombreResponsable: '',
    integrantes: [],
    soporte: ''
  })

  const [newCodigo, setNewCodigo] = useState('')
  const [newNombre, setNewNombre] = useState('')
  const [newRol, setNewRol] = useState<'Estudiante' | 'Docente'>('Estudiante')
  const [errors, setErrors] = useState<string[]>([])
  const [submittedData, setSubmittedData] = useState<FormState | null>(null)

  useEffect(() => {
    const s = SERVERS.find((x) => x.id === form.servidor)
    if (s) {
      setForm((prev) => ({ ...prev, serieServidor: s.serie, tipoServidor: s.tipo, caracteristicas: s.caracteristicas }))
    }
  }, [form.servidor])

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function addIntegrante() {
    const codigo = newCodigo.trim()
    const nombre = newNombre.trim()
    if (!codigo || !nombre) return
    setForm((prev) => ({ ...prev, integrantes: [...prev.integrantes, { codigo, nombre, rol: newRol }] }))
    setNewCodigo('')
    setNewNombre('')
    setNewRol('Estudiante')
  }

  function removeIntegrante(index: number) {
    setForm((prev) => ({ ...prev, integrantes: prev.integrantes.filter((_, i) => i !== index) }))
  }

  function updateIntegrante(index: number, field: 'codigo' | 'nombre' | 'rol', value: string) {
    setForm((prev) => {
      const list = [...prev.integrantes]
      // @ts-ignore
      list[index] = { ...list[index], [field]: value }
      return { ...prev, integrantes: list }
    })
  }

  function validate() {
    const e: string[] = []
    if (!form.docenteResponsable.trim()) e.push('Docente Responsable es requerido')
    if (!form.curso.trim()) e.push('Curso es requerido')
    if (!form.fecha) e.push('Fecha es requerida')
    if (!form.horaEntrada) e.push('Hora de entrada es requerida')
    if (!form.horaSalida) e.push('Hora de salida es requerida')
    if (form.horaEntrada && form.horaSalida && form.horaEntrada >= form.horaSalida) e.push('La hora de entrada debe ser menor que la hora de salida')
    return e
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (v.length === 0) {
      // Simular envío: almacenar localmente
      setSubmittedData(form)
      if (onCreate) {
        onCreate(form)
      }
      // Limpiamos errores
      setErrors([])
    } else {
      setSubmittedData(null)
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="row">
        <label>Docente Responsable:</label>
        <input value={form.docenteResponsable} onChange={(e) => handleChange('docenteResponsable', e.target.value)} />
        <label>Curso:</label>
        <input value={form.curso} onChange={(e) => handleChange('curso', e.target.value)} />
      </div>

      <div className="row">
        <label>Semestre Académico:</label>
        <select value={form.semestre} onChange={(e) => handleChange('semestre', e.target.value)}>
          <option>2025-II</option>
          <option>2025-I</option>
          <option>2024-II</option>
        </select>

        <label>Fecha:</label>
        <input type="date" value={form.fecha} onChange={(e) => handleChange('fecha', e.target.value)} />
      </div>

      <div className="row">
        <label>Hora de entrada:</label>
        <input type="time" value={form.horaEntrada} onChange={(e) => handleChange('horaEntrada', e.target.value)} />
        <label>Hora de salida:</label>
        <input type="time" value={form.horaSalida} onChange={(e) => handleChange('horaSalida', e.target.value)} />
      </div>

      <div className="row">
        <label>Servidor:</label>
        <select value={form.servidor} onChange={(e) => handleChange('servidor', e.target.value)}>
          {SERVERS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <label>Serie del servidor:</label>
        <input value={form.serieServidor} readOnly />
      </div>

      <div className="row">
        <label>Tipo de Servidor:</label>
        <input value={form.tipoServidor} readOnly />
        <label>Características:</label>
        <input value={form.caracteristicas} readOnly />
      </div>

      <div className="row">
        <label>Incluir:</label>
        <label><input type="checkbox" checked={form.incluirMonitor} onChange={(e) => handleChange('incluirMonitor', e.target.checked)} /> Monitor</label>
        <label><input type="checkbox" checked={form.incluirTeclado} onChange={(e) => handleChange('incluirTeclado', e.target.checked)} /> Teclado</label>
        <label><input type="checkbox" checked={form.incluirMouse} onChange={(e) => handleChange('incluirMouse', e.target.checked)} /> Mouse</label>
      </div>

      <div className="row">
        <label>Código del Responsable:</label>
        <input value={form.codigoResponsable} onChange={(e) => handleChange('codigoResponsable', e.target.value)} />
        <label>Nombre del Responsable:</label>
        <input value={form.nombreResponsable} onChange={(e) => handleChange('nombreResponsable', e.target.value)} />
      </div>

      <div className="row vertical">
        <label>Integrantes del Grupo:</label>
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <input placeholder="Código" value={newCodigo} onChange={(e) => setNewCodigo(e.target.value)} style={{width:120}} />
          <input placeholder="Nombre" value={newNombre} onChange={(e) => setNewNombre(e.target.value)} />
          <select value={newRol} onChange={(e) => setNewRol(e.target.value as any)} style={{width:140}}>
            <option>Estudiante</option>
            <option>Docente</option>
          </select>
          <button type="button" className="small" onClick={addIntegrante}>Agregar integrante</button>
        </div>

        <div style={{ marginTop: 8, width: '100%' }}>
          {form.integrantes.map((it, i) => (
            <div key={i} style={{ background:'#fbfbfb', padding:10, borderRadius:6, marginBottom:8, display:'grid', gridTemplateColumns:'120px 1fr 140px 90px', gap:8, alignItems:'center' }}>
              <input value={it.codigo} onChange={(e) => updateIntegrante(i, 'codigo', e.target.value)} />
              <input value={it.nombre} onChange={(e) => updateIntegrante(i, 'nombre', e.target.value)} />
              <select value={it.rol} onChange={(e) => updateIntegrante(i, 'rol', e.target.value)}>
                <option>Estudiante</option>
                <option>Docente</option>
              </select>
              <button type="button" className="small danger" onClick={() => removeIntegrante(i)}>Eliminar</button>
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        <label>Personal de Soporte:</label>
        <select value={form.soporte} onChange={(e) => handleChange('soporte', e.target.value)}>
          <option value="">-- Seleccionar --</option>
          <option>Teli Casilla Maquera</option>
          <option>Soporte 2</option>
        </select>
      </div>

      <div className="actions">
        <button type="submit" className="primary">Enviar Solicitud</button>
        <button type="button" onClick={() => window.location.reload()}>Volver al Inicio</button>
      </div>

      {errors.length > 0 && (
        <div className="errors">
          <strong>Errores:</strong>
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {submittedData && (
        <div className="success">
          <h3>Solicitud preparada (simulada)</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </form>
  )
}
