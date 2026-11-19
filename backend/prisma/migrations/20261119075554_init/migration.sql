-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "nim" VARCHAR(12) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "study_program" VARCHAR(100) NOT NULL,
    "cohort" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_nim_key" ON "students"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
