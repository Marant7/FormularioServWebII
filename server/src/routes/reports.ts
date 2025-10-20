import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/reports/stats - Obtener estadísticas (solo METRICAS y SOPORTE)
router.get('/stats', authenticateToken, authorizeRoles('METRICAS', 'SOPORTE'), async (req, res) => {
  try {
    // Contar solicitudes por estado
    const total = await prisma.request.count();
    const pendientes = await prisma.request.count({ where: { status: 'PENDIENTE' } });
    const aprobadas = await prisma.request.count({ where: { status: 'APROBADA' } });
    const rechazadas = await prisma.request.count({ where: { status: 'RECHAZADA' } });

    // Solicitudes por servidor
    const porServidor = await prisma.request.groupBy({
      by: ['servidor'],
      _count: {
        servidor: true
      }
    });

    // Solicitudes por semestre
    const porSemestre = await prisma.request.groupBy({
      by: ['semestre'],
      _count: {
        semestre: true
      }
    });

    // Solicitudes por estudiante (top 5)
    const porEstudiante = await prisma.request.groupBy({
      by: ['estudianteId'],
      _count: {
        estudianteId: true
      },
      orderBy: {
        _count: {
          estudianteId: 'desc'
        }
      },
      take: 5
    });

    // Obtener nombres de los estudiantes
    const estudiantesIds = porEstudiante.map(e => e.estudianteId);
    const estudiantes = await prisma.user.findMany({
      where: { id: { in: estudiantesIds } },
      select: { id: true, nombre: true, email: true }
    });

    const topEstudiantes = porEstudiante.map(e => {
      const estudiante = estudiantes.find(est => est.id === e.estudianteId);
      return {
        estudiante: estudiante?.nombre || 'Desconocido',
        email: estudiante?.email || '',
        cantidad: e._count.estudianteId
      };
    });

    res.json({
      resumen: {
        total,
        pendientes,
        aprobadas,
        rechazadas
      },
      porServidor: porServidor.map(s => ({
        servidor: s.servidor,
        cantidad: s._count.servidor
      })),
      porSemestre: porSemestre.map(s => ({
        semestre: s.semestre,
        cantidad: s._count.semestre
      })),
      topEstudiantes
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// GET /api/reports/timeline - Solicitudes en el tiempo (últimos 30 días)
router.get('/timeline', authenticateToken, authorizeRoles('METRICAS', 'SOPORTE'), async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const requests = await prisma.request.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        createdAt: true,
        status: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Agrupar por día
    const byDay = requests.reduce((acc: any, req) => {
      const day = req.createdAt.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = { total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0 };
      }
      acc[day].total++;
      if (req.status === 'PENDIENTE') acc[day].pendientes++;
      if (req.status === 'APROBADA') acc[day].aprobadas++;
      if (req.status === 'RECHAZADA') acc[day].rechazadas++;
      return acc;
    }, {});

    const timeline = Object.entries(byDay).map(([fecha, datos]) => ({
      fecha,
      ...(datos as any)
    }));

    res.json({ timeline });
  } catch (error) {
    console.error('Error al obtener timeline:', error);
    res.status(500).json({ error: 'Error al obtener timeline' });
  }
});

export default router;
