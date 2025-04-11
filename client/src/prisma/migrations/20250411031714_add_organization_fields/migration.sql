-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "collaboration_opportunities" TEXT,
ADD COLUMN     "collaboration_tags" TEXT[],
ADD COLUMN     "mission_statement" TEXT;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "goal_date" TIMESTAMP(3),
ADD COLUMN     "hour_goal" INTEGER DEFAULT 90;
