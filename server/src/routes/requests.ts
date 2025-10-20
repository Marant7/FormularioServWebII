import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/requests - Obtener todas las solicitudes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user!;

    let requests;

    // Si es estudiante, solo ve sus propias solicitudes
    if (user.role === 'ESTUDIANTE') {
      requests = await prisma.request.findMany({
        where: { estudianteId: user.userId },
        include: {
          estudiante: {
            select: { id: true, nombre: true, email: true }
          },
          autorizacion: {
            include: {
              soporte: {
                select: { id: true, nombre: true, email: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Soporte y Métricas ven todas las solicitudes
      requests = await prisma.request.findMany({
        include: {
          estudiante: {
            select: { id: true, nombre: true, email: true }
          },
          autorizacion: {
            include: {
              soporte: {
                select: { id: true, nombre: true, email: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json({ requests });
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

// GET /api/requests/:id - Obtener una solicitud específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const request = await prisma.request.findUnique({
      where: { id },
      include: {
        estudiante: {
          select: { id: true, nombre: true, email: true }
        },
        autorizacion: {
          include: {
            soporte: {
              select: { id: true, nombre: true, email: true }
            }
          }
        }
      }
    });

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Si es estudiante, solo puede ver sus propias solicitudes
    if (user.role === 'ESTUDIANTE' && request.estudianteId !== user.userId) {
      return res.status(403).json({ error: 'No tienes permiso para ver esta solicitud' });
    }

    res.json({ request });
  } catch (error) {
    console.error('Error al obtener solicitud:', error);
    res.status(500).json({ error: 'Error al obtener solicitud' });
  }
});

// POST /api/requests - Crear nueva solicitud (solo ESTUDIANTE)
router.post('/', authenticateToken, authorizeRoles('ESTUDIANTE'), async (req, res) => {
  try {
    const user = req.user!;
    const {
      docenteResponsable,
      curso,
      semestre,
      fecha,
      horaEntrada,
      horaSalida,
      servidor,
      serieServidor,
      tipoServidor,
      caracteristicas,
      incluirMonitor,
      incluirTeclado,
      incluirMouse,
      codigoResponsable,
      nombreResponsable,
      integrantes,
      soporte
    } = req.body;

    // Validación básica
    if (!docenteResponsable || !curso || !fecha || !horaEntrada || !horaSalida || !servidor) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const request = await prisma.request.create({
      data: {
        docenteResponsable,
        curso,
        semestre,
        fecha: new Date(fecha),
        horaEntrada,
        horaSalida,
        servidor,
        serieServidor,
        tipoServidor,
        caracteristicas,
        incluirMonitor: incluirMonitor || false,
        incluirTeclado: incluirTeclado || false,
        incluirMouse: incluirMouse || false,
        codigoResponsable,
        nombreResponsable,
        integrantes: integrantes || [],
        soporte: soporte || '',
        status: 'PENDIENTE',
        estudianteId: user.userId
      },
      include: {
        estudiante: {
          select: { id: true, nombre: true, email: true }
        }
      }
    });

    res.status(201).json({ message: 'Solicitud creada exitosamente', request });
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ error: 'Error al crear solicitud' });
  }
});

// PUT /api/requests/:id/authorize - Aprobar o rechazar solicitud (solo SOPORTE)
router.put('/:id/authorize', authenticateToken, authorizeRoles('SOPORTE'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const { accion, razon } = req.body; // accion: "APROBADA" | "RECHAZADA"

    if (!accion || !['APROBADA', 'RECHAZADA'].includes(accion)) {
      return res.status(400).json({ error: 'Acción inválida. Debe ser APROBADA o RECHAZADA' });
    }

    // Verificar que la solicitud existe y está pendiente
    const request = await prisma.request.findUnique({
      where: { id }
    });

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    if (request.status !== 'PENDIENTE') {
      return res.status(400).json({ error: 'La solicitud ya fue procesada' });
    }

    // Actualizar solicitud y crear autorización
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        status: accion,
        autorizacion: {
          create: {
            soporteId: user.userId,
            accion,
            razon: razon || null
          }
        }
      },
      include: {
        estudiante: {
          select: { id: true, nombre: true, email: true }
        },
        autorizacion: {
          include: {
            soporte: {
              select: { id: true, nombre: true, email: true }
            }
          }
        }
      }
    });

    res.json({ 
      message: `Solicitud ${accion.toLowerCase()} exitosamente`, 
      request: updatedRequest 
    });
  } catch (error) {
    console.error('Error al autorizar solicitud:', error);
    res.status(500).json({ error: 'Error al autorizar solicitud' });
  }
});

// DELETE /api/requests/:id - Eliminar solicitud (solo ESTUDIANTE y solo sus propias solicitudes pendientes)
router.delete('/:id', authenticateToken, authorizeRoles('ESTUDIANTE'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const request = await prisma.request.findUnique({
      where: { id }
    });

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    if (request.estudianteId !== user.userId) {
      return res.status(403).json({ error: 'No puedes eliminar solicitudes de otros usuarios' });
    }

    if (request.status !== 'PENDIENTE') {
      return res.status(400).json({ error: 'Solo se pueden eliminar solicitudes pendientes' });
    }

    await prisma.request.delete({
      where: { id }
    });

    res.json({ message: 'Solicitud eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    res.status(500).json({ error: 'Error al eliminar solicitud' });
  }
});

export default router;
