/*
  Warnings:

  - A unique constraint covering the columns `[bu_id]` on the table `Person` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "bu_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Person_bu_id_key" ON "Person"("bu_id");
