/*
  Warnings:

  - Added the required column `updated_by_id` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by_id" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "updated_by_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
