-- This script will test the CalculateMembership stored procedure
-- Make sure to replace the values with actual IDs from your database

-- Example call to the stored procedure
CALL CalculateMembership(
    10,   -- mapping_id: The ID of the attendee record to update
    5,    -- p_user_id: The ID of the user in the admin table
    3     -- p_event_id: The ID of the event
);

-- Verify the result by querying the attendee table
SELECT * FROM attendee WHERE id = 10;

-- Check the admin table to see if the user has a score
SELECT id, username, score FROM admin WHERE id = 5;

-- Check all attendee records for this user and their membership levels
SELECT a.id, a.email, a.eventid, a.membership, e.name as event_name
FROM attendee a
JOIN event e ON a.eventid = e.id
WHERE a.email = (SELECT email FROM admin WHERE id = 5); 