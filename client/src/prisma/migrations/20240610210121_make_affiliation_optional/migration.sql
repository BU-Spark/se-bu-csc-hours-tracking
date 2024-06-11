-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_affiliation_id_fkey";

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "affiliation_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_affiliation_id_fkey" FOREIGN KEY ("affiliation_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
