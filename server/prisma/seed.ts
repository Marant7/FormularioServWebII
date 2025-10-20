import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpiar datos existentes
  await prisma.authorization.deleteMany();
  await prisma.request.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios de ejemplo
  const estudiantePassword = await bcrypt.hash('estudiante123', 10);
  const soportePassword = await bcrypt.hash('soporte123', 10);
  const metricasPassword = await bcrypt.hash('metricas123', 10);

  const estudiante = await prisma.user.create({
    data: {
      email: 'estudiante@upt.pe',
      password: estudiantePassword,
      nombre: 'Juan Pérez Estudiante',
      role: 'ESTUDIANTE'
    }
  });

  const soporte = await prisma.user.create({
    data: {
      email: 'soporte@upt.pe',
      password: soportePassword,
      nombre: 'Teli Casilla Maquera',
      role: 'SOPORTE'
    }
  });

  const metricas = await prisma.user.create({
    data: {
      email: 'jefe@upt.pe',
      password: metricasPassword,
      nombre: 'Admin Reportes',
      role: 'METRICAS'
    }
  });

  console.log('✅ Usuarios creados:');
  console.log('   - Estudiante:', estudiante.email, '/ estudiante123');
  console.log('   - Soporte:', soporte.email, '/ soporte123');
  console.log('   - Métricas:', metricas.email, '/ metricas123');

  // Crear algunas solicitudes de ejemplo
  const solicitud1 = await prisma.request.create({
    data: {
      docenteResponsable: 'Dr. García López',
      curso: 'Redes I',
      semestre: '2025-II',
      fecha: new Date('2025-10-25'),
      horaEntrada: '08:00',
      horaSalida: '12:00',
      servidor: 'Server1',
      serieServidor: 'ABC123',
      tipoServidor: 'Torre',
      caracteristicas: '8CPU, 16GB RAM',
      incluirMonitor: true,
      incluirTeclado: true,
      incluirMouse: false,
      codigoResponsable: '2020001',
      nombreResponsable: 'Juan Pérez',
      integrantes: [
        { codigo: '2020002', nombre: 'María López', rol: 'Estudiante' },
        { codigo: '2020003', nombre: 'Carlos Ruiz', rol: 'Estudiante' }
      ],
      soporte: 'Teli Casilla Maquera',
      status: 'PENDIENTE',
      estudianteId: estudiante.id
    }
  });

  const solicitud2 = await prisma.request.create({
    data: {
      docenteResponsable: 'Dra. Ana Martínez',
      curso: 'Base de Datos II',
      semestre: '2025-II',
      fecha: new Date('2025-10-26'),
      horaEntrada: '14:00',
      horaSalida: '18:00',
      servidor: 'Server2',
      serieServidor: 'wdeew45',
      tipoServidor: 'Rack',
      caracteristicas: '16CPU, 32GB RAM',
      incluirMonitor: false,
      incluirTeclado: false,
      incluirMouse: false,
      codigoResponsable: '2020001',
      nombreResponsable: 'Juan Pérez',
      integrantes: [
        { codigo: '2020004', nombre: 'Pedro Sánchez', rol: 'Estudiante' }
      ],
      soporte: 'Teli Casilla Maquera',
      status: 'APROBADA',
      estudianteId: estudiante.id
    }
  });

  // Crear autorización para la solicitud aprobada
  await prisma.authorization.create({
    data: {
      requestId: solicitud2.id,
      soporteId: soporte.id,
      accion: 'APROBADA',
      razon: 'Solicitud completa y válida'
    }
  });

  console.log('✅ Solicitudes de ejemplo creadas');
  console.log('');
  console.log('🎉 ¡Seed completado exitosamente!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
