-- DropForeignKey
ALTER TABLE "notificaciones" DROP CONSTRAINT "notificaciones_usuario_id_fkey";

-- AlterTable
ALTER TABLE "notificaciones" ADD COLUMN     "proveedor_id" INTEGER;

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "comprobante_url" TEXT,
ADD COLUMN     "motivo_rechazo" TEXT;

-- AlterTable
ALTER TABLE "proveedores" ADD COLUMN     "banco" TEXT,
ADD COLUMN     "numero_cuenta" TEXT,
ADD COLUMN     "numero_cuenta_bancaria" VARCHAR(80),
ADD COLUMN     "tipo_cuenta" TEXT,
ADD COLUMN     "titular_cuenta" TEXT;

-- AlterTable
ALTER TABLE "recomendaciones" ADD COLUMN     "productos_elegidos" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- CreateTable
CREATE TABLE "liquidaciones" (
    "id" SERIAL NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "admin_id" INTEGER,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "liquidaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bitacora_pedidos" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "mensaje" TEXT,
    "imagen_url" TEXT,
    "notificar" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bitacora_pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bitacora_pedidos_pedido_id_idx" ON "bitacora_pedidos"("pedido_id");

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liquidaciones" ADD CONSTRAINT "liquidaciones_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liquidaciones" ADD CONSTRAINT "liquidaciones_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bitacora_pedidos" ADD CONSTRAINT "bitacora_pedidos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bitacora_pedidos" ADD CONSTRAINT "bitacora_pedidos_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
