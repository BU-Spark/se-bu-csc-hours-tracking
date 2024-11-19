-- Begin a transaction to ensure all inserts succeed or fail together
BEGIN;

---------------------------------------------------
-- 1. Insert Approval Status Codes
---------------------------------------------------

INSERT INTO "ApprovalStatusCode" (meaning)
SELECT 'Pending'
WHERE NOT EXISTS (
    SELECT 1 FROM "ApprovalStatusCode" WHERE meaning = 'Pending'
);

INSERT INTO "ApprovalStatusCode" (meaning)
SELECT 'Approved'
WHERE NOT EXISTS (
    SELECT 1 FROM "ApprovalStatusCode" WHERE meaning = 'Approved'
);

INSERT INTO "ApprovalStatusCode" (meaning)
SELECT 'Rejected'
WHERE NOT EXISTS (
    SELECT 1 FROM "ApprovalStatusCode" WHERE meaning = 'Rejected'
);

---------------------------------------------------
-- 2. Insert Organizations
---------------------------------------------------

INSERT INTO "Organization" (name, abbreviation, unit)
SELECT 'Boston University Computer Science Club', 'BU CSC', 'Student Organizations'
WHERE NOT EXISTS (
    SELECT 1 FROM "Organization" WHERE name = 'Boston University Computer Science Club'
);

INSERT INTO "Organization" (name, abbreviation, unit)
SELECT 'Boston University Art Society', 'BU Art', 'Arts and Culture'
WHERE NOT EXISTS (
    SELECT 1 FROM "Organization" WHERE name = 'Boston University Art Society'
);

---------------------------------------------------
-- 3. Insert People
---------------------------------------------------

-- Insert Organizer: Alexander Miller
INSERT INTO "Person" (name, email, role, affiliation_id, image)
SELECT 
    'Alexander Miller', 
    'alexjmil@bu.edu', 
    'ORGANIZER', 
    (SELECT id FROM "Organization" WHERE abbreviation = 'BU CSC' LIMIT 1), 
    'https://lh3.googleusercontent.com/a/ACg8ocIh_n7BIeodcPRHeJLjEwN0TJpffmK2ExomJhE_W4y4Fi7BNg=s96-c'
WHERE NOT EXISTS (
    SELECT 1 FROM "Person" WHERE email = 'alexjmil@bu.edu'
);

-- Insert Additional Organizers and Users
INSERT INTO "Person" (name, email, role, affiliation_id, image)
SELECT 
    'Emily Clark', 
    'emilyc@bu.edu', 
    'ORGANIZER', 
    (SELECT id FROM "Organization" WHERE abbreviation = 'BU Art' LIMIT 1), 
    'https://example.com/images/emily.jpg'
WHERE NOT EXISTS (
    SELECT 1 FROM "Person" WHERE email = 'emilyc@bu.edu'
);

INSERT INTO "Person" (name, email, role, affiliation_id, image)
SELECT 
    'John Doe', 
    'johndoe@bu.edu', 
    'USER', 
    (SELECT id FROM "Organization" WHERE abbreviation = 'BU CSC' LIMIT 1), 
    'https://example.com/images/john.jpg'
WHERE NOT EXISTS (
    SELECT 1 FROM "Person" WHERE email = 'johndoe@bu.edu'
);

INSERT INTO "Person" (name, email, role, affiliation_id, image)
SELECT 
    'Jane Smith', 
    'janesmith@bu.edu', 
    'USER', 
    (SELECT id FROM "Organization" WHERE abbreviation = 'BU Art' LIMIT 1), 
    'https://example.com/images/jane.jpg'
WHERE NOT EXISTS (
    SELECT 1 FROM "Person" WHERE email = 'janesmith@bu.edu'
);

INSERT INTO "Person" (name, email, role, affiliation_id, image)
SELECT 
    'Michael Brown', 
    'michaelb@bu.edu', 
    'USER', 
    (SELECT id FROM "Organization" WHERE abbreviation = 'BU CSC' LIMIT 1), 
    'https://example.com/images/michael.jpg'
