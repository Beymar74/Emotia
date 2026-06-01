/*
  Warnings:

  - You are about to drop the column `fecha_entrega` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `horario_entrega` on the `pedidos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "fecha_entrega",
DROP COLUMN "horario_entrega";

-- CreateTable
CREATE TABLE "proveedor_notificaciones" (
    "id" SERIAL NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "mensaje" TEXT,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proveedor_notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personalizacion_fechas" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personalizacion_fechas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_prov_notificaciones" ON "proveedor_notificaciones"("proveedor_id", "leida");

-- AddForeignKey
ALTER TABLE "proveedor_notificaciones" ADD CONSTRAINT "proveedor_notificaciones_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
