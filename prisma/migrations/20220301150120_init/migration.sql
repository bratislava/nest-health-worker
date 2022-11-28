-- CreateTable
CREATE TABLE "HealthCheck" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meta" JSONB NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "expected_result" TEXT NOT NULL,
    "result_rule" JSONB NOT NULL,

    CONSTRAINT "HealthCheck_pkey" PRIMARY KEY ("id")
);
