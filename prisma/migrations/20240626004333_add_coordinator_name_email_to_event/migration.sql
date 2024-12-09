/*
  Warnings:

  - Added the required column `coordinator_email` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordinator_name` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" 
ADD COLUMN "coordinator_email" TEXT DEFAULT 'default_email@example.com',
ADD COLUMN "coordinator_name" TEXT DEFAULT 'default_name';