import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import requestRoutes from './routes/requests';
import arduinoRequestRoutes from './routes/arduino-requests';
import reportRoutes from './routes/reports';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:5174', 
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://marant7.github.io'  // ← GitHub Pages
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/arduino-requests', arduinoRequestRoutes);
app.use('/api/reports', reportRoutes);

// Ruta de prueba / healthcheck
app.get('/', (req, res) => {
  res.json({ 
    message: 'API del Sistema de Solicitudes funcionando ✅',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database: ${process.env.DATABASE_URL ? 'Conectado' : 'NO CONECTADO'}`);
});
