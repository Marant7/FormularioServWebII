import React, { useMemo, useState } from 'react'
import { RequestItem } from '../App'
import { Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default function Reports({ requests }: { requests: RequestItem[] }) {
  const [type, setType] = useState<'pie' | 'bar'>('pie')

  const totals = useMemo(() => {
    const total = requests.length
    const pendientes = requests.filter((r) => r.status === 'Pendiente').length
    const aprobadas = requests.filter((r) => r.status === 'Aprobada').length
    const rechazadas = requests.filter((r) => r.status === 'Rechazada').length
    return { total, pendientes, aprobadas, rechazadas }
  }, [requests])

  const data = {
    labels: ['Pendientes', 'Aprobadas', 'Rechazadas'],
    datasets: [
      {
        label: 'Solicitudes',
        data: [totals.pendientes, totals.aprobadas, totals.rechazadas],
        backgroundColor: ['#ffcc4d', '#28a745', '#dc3545']
      }
    ]
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Solicitudes por estado' }
    }
  }

  return (
    <div>
      <h2>Reportes y Estadísticas</h2>
      <div className="stats">
        <div className="stat"> <strong>{totals.total}</strong> <div>Total</div> </div>
        <div className="stat"> <strong>{totals.pendientes}</strong> <div>Pendientes</div> </div>
        <div className="stat"> <strong>{totals.aprobadas}</strong> <div>Autorizadas</div> </div>
        <div className="stat"> <strong>{totals.rechazadas}</strong> <div>Rechazadas</div> </div>
      </div>

      {/* Tabla de solicitudes (restaurada) */}
      <div style={{ marginTop: 18 }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Semestre</th>
              <th>Docente</th>
              <th>Curso</th>
              <th>Fecha</th>
              <th>Servidor</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.semestre}</td>
                <td>{r.docenteResponsable}</td>
                <td>{r.curso}</td>
                <td>{r.fecha}</td>
                <td>{r.servidor}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ maxWidth: 720, marginTop: 18 }}>
        {type === 'pie' ? <Pie data={data} /> : <Bar data={data} options={barOptions} />}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
          <label>Tipo de gráfico:</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="pie">Torta</option>
            <option value="bar">Barras</option>
          </select>
        </div>
      </div>
    </div>
  )
}
