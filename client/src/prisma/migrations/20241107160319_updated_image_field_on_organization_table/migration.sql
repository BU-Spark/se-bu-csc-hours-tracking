/*
  Warnings:

  - The `image` column on the `Organization` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "image",
ADD COLUMN     "image" BYTEA;