WHERE NOT EXISTS (
    SELECT 1 FROM "Person" WHERE email = 'michaelb@bu.edu'
);

INSERT INTO "Person" (name, email, role, affiliation_id, image)
SELECT 
    'Sarah Johnson', 
    'sarahj@bu.edu', 
    'USER', 
    (SELECT id FROM "Organization" WHERE abbreviation = 'BU Art' LIMIT 1), 
    'https://example.com/images/sarah.jpg'
WHERE NOT EXISTS (
    SELECT 1 FROM "Person" WHERE email = 'sarahj@bu.edu'
);

---------------------------------------------------
-- 4. Insert Categories
---------------------------------------------------

INSERT INTO "Category" (name)
SELECT 'Workshop'
WHERE NOT EXISTS (
    SELECT 1 FROM "Category" WHERE name = 'Workshop'
);

INSERT INTO "Category" (name)
SELECT 'Seminar'
WHERE NOT EXISTS (
    SELECT 1 FROM "Category" WHERE name = 'Seminar'
);

INSERT INTO "Category" (name)
SELECT 'Networking'
WHERE NOT EXISTS (
    SELECT 1 FROM "Category" WHERE name = 'Networking'
);

INSERT INTO "Category" (name)
SELECT 'Competition'
WHERE NOT EXISTS (
    SELECT 1 FROM "Category" WHERE name = 'Competition'
);

---------------------------------------------------
-- 5. Insert Events
---------------------------------------------------

-- Insert Upcoming Events
INSERT INTO "Event" (
    title, event_start, event_end, reg_start, reg_end, estimated_participants,
    location, transit, description, category_id, coordinator_id, organization_id, image, application_password
)
SELECT 
    'AI Workshop', 
    '2024-11-10', 
    '2024-11-12', 
    '2024-11-05', 
    '2024-11-09', 
    50, 
    'BU Main Hall', 
    'Subway', 
    'An introductory workshop on Artificial Intelligence.', 
    (SELECT id FROM "Category" WHERE name = 'Workshop' LIMIT 1), 
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1), 
    (SELECT id FROM "Organization" WHERE abbreviation = 'BU CSC' LIMIT 1), 
    'dummyimage', -- Image set to NULL
    'securepassword1'
WHERE NOT EXISTS (
    SELECT 1 FROM "Event" WHERE title = 'AI Workshop'
);

INSERT INTO "Event" (
    title, event_start, event_end, reg_start, reg_end, estimated_participants,
    location, transit, description, category_id, coordinator_id, organization_id, image, application_password
)
SELECT 
    'Coding Competition', 
    '2024-11-05', 
    '2024-11-06', 
    '2024-10-31', 
    '2024-11-04', 
    150, 
    'BU Tech Lab', 
    'Bus', 
    'A 24-hour coding competition for BU students.', 
    (SELECT id FROM "Category" WHERE name = 'Competition' LIMIT 1), 
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1), 
    (SELECT id FROM "Organization" WHERE abbreviation = 'BU CSC' LIMIT 1), 
    'dummyimage', -- Image set to NULL
    'securepassword4'
WHERE NOT EXISTS (
    SELECT 1 FROM "Event" WHERE title = 'Coding Competition'
);

-- Insert Past Events
INSERT INTO "Event" (
    title, event_start, event_end, reg_start, reg_end, estimated_participants,
    location, transit, description, category_id, coordinator_id, organization_id, image, application_password
)
SELECT 
    'Data Science Seminar', 
    '2024-10-10', 
    '2024-10-12', 
    '2024-09-15', 
    '2024-10-09', 
    100, 
    'BU Conference Center', 
    'Bus', 
    'A seminar on the latest trends in Data Science.', 
    (SELECT id FROM "Category" WHERE name = 'Seminar' LIMIT 1), 
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1), 
    (SELECT id FROM "Organization" WHERE abbreviation = 'BU CSC' LIMIT 1), 
    'dummyimage', -- Image set to NULL
    'securepassword2'
WHERE NOT EXISTS (
    SELECT 1 FROM "Event" WHERE title = 'Data Science Seminar'
);

