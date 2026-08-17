-- CreateTable
CREATE TABLE "configs" (
    "id" TEXT NOT NULL,
    "config_version" INTEGER NOT NULL DEFAULT 1,
    "business" JSONB NOT NULL,
    "questions" JSONB NOT NULL,
    "modifiers" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "estimate_low" INTEGER NOT NULL,
    "estimate_high" INTEGER NOT NULL,
    "config_version" INTEGER NOT NULL,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);
