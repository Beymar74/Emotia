/*
  Warnings:

  - You are about to drop the `audit_log` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "proveedor_sesiones" ALTER COLUMN "expires_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "proveedores" ALTER COLUMN "categorias" DROP DEFAULT;

-- DropTable
DROP TABLE IF EXISTS "audit_log";

-- CreateTable
CREATE TABLE IF NOT EXISTS "personalizaciones" (
    "id" SERIAL NOT NULL,
    "carrito_id" INTEGER,
    "detalle_pedido_id" INTEGER,
    "tipo_tarjeta" VARCHAR(50) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personalizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "tarjeta_disenos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "design_url" TEXT NOT NULL,
    "color_acento" VARCHAR(20) NOT NULL,
    "color_suave" VARCHAR(20) NOT NULL,
    "color_marco" VARCHAR(20) NOT NULL,
    "color_mensaje" VARCHAR(20) NOT NULL,
    "ornamento" VARCHAR(20) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tarjeta_disenos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "personalizaciones_carrito_id_key" ON "personalizaciones"("carrito_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "personalizaciones_detalle_pedido_id_key" ON "personalizaciones"("detalle_pedido_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "personalizaciones_carrito_id_idx" ON "personalizaciones"("carrito_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "personalizaciones_detalle_pedido_id_idx" ON "personalizaciones"("detalle_pedido_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "tarjeta_disenos_nombre_key" ON "tarjeta_disenos"("nombre");

-- AddForeignKey
ALTER TABLE "personalizaciones" DROP CONSTRAINT IF EXISTS "personalizaciones_carrito_id_fkey";
ALTER TABLE "personalizaciones" ADD CONSTRAINT "personalizaciones_carrito_id_fkey" FOREIGN KEY ("carrito_id") REFERENCES "carrito"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personalizaciones" DROP CONSTRAINT IF EXISTS "personalizaciones_detalle_pedido_id_fkey";
ALTER TABLE "personalizaciones" ADD CONSTRAINT "personalizaciones_detalle_pedido_id_fkey" FOREIGN KEY ("detalle_pedido_id") REFERENCES "detalle_pedidos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
