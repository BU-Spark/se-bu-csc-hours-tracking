/*
  Warnings:

  - A unique constraint covering the columns `[bu_id]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bu_id` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone_number` on table `Person` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "bu_id" TEXT NOT NULL,
ALTER COLUMN "phone_number" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Person_bu_id_key" ON "Person"("bu_id");
