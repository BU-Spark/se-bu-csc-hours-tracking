-- CreateTable
CREATE TABLE "Waitlist" (
    "id" SERIAL NOT NULL,
    "date_applied" TIMESTAMP(3) NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "approval_status" INTEGER NOT NULL DEFAULT 0,
    "reason_id" INTEGER NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by_id" INTEGER,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Waitlist" ADD CONSTRAINT "Waitlist_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "Person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Waitlist" ADD CONSTRAINT "Waitlist_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "Person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Waitlist" ADD CONSTRAINT "Waitlist_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Waitlist" ADD CONSTRAINT "Waitlist_reason_id_fkey" FOREIGN KEY ("reason_id") REFERENCES "Reason"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Waitlist" ADD CONSTRAINT "Waitlist_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "Person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
