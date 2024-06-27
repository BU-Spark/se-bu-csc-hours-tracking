/*
  Warnings:

  - You are about to drop the column `coordinator_email` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `coordinator_name` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `organization_name` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "coordinator_email",
DROP COLUMN "coordinator_name",
DROP COLUMN "organization_name",
DROP COLUMN "published";
