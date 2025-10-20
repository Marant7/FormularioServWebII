import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET - Obtener solicitudes de Arduino según el rol del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    let solicitudes;

    if (user.role === 'ESTUDIANTE') {
      // Los estudiantes solo ven sus propias solicitudes
      solicitudes = await prisma.arduinoRequest.findMany({
        where: { estudianteId: user.userId },
        include: {
          estudiante: {
            select: { nombre: true, email: true }
          },
          autorizacion: {
            include: {
              soporte: {
                select: { nombre: true, email: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (user.role === 'SOPORTE') {
      // El soporte ve todas las solicitudes (para el historial completo)
      solicitudes = await prisma.arduinoRequest.findMany({
        include: {
          estudiante: {
            select: { nombre: true, email: true }
          },
          autorizacion: {
            include: {
              soporte: {
                select: { nombre: true, email: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (user.role === 'METRICAS') {
      // El jefe de laboratorio ve todas las solicitudes
      solicitudes = await prisma.arduinoRequest.findMany({
        include: {
          estudiante: {
            select: { nombre: true, email: true }
          },
          autorizacion: {
            include: {
              soporte: {
                select: { nombre: true, email: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener solicitudes de Arduino:', error);
    res.status(500).json({ message: 'Error al obtener solicitudes' });
  }
});

// POST - Crear nueva solicitud de Arduino (solo estudiantes)
router.post('/', authenticateToken, authorizeRoles('ESTUDIANTE'), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const {
      docenteResponsable,
      curso,
      semestre,
      temaProyecto,
      fecha,
      horaEntrada,
      horaSalida,
      kitArduino,
      estadoKit,
      componentesIncluidos,
      codigoResponsable,
      nombreResponsable,
      integrantes,
      soporte
    } = req.body;

    const nuevaSolicitud = await prisma.arduinoRequest.create({
      data: {
        docenteResponsable,
        curso,
        semestre,
        temaProyecto,
        fecha: new Date(fecha),
        horaEntrada,
        horaSalida,
        kitArduino,
        estadoKit,
        componentesIncluidos,
        codigoResponsable,
        nombreResponsable,
        integrantes,
        soporte,
        estudianteId: req.user.userId,
        status: 'PENDIENTE'
      },
      include: {
        estudiante: {
          select: { nombre: true, email: true }
        }
      }
    });

    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    console.error('Error al crear solicitud de Arduino:', error);
    res.status(500).json({ message: 'Error al crear la solicitud' });
  }
});

// PUT - Autorizar/Rechazar solicitud (solo soporte)
router.put('/:id/authorize', authenticateToken, authorizeRoles('SOPORTE'), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;
    const { accion, razon } = req.body;

    // Validar que la acción sea válida
    if (!['APROBADA', 'RECHAZADA'].includes(accion)) {
      return res.status(400).json({ message: 'Acción inválida' });
    }

    // Actualizar la solicitud
    const solicitudActualizada = await prisma.arduinoRequest.update({
      where: { id },
      data: {
        status: accion,
        autorizacion: {
          create: {
            soporteId: req.user.userId,
            accion,
            razon
          }
        }
      },
      include: {
        estudiante: {
          select: { nombre: true, email: true }
        },
        autorizacion: {
          include: {
            soporte: {
              select: { nombre: true, email: true }
            }
          }
        }
      }
    });

    res.json(solicitudActualizada);
  } catch (error) {
    console.error('Error al autorizar solicitud de Arduino:', error);
    res.status(500).json({ message: 'Error al procesar la autorización' });
  }
});

// DELETE - Eliminar solicitud
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;
    const user = req.user;

    // Verificar que la solicitud existe
    const solicitud = await prisma.arduinoRequest.findUnique({
      where: { id }
    });

    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Solo el estudiante que creó la solicitud puede eliminarla
    if (user.role === 'ESTUDIANTE' && solicitud.estudianteId !== user.userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta solicitud' });
    }

    await prisma.arduinoRequest.delete({
      where: { id }
    });

    res.json({ message: 'Solicitud eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar solicitud de Arduino:', error);
    res.status(500).json({ message: 'Error al eliminar la solicitud' });
  }
});

export default router;
