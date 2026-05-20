-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "fecha_entrega" DATE,
ADD COLUMN     "horario_entrega" VARCHAR(50);

-- AlterTable
ALTER TABLE "tarjeta_disenos" ALTER COLUMN "ornamento" SET DEFAULT 'none';
