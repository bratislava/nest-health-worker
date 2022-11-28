-- AlterTable
ALTER TABLE "HealthCheck" ADD COLUMN     "namespace" TEXT NOT NULL DEFAULT E'bratislava-monorepo',
ALTER COLUMN "deployment" SET DEFAULT E'default-app';
