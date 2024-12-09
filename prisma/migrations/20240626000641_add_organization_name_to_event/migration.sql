-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organization_id_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "organization_name" TEXT,
ALTER COLUMN "organization_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