INSERT INTO "Event" (
    title, event_start, event_end, reg_start, reg_end, estimated_participants,
    location, transit, description, category_id, coordinator_id, organization_id, image, application_password
)
SELECT 
    'Art Exhibition', 
    '2024-11-15', 
    '2024-11-20', 
    '2024-11-10', 
    '2024-11-14', 
    200, 
    'BU Art Gallery', 
    'Walk', 
    'An exhibition showcasing student artwork.', 
    (SELECT id FROM "Category" WHERE name = 'Networking' LIMIT 1), 
    (SELECT id FROM "Person" WHERE email = 'emilyc@bu.edu' LIMIT 1), 
    (SELECT id FROM "Organization" WHERE abbreviation = 'BU Art' LIMIT 1), 
    'dummyimage', -- Image set to NULL
    'securepassword3'
WHERE NOT EXISTS (
    SELECT 1 FROM "Event" WHERE title = 'Art Exhibition'
);

---------------------------------------------------
-- 6. Insert Reasons
---------------------------------------------------

INSERT INTO "Reason" (meaning)
SELECT 'Reason 1'
WHERE NOT EXISTS (
    SELECT 1 FROM "Reason" WHERE meaning = 'Reason 1'
);

INSERT INTO "Reason" (meaning)
SELECT 'Reason 2'
WHERE NOT EXISTS (
    SELECT 1 FROM "Reason" WHERE meaning = 'Reason 2'
);

INSERT INTO "Reason" (meaning)
SELECT 'Reason 3'
WHERE NOT EXISTS (
    SELECT 1 FROM "Reason" WHERE meaning = 'Reason 3'
);

---------------------------------------------------
-- 7. Insert Applications
---------------------------------------------------

-- Applications for AI Workshop
INSERT INTO "Application" (
    date_applied, approval_status, reason_id, applicant_id, event_id, updated_by_id
)
SELECT 
    '2024-10-29',
    (SELECT id FROM "ApprovalStatusCode" WHERE meaning = 'Approved' LIMIT 1),
    (SELECT id FROM "Reason" WHERE meaning = 'Reason 1' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'johndoe@bu.edu' LIMIT 1),
    (SELECT id FROM "Event" WHERE title = 'AI Workshop' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "Application" 
    WHERE applicant_id = (SELECT id FROM "Person" WHERE email = 'johndoe@bu.edu' LIMIT 1)
      AND event_id = (SELECT id FROM "Event" WHERE title = 'AI Workshop' LIMIT 1)
      AND date_applied = '2024-10-29'
);

INSERT INTO "Application" (
    date_applied, approval_status, reason_id, applicant_id, event_id, updated_by_id
)
SELECT 
    '2024-10-30',
    (SELECT id FROM "ApprovalStatusCode" WHERE meaning = 'Pending' LIMIT 1),
    (SELECT id FROM "Reason" WHERE meaning = 'Reason 2' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'janesmith@bu.edu' LIMIT 1),
    (SELECT id FROM "Event" WHERE title = 'AI Workshop' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "Application" 
    WHERE applicant_id = (SELECT id FROM "Person" WHERE email = 'janesmith@bu.edu' LIMIT 1)
      AND event_id = (SELECT id FROM "Event" WHERE title = 'AI Workshop' LIMIT 1)
      AND date_applied = '2024-10-30'
);

-- Applications for Data Science Seminar
INSERT INTO "Application" (
    date_applied, approval_status, reason_id, applicant_id, event_id, updated_by_id
)
SELECT 
    '2024-10-05',
    (SELECT id FROM "ApprovalStatusCode" WHERE meaning = 'Approved' LIMIT 1),
    (SELECT id FROM "Reason" WHERE meaning = 'Reason 1' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'johndoe@bu.edu' LIMIT 1),
    (SELECT id FROM "Event" WHERE title = 'Data Science Seminar' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "Application" 
    WHERE applicant_id = (SELECT id FROM "Person" WHERE email = 'johndoe@bu.edu' LIMIT 1)
      AND event_id = (SELECT id FROM "Event" WHERE title = 'Data Science Seminar' LIMIT 1)
      AND date_applied = '2024-10-05'
);

