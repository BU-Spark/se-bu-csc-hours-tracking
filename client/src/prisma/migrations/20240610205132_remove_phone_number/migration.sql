/*
  Warnings:

  - You are about to drop the column `phone_number` on the `Person` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Person_phone_number_key";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "phone_number";
