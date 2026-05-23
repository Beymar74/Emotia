-- CreateTable
CREATE TABLE IF NOT EXISTS "empaque_disenos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "preview_url" TEXT NOT NULL,
    "descripcion" VARCHAR(180),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empaque_disenos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "envoltura_disenos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "preview_url" TEXT NOT NULL,
    "descripcion" VARCHAR(180),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "envoltura_disenos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "liston_disenos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "preview_url" TEXT NOT NULL,
    "descripcion" VARCHAR(180),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "liston_disenos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "empaque_disenos_nombre_key" ON "empaque_disenos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "envoltura_disenos_nombre_key" ON "envoltura_disenos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "liston_disenos_nombre_key" ON "liston_disenos"("nombre");