INSERT INTO "Application" (
    date_applied, approval_status, reason_id, applicant_id, event_id, updated_by_id
)
SELECT 
    '2024-10-06',
    (SELECT id FROM "ApprovalStatusCode" WHERE meaning = 'Pending' LIMIT 1),
    (SELECT id FROM "Reason" WHERE meaning = 'Reason 2' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'janesmith@bu.edu' LIMIT 1),
    (SELECT id FROM "Event" WHERE title = 'Data Science Seminar' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "Application" 
    WHERE applicant_id = (SELECT id FROM "Person" WHERE email = 'janesmith@bu.edu' LIMIT 1)
      AND event_id = (SELECT id FROM "Event" WHERE title = 'Data Science Seminar' LIMIT 1)
      AND date_applied = '2024-10-06'
);

-- Applications for Art Exhibition
INSERT INTO "Application" (
    date_applied, approval_status, reason_id, applicant_id, event_id, updated_by_id
)
SELECT 
    '2024-11-10',
    (SELECT id FROM "ApprovalStatusCode" WHERE meaning = 'Approved' LIMIT 1),
    (SELECT id FROM "Reason" WHERE meaning = 'Reason 1' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'johndoe@bu.edu' LIMIT 1),
    (SELECT id FROM "Event" WHERE title = 'Art Exhibition' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'emilyc@bu.edu' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "Application" 
    WHERE applicant_id = (SELECT id FROM "Person" WHERE email = 'johndoe@bu.edu' LIMIT 1)
      AND event_id = (SELECT id FROM "Event" WHERE title = 'Art Exhibition' LIMIT 1)
      AND date_applied = '2024-11-10'
);

INSERT INTO "Application" (
    date_applied, approval_status, reason_id, applicant_id, event_id, updated_by_id
)
SELECT 
    '2024-11-11',
    (SELECT id FROM "ApprovalStatusCode" WHERE meaning = 'Pending' LIMIT 1),
    (SELECT id FROM "Reason" WHERE meaning = 'Reason 2' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'janesmith@bu.edu' LIMIT 1),
    (SELECT id FROM "Event" WHERE title = 'Art Exhibition' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'emilyc@bu.edu' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "Application" 
    WHERE applicant_id = (SELECT id FROM "Person" WHERE email = 'janesmith@bu.edu' LIMIT 1)
      AND event_id = (SELECT id FROM "Event" WHERE title = 'Art Exhibition' LIMIT 1)
      AND date_applied = '2024-11-11'
);

-- Applications for Coding Competition
INSERT INTO "Application" (
    date_applied, approval_status, reason_id, applicant_id, event_id, updated_by_id
)
SELECT 
    '2024-10-28',
    (SELECT id FROM "ApprovalStatusCode" WHERE meaning = 'Approved' LIMIT 1),
    (SELECT id FROM "Reason" WHERE meaning = 'Reason 1' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'johndoe@bu.edu' LIMIT 1),
    (SELECT id FROM "Event" WHERE title = 'Coding Competition' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "Application" 
    WHERE applicant_id = (SELECT id FROM "Person" WHERE email = 'johndoe@bu.edu' LIMIT 1)
      AND event_id = (SELECT id FROM "Event" WHERE title = 'Coding Competition' LIMIT 1)
      AND date_applied = '2024-10-28'
);

INSERT INTO "Application" (
    date_applied, approval_status, reason_id, applicant_id, event_id, updated_by_id
)
SELECT 
    '2024-10-29',
    (SELECT id FROM "ApprovalStatusCode" WHERE meaning = 'Pending' LIMIT 1),
    (SELECT id FROM "Reason" WHERE meaning = 'Reason 2' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'janesmith@bu.edu' LIMIT 1),
    (SELECT id FROM "Event" WHERE title = 'Coding Competition' LIMIT 1),
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "Application" 
    WHERE applicant_id = (SELECT id FROM "Person" WHERE email = 'janesmith@bu.edu' LIMIT 1)
      AND event_id = (SELECT id FROM "Event" WHERE title = 'Coding Competition' LIMIT 1)
      AND date_applied = '2024-10-29'
);

