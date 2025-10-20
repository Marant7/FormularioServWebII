import React, { useState } from 'react'

interface ArduinoKitFormData {
  docenteResponsable: string
  curso: string
  semestre: string
  temaProyecto: string
  fecha: string
  horaEntrada: string
  horaSalida: string
  kitArduino: string
  estadoKit: 'completo' | 'especifico'
  componentesIncluidos: {
    microcontroladorWifi: { incluido: boolean; cantidad: number }
    microcontroladorPlaca: { incluido: boolean; cantidad: number }
    prototipado: { incluido: boolean; cantidad: number }
    sensorComunicacion: { incluido: boolean; cantidad: number }
    alimentacion: { incluido: boolean; cantidad: number }
    sensorEntradaUsuario: { incluido: boolean; cantidad: number }
    sensorTemperatura: { incluido: boolean; cantidad: number }
    sensorInterruptor: { incluido: boolean; cantidad: number }
    sensorLuz: { incluido: boolean; cantidad: number }
    sensorAjusteAnalogico: { incluido: boolean; cantidad: number }
    controladorLED: { incluido: boolean; cantidad: number }
    registroDesplazamiento: { incluido: boolean; cantidad: number }
    resistencia: { incluido: boolean; cantidad: number }
  }
  codigoResponsable: string
  nombreResponsable: string
  integrantes: string[]
  soporte: string
}

const kitsDisponibles = [
  { nombre: 'Kit Arduino Uno R3-2' },
  { nombre: 'Kit Arduino Uno R3-3' },
  { nombre: 'Kit Arduino Uno R3-4' }
]

const personalSoporte = [
  'Soporte Técnico 1',
  'Soporte Técnico 2',
  'Soporte Técnico 3'
]

