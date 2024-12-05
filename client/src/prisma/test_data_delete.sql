-- Begin a transaction to ensure all deletions succeed or fail together
BEGIN;

---------------------------------------------------
-- 1. Delete from HourSubmission
---------------------------------------------------

DELETE FROM "HourSubmission"
WHERE volunteer_id IN (
    SELECT id FROM "Person"
    WHERE email IN ('johndoe@bu.edu', 'janesmith@bu.edu')
)
AND event_id IN (
    SELECT id FROM "Event"
    WHERE title IN ('AI Workshop', 'Coding Competition', 'Data Science Seminar', 'Art Exhibition')
);

---------------------------------------------------
-- 2. Delete from Application
---------------------------------------------------

DELETE FROM "Application"
WHERE applicant_id IN (
    SELECT id FROM "Person"
    WHERE email IN ('johndoe@bu.edu', 'janesmith@bu.edu')
)
AND event_id IN (
    SELECT id FROM "Event"
    WHERE title IN ('AI Workshop', 'Coding Competition', 'Data Science Seminar', 'Art Exhibition')
);

---------------------------------------------------
-- 3. Delete from Comment
---------------------------------------------------

DELETE FROM "Comment"
WHERE author_id IN (
    SELECT id FROM "Person"
    WHERE email IN ('alexjmil@bu.edu', 'emilyc@bu.edu')
)
AND event_id IN (
    SELECT id FROM "Event"
    WHERE title IN ('AI Workshop', 'Coding Competition', 'Data Science Seminar', 'Art Exhibition')
);

---------------------------------------------------
-- 4. Delete from Event
---------------------------------------------------

DELETE FROM "Event"
WHERE title IN ('AI Workshop', 'Coding Competition', 'Data Science Seminar', 'Art Exhibition');

---------------------------------------------------
-- 5. Delete from Person
---------------------------------------------------

DELETE FROM "Person"
WHERE email IN (
    'alexjmil@bu.edu',
    'emilyc@bu.edu',
    'johndoe@bu.edu',
    'janesmith@bu.edu',
    'michaelb@bu.edu',
    'sarahj@bu.edu'
);

---------------------------------------------------
-- 6. Delete from Organization
---------------------------------------------------

DELETE FROM "Organization"
WHERE abbreviation IN ('BU CSC', 'BU Art');

---------------------------------------------------
-- 7. Delete from Category
---------------------------------------------------

-- Before deleting categories, ensure no events are referencing them
DELETE FROM "Category"
WHERE name IN ('Workshop', 'Seminar', 'Networking', 'Competition')
AND id NOT IN (
    SELECT DISTINCT category_id FROM "Event"
);

---------------------------------------------------
-- 8. Delete from ApprovalStatusCode
---------------------------------------------------

-- Before deleting approval status codes, ensure no applications or submissions are referencing them
DELETE FROM "ApprovalStatusCode"
WHERE meaning IN ('Pending', 'Approved', 'Rejected')
AND id NOT IN (
    SELECT DISTINCT approval_status FROM "Application"
    UNION
    SELECT DISTINCT approval_status FROM "HourSubmission"
);

---------------------------------------------------
-- 9. Delete from Reason
---------------------------------------------------

-- Before deleting reasons, ensure no applications or waitlists are referencing them
DELETE FROM "Reason"
WHERE meaning IN ('Reason 1', 'Reason 2', 'Reason 3')
AND id NOT IN (
    SELECT DISTINCT reason_id FROM "Application"
    UNION
    SELECT DISTINCT reason_id FROM "Waitlist"
);

-- Commit the transaction
COMMIT;

---------------------------------------------------
-- Optional: Verify Deletions
---------------------------------------------------

-- Uncomment the following SELECT statements to verify data after running the script.

-- SELECT * FROM "ApprovalStatusCode";
-- SELECT * FROM "Organization";
-- SELECT * FROM "Person";
-- SELECT * FROM "Category";
-- SELECT * FROM "Event";
-- SELECT * FROM "HourSubmission";
-- SELECT * FROM "Reason";
-- SELECT * FROM "Application";