---------------------------------------------------
-- 8. Insert Hour Submissions
---------------------------------------------------

-- Insert Approved Hour Submissions
INSERT INTO "HourSubmission" (
    volunteer_id, event_id, hours, feedback, approval_status, description, updated_by_id
)
SELECT 
    (SELECT id FROM "Person" WHERE email = 'johndoe@bu.edu' LIMIT 1),
    (SELECT id FROM "Event" WHERE title = 'AI Workshop' LIMIT 1),
    5.0,
    'Great workshop!',
    (SELECT id FROM "ApprovalStatusCode" WHERE meaning = 'Approved' LIMIT 1),
    'Assisted with setup.',
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "HourSubmission" 
    WHERE volunteer_id = (SELECT id FROM "Person" WHERE email = 'johndoe@bu.edu' LIMIT 1)
      AND event_id = (SELECT id FROM "Event" WHERE title = 'AI Workshop' LIMIT 1)
      AND hours = 5.0
      AND description = 'Assisted with setup.'
);

INSERT INTO "HourSubmission" (
    volunteer_id, event_id, hours, feedback, approval_status, description, updated_by_id
)
SELECT 
    (SELECT id FROM "Person" WHERE email = 'janesmith@bu.edu' LIMIT 1),
    (SELECT id FROM "Event" WHERE title = 'Data Science Seminar' LIMIT 1),
    3.0,
    'Informative seminar.',
    (SELECT id FROM "ApprovalStatusCode" WHERE meaning = 'Approved' LIMIT 1),
    'Managed registration desk.',
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "HourSubmission" 
    WHERE volunteer_id = (SELECT id FROM "Person" WHERE email = 'janesmith@bu.edu' LIMIT 1)
      AND event_id = (SELECT id FROM "Event" WHERE title = 'Data Science Seminar' LIMIT 1)
      AND hours = 3.0
      AND description = 'Managed registration desk.'
);

-- Insert Pending Hour Submissions
INSERT INTO "HourSubmission" (
    volunteer_id, event_id, hours, feedback, approval_status, description, updated_by_id
)
SELECT 
    (SELECT id FROM "Person" WHERE email = 'johndoe@bu.edu' LIMIT 1),
    (SELECT id FROM "Event" WHERE title = 'Art Exhibition' LIMIT 1),
    4.0,
    NULL,
    (SELECT id FROM "ApprovalStatusCode" WHERE meaning = 'Pending' LIMIT 1),
    'Helped with event setup.',
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "HourSubmission" 
    WHERE volunteer_id = (SELECT id FROM "Person" WHERE email = 'johndoe@bu.edu' LIMIT 1)
      AND event_id = (SELECT id FROM "Event" WHERE title = 'Art Exhibition' LIMIT 1)
      AND hours = 4.0
      AND description = 'Helped with event setup.'
);

INSERT INTO "HourSubmission" (
    volunteer_id, event_id, hours, feedback, approval_status, description, updated_by_id
)
SELECT 
    (SELECT id FROM "Person" WHERE email = 'janesmith@bu.edu' LIMIT 1),
    (SELECT id FROM "Event" WHERE title = 'Coding Competition' LIMIT 1),
    6.0,
    NULL,
    (SELECT id FROM "ApprovalStatusCode" WHERE meaning = 'Pending' LIMIT 1),
    'Technical support.',
    (SELECT id FROM "Person" WHERE email = 'alexjmil@bu.edu' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "HourSubmission" 
    WHERE volunteer_id = (SELECT id FROM "Person" WHERE email = 'janesmith@bu.edu' LIMIT 1)
      AND event_id = (SELECT id FROM "Event" WHERE title = 'Coding Competition' LIMIT 1)
      AND hours = 6.0
      AND description = 'Technical support.'
);

---------------------------------------------------
-- 9. Commit the Transaction
---------------------------------------------------

COMMIT;

---------------------------------------------------
-- 10. Optional: Verify Insertions
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