export default function ArduinoKitForm({ onCreate }: { onCreate: (data: any) => void }) {
  const [formData, setFormData] = useState<ArduinoKitFormData>({
    docenteResponsable: '',
    curso: '',
    semestre: '2025-II',  // Por defecto 2025-II
    temaProyecto: '',
    fecha: '',
    horaEntrada: '',
    horaSalida: '',
    kitArduino: '',
    estadoKit: 'especifico',  // Por defecto específico (no marcar todos)
    componentesIncluidos: {
      microcontroladorWifi: { incluido: false, cantidad: 1 },
      microcontroladorPlaca: { incluido: false, cantidad: 1 },
      prototipado: { incluido: false, cantidad: 1 },
      sensorComunicacion: { incluido: false, cantidad: 1 },
      alimentacion: { incluido: false, cantidad: 1 },
      sensorEntradaUsuario: { incluido: false, cantidad: 1 },
      sensorTemperatura: { incluido: false, cantidad: 1 },
      sensorInterruptor: { incluido: false, cantidad: 1 },
      sensorLuz: { incluido: false, cantidad: 1 },
      sensorAjusteAnalogico: { incluido: false, cantidad: 1 },
      controladorLED: { incluido: false, cantidad: 1 },
      registroDesplazamiento: { incluido: false, cantidad: 1 },
      resistencia: { incluido: false, cantidad: 1 }
    },
    codigoResponsable: '',
    nombreResponsable: '',
    integrantes: [],
    soporte: ''
  })

  const [nuevoIntegrante, setNuevoIntegrante] = useState('')
  const [codigoIntegrante, setCodigoIntegrante] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEstadoKitChange = (estado: 'completo' | 'especifico') => {
    setFormData({ ...formData, estadoKit: estado })
    
    // Si es completo, marcar todos los componentes
    if (estado === 'completo') {
      const todosIncluidos = Object.keys(formData.componentesIncluidos).reduce((acc, key) => {
        acc[key] = { incluido: true, cantidad: 1 }
        return acc
      }, {} as any)
      setFormData(prev => ({ ...prev, componentesIncluidos: todosIncluidos }))
    }
  }

  const handleComponenteToggle = (componente: string) => {
    const currentValue = formData.componentesIncluidos[componente as keyof typeof formData.componentesIncluidos]
    setFormData({
      ...formData,
      componentesIncluidos: {
        ...formData.componentesIncluidos,
        [componente]: {
          incluido: !currentValue.incluido,
          cantidad: !currentValue.incluido ? 1 : currentValue.cantidad
        }
      }
    })
  }

  const handleCantidadChange = (componente: string, cantidad: number) => {
    if (cantidad < 1) cantidad = 1
    setFormData({
      ...formData,
      componentesIncluidos: {
        ...formData.componentesIncluidos,
        [componente]: {
          ...formData.componentesIncluidos[componente as keyof typeof formData.componentesIncluidos],
          cantidad
        }
      }
    })
  }

  const agregarIntegrante = () => {
    if (nuevoIntegrante.trim() && codigoIntegrante.trim()) {
      setFormData({ 
        ...formData, 
        integrantes: [...formData.integrantes, `${codigoIntegrante} - ${nuevoIntegrante}`] 
      })
      setNuevoIntegrante('')
      setCodigoIntegrante('')
    } else {
      alert('Complete el código y nombre del integrante')
    }
  }

  const eliminarIntegrante = (index: number) => {
    setFormData({
      ...formData,
      integrantes: formData.integrantes.filter((_, i) => i !== index)
    })
  }

  const validarFormulario = (): string[] => {
    const errores: string[] = []
    
    if (!formData.docenteResponsable.trim()) errores.push('Docente Responsable es requerido')
    if (!formData.curso.trim()) errores.push('Curso es requerido')
    if (!formData.temaProyecto.trim()) errores.push('Tema del Proyecto es requerido')
    if (!formData.fecha) errores.push('Fecha es requerida')
    
    // Validar que la fecha no sea pasada
    if (formData.fecha) {
      const fechaSeleccionada = new Date(formData.fecha)
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      
      if (fechaSeleccionada < hoy) {
        errores.push('La fecha no puede ser anterior a hoy')
      }
      
      // Validar que no sea mayor a 6 meses
      const seisMesesAdelante = new Date()
      seisMesesAdelante.setMonth(seisMesesAdelante.getMonth() + 6)
      
      if (fechaSeleccionada > seisMesesAdelante) {
        errores.push('La fecha no puede ser mayor a 6 meses en adelante')
      }
    }
    
    if (!formData.horaEntrada) errores.push('Hora de entrada es requerida')
    if (!formData.horaSalida) errores.push('Hora de salida es requerida')
    
    // Validar horas si es hoy
    if (formData.fecha && formData.horaEntrada) {
      const fechaSeleccionada = new Date(formData.fecha)
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      
      if (fechaSeleccionada.getTime() === hoy.getTime()) {
        const ahora = new Date()
        const [horaEntrada, minEntrada] = formData.horaEntrada.split(':').map(Number)
        const horaEntradaDate = new Date()
        horaEntradaDate.setHours(horaEntrada, minEntrada, 0, 0)
        
        if (horaEntradaDate < ahora) {
          errores.push('La hora de entrada no puede ser anterior a la hora actual')
        }
      }
    }
    
    if (formData.horaEntrada && formData.horaSalida && formData.horaEntrada >= formData.horaSalida) {
      errores.push('La hora de entrada debe ser menor que la hora de salida')
    }
    
    if (!formData.kitArduino) errores.push('Debe seleccionar un Kit Arduino')
    if (!formData.codigoResponsable.trim()) errores.push('Código del Responsable es requerido')
    if (!formData.nombreResponsable.trim()) errores.push('Nombre del Responsable es requerido')
    if (!formData.soporte) errores.push('Debe seleccionar Personal de Soporte')
    
    return errores
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const errores = validarFormulario()
    
    if (errores.length > 0) {
      alert('❌ Errores en el formulario:\n\n' + errores.join('\n'))
      return
    }
    
    onCreate(formData)
  }

  const ComponenteCheckbox = ({ 
    nombre, 
    label, 
    componente 
  }: { 
    nombre: string
    label: string
    componente: keyof typeof formData.componentesIncluidos 
  }) => {
    const data = formData.componentesIncluidos[componente]
    const disabled = formData.estadoKit === 'completo'
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        padding: '12px',
        background: data.incluido ? '#f0fdf4' : 'var(--bg)',
        border: `1px solid ${data.incluido ? '#86efac' : 'var(--border)'}`,
        borderRadius: '6px',
        marginBottom: '8px'
      }}>
        <input
          type="checkbox"
          checked={data.incluido}
          onChange={() => !disabled && handleComponenteToggle(componente)}
          disabled={disabled}
          style={{ width: '18px', height: '18px', cursor: disabled ? 'not-allowed' : 'pointer' }}
        />
        <label style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>
          {label}
        </label>
        {data.incluido && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleCantidadChange(componente, data.cantidad - 1)}
              disabled={disabled}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                background: 'white',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              -
            </button>
            <span style={{ 
              minWidth: '40px', 
              textAlign: 'center', 
              fontWeight: 600,
              fontSize: '0.875rem' 
            }}>
              {data.cantidad}
            </span>
            <button
              type="button"
              onClick={() => handleCantidadChange(componente, data.cantidad + 1)}
              disabled={disabled}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                background: 'white',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              +
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* Información General */}
      <div className="row">
        <label>Docente Responsable</label>
        <input
          type="text"
          name="docenteResponsable"
          value={formData.docenteResponsable}
          onChange={handleChange}
          required
        />
        <label>Curso</label>
        <input
          type="text"
          name="curso"
          value={formData.curso}
          onChange={handleChange}
          required
        />
      </div>

      <div className="row">
        <label>Semestre Académico</label>
        <input
          type="text"
          name="semestre"
          value={formData.semestre}
          onChange={handleChange}
          placeholder="Ej: 2024-II"
          required
        />
        <label>Tema/Proyecto</label>
        <input
          type="text"
          name="temaProyecto"
          value={formData.temaProyecto}
          onChange={handleChange}
          required
        />
      </div>

      {/* Fecha y Horario */}
      <div className="row">
        <label>Fecha</label>
        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          max={new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]}
          required
        />
        <label>Hora de Entrada</label>
        <input
          type="time"
          name="horaEntrada"
          value={formData.horaEntrada}
          onChange={handleChange}
          required
        />
        <label>Hora de Salida</label>
        <input
          type="time"
          name="horaSalida"
          value={formData.horaSalida}
          onChange={handleChange}
          required
        />
      </div>

      {/* Kit Arduino */}
      <div className="row">
        <label>Kit Arduino</label>
        <select
          name="kitArduino"
          value={formData.kitArduino}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un kit</option>
          {kitsDisponibles.map(kit => (
            <option key={kit.nombre} value={kit.nombre}>
              {kit.nombre} - {kit.descripcion}
            </option>
          ))}
        </select>
        <label>Estado del Kit</label>
        <select
          value={formData.estadoKit}
          onChange={(e) => handleEstadoKitChange(e.target.value as 'completo' | 'especifico')}
        >
          <option value="completo">Completo (todos los componentes)</option>
          <option value="especifico">Solo elementos específicos</option>
        </select>
      </div>

      {/* Componentes del Kit */}
      <div style={{ marginTop: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>
          Componentes incluidos en el kit
        </h3>
        {formData.estadoKit === 'completo' && (
          <p style={{ 
            padding: '12px', 
            background: '#dbeafe', 
            borderRadius: '6px', 
            fontSize: '0.875rem',
            marginBottom: '16px',
            color: '#1e40af'
          }}>
            Modo completo: Todos los componentes están seleccionados automáticamente
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          <ComponenteCheckbox
            nombre="microcontroladorWifi"
            label="Módulo WiFi ESP8266 - Conectividad inalámbrica"
            componente="microcontroladorWifi"
          />
          <ComponenteCheckbox
            nombre="microcontroladorPlaca"
            label="Arduino Uno R3 - Placa principal de desarrollo"
            componente="microcontroladorPlaca"
          />
          <ComponenteCheckbox
            nombre="prototipado"
            label="Protoboard 830 puntos - Para montaje sin soldadura"
            componente="prototipado"
          />
          <ComponenteCheckbox
            nombre="sensorComunicacion"
            label="Módulo Bluetooth HC-05 - Comunicación serial"
            componente="sensorComunicacion"
          />
          <ComponenteCheckbox
            nombre="alimentacion"
            label="Fuente 9V con adaptador - Alimentación externa"
            componente="alimentacion"
          />
          <ComponenteCheckbox
            nombre="sensorEntradaUsuario"
            label="Botones pulsadores - Entradas digitales"
            componente="sensorEntradaUsuario"
          />
          <ComponenteCheckbox
            nombre="sensorTemperatura"
            label="Sensor DHT11 - Temperatura y humedad"
            componente="sensorTemperatura"
          />
          <ComponenteCheckbox
            nombre="sensorInterruptor"
            label="Sensor Reed magnético - Detección ON/OFF"
            componente="sensorInterruptor"
          />
          <ComponenteCheckbox
            nombre="sensorLuz"
            label="Fotoresistencia LDR - Sensor de luz ambiental"
            componente="sensorLuz"
          />
          <ComponenteCheckbox
            nombre="sensorAjusteAnalogico"
            label="Potenciómetro 10k - Entrada analógica variable"
            componente="sensorAjusteAnalogico"
          />
          <ComponenteCheckbox
            nombre="controladorLED"
            label="LEDs RGB y driver - Control de iluminación"
            componente="controladorLED"
          />
          <ComponenteCheckbox
            nombre="registroDesplazamiento"
            label="74HC595 - Expansión de salidas digitales"
            componente="registroDesplazamiento"
          />
          <ComponenteCheckbox
            nombre="resistencia"
            label="Set de resistencias - 220Ω, 1kΩ, 10kΩ"
            componente="resistencia"
          />
        </div>
      </div>

      {/* Responsable */}
      <div className="row">
        <label>Código del Responsable</label>
        <input
          type="text"
          name="codigoResponsable"
          value={formData.codigoResponsable}
          onChange={handleChange}
          required
        />
        <label>Nombre del Responsable</label>
        <input
          type="text"
          name="nombreResponsable"
          value={formData.nombreResponsable}
          onChange={handleChange}
          required
        />
      </div>

      {/* Integrantes */}
      <div className="row vertical">
        <label>Integrantes del equipo</label>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: '8px', width: '100%', alignItems: 'center' }}>
          <input
            type="text"
            value={codigoIntegrante}
            onChange={(e) => setCodigoIntegrante(e.target.value)}
            placeholder="Código"
            maxLength={10}
          />
          <input
            type="text"
            value={nuevoIntegrante}
            onChange={(e) => setNuevoIntegrante(e.target.value)}
            placeholder="Nombre completo del integrante"
          />
          <button type="button" onClick={agregarIntegrante} className="small primary">
            Agregar
          </button>
        </div>
        {formData.integrantes.length > 0 && (
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: '12px 0 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {formData.integrantes.map((integrante, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg)',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                gap: '16px'
              }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text)', flex: 1 }}>{integrante}</span>
                <button
                  type="button"
                  onClick={() => eliminarIntegrante(i)}
                  className="small danger"
                  style={{ whiteSpace: 'nowrap', minWidth: '80px' }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Personal de Soporte */}
      <div className="row">
        <label>Personal de Soporte</label>
        <select
          name="soporte"
          value={formData.soporte}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione el personal de soporte</option>
          {personalSoporte.map(persona => (
            <option key={persona} value={persona}>{persona}</option>
          ))}
        </select>
      </div>

      {/* Botones */}
      <div className="actions">
        <button type="submit" className="primary">
          Enviar Solicitud
        </button>
      </div>
    </form>
  )
}
