/*
  Warnings:

  - You are about to drop the column `note` on the `HourSubmission` table. All the data in the column will be lost.
  - Made the column `description` on table `HourSubmission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "HourSubmission" DROP COLUMN "note",
ADD COLUMN     "feedback" TEXT,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "description" SET NOT NULL;
