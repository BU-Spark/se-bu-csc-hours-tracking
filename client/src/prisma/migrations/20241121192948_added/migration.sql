-- AlterTable
ALTER TABLE "FormCode" ADD COLUMN     "organization_id" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false;
