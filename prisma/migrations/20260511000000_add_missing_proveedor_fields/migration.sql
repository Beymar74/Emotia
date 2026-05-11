-- AlterTable: add missing columns to proveedores
ALTER TABLE "proveedores" ADD COLUMN IF NOT EXISTS "categorias" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "proveedores" ADD COLUMN IF NOT EXISTS "redes_sociales" JSONB;

-- CreateTable: proveedor_sesiones
CREATE TABLE IF NOT EXISTS "proveedor_sesiones" (
    "id" SERIAL NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proveedor_sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable: metodos_pago
CREATE TABLE IF NOT EXISTS "metodos_pago" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(200),
    "icono" VARCHAR(10),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metodos_pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "proveedor_sesiones_token_key" ON "proveedor_sesiones"("token");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "proveedor_sesiones_token_idx" ON "proveedor_sesiones"("token");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "proveedor_sesiones_proveedor_id_idx" ON "proveedor_sesiones"("proveedor_id");

-- AddForeignKey (safe - only add if not exists via DO block)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'proveedor_sesiones_proveedor_id_fkey'
    ) THEN
        ALTER TABLE "proveedor_sesiones"
            ADD CONSTRAINT "proveedor_sesiones_proveedor_id_fkey"
            FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION;
    END IF;
END $$;
