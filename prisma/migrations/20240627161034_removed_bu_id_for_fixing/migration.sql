/*
  Warnings:

  - You are about to drop the column `bu_id` on the `Person` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Person_bu_id_key";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "bu_id";
