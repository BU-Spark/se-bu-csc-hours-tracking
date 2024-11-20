/*
  Warnings:

  - Added the required column `email` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameofservice` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipcode` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "apt" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "nameofservice" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipcode" INTEGER NOT NULL;
