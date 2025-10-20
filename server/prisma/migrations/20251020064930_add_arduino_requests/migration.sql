-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ESTUDIANTE', 'SOPORTE', 'METRICAS');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ESTUDIANTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "docenteResponsable" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "semestre" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaEntrada" TEXT NOT NULL,
    "horaSalida" TEXT NOT NULL,
    "servidor" TEXT NOT NULL,
    "serieServidor" TEXT NOT NULL,
    "tipoServidor" TEXT NOT NULL,
    "caracteristicas" TEXT NOT NULL,
    "incluirMonitor" BOOLEAN NOT NULL DEFAULT false,
    "incluirTeclado" BOOLEAN NOT NULL DEFAULT false,
    "incluirMouse" BOOLEAN NOT NULL DEFAULT false,
    "codigoResponsable" TEXT NOT NULL,
    "nombreResponsable" TEXT NOT NULL,
    "integrantes" JSONB NOT NULL,
    "soporte" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "estudianteId" TEXT NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authorization" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "soporteId" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "razon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Authorization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArduinoRequest" (
    "id" TEXT NOT NULL,
    "docenteResponsable" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "semestre" TEXT NOT NULL,
    "temaProyecto" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaEntrada" TEXT NOT NULL,
    "horaSalida" TEXT NOT NULL,
    "kitArduino" TEXT NOT NULL,
    "estadoKit" TEXT NOT NULL,
    "componentesIncluidos" JSONB NOT NULL,
    "codigoResponsable" TEXT NOT NULL,
    "nombreResponsable" TEXT NOT NULL,
    "integrantes" JSONB NOT NULL,
    "soporte" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "estudianteId" TEXT NOT NULL,

    CONSTRAINT "ArduinoRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArduinoAuthorization" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "soporteId" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "razon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArduinoAuthorization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Authorization_requestId_key" ON "Authorization"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "ArduinoAuthorization_requestId_key" ON "ArduinoAuthorization"("requestId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authorization" ADD CONSTRAINT "Authorization_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authorization" ADD CONSTRAINT "Authorization_soporteId_fkey" FOREIGN KEY ("soporteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArduinoRequest" ADD CONSTRAINT "ArduinoRequest_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArduinoAuthorization" ADD CONSTRAINT "ArduinoAuthorization_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ArduinoRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArduinoAuthorization" ADD CONSTRAINT "ArduinoAuthorization_soporteId_fkey" FOREIGN KEY ("soporteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
