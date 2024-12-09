/*
  Warnings:

  - You are about to drop the column `summary` on the `Application` table. All the data in the column will be lost.
  - Added the required column `reason_id` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "summary",
ADD COLUMN     "reason_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Reason" (
    "id" SERIAL NOT NULL,
    "meaning" TEXT NOT NULL,

    CONSTRAINT "Reason_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_reason_id_fkey" FOREIGN KEY ("reason_id") REFERENCES "Reason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
