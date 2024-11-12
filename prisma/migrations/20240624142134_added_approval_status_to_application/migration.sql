/*
  Warnings:

  - You are about to drop the column `approved` on the `Application` table. All the data in the column will be lost.
  - You are about to alter the column `college` on the `Person` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `HourSubmissionCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "approved",
ADD COLUMN     "approval_status" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "HourSubmission" ALTER COLUMN "approval_status" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "college" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "HourSubmissionCode";

-- CreateTable
CREATE TABLE "ApprovalStatusCode" (
    "id" SERIAL NOT NULL,
    "meaning" TEXT NOT NULL,

    CONSTRAINT "ApprovalStatusCode_pkey" PRIMARY KEY ("id")
);
