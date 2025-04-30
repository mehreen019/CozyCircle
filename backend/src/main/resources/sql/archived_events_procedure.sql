
USE eventmanage;

-- Add an 'archived' column to the event table if it doesn't exist
-- BOOLEAN is a synonym for TINYINT(1) in MySQL
ALTER TABLE event ADD COLUMN archived BOOLEAN DEFAULT FALSE;

-- Set delimiter for procedure and event definitions
DELIMITER //

-- Drop the procedure if it already exists (optional, but good for rerunning scripts)
DROP PROCEDURE IF EXISTS ArchiveOldEvents //

-- Create a stored procedure to archive old events
CREATE PROCEDURE ArchiveOldEvents()
BEGIN
    -- Archive events with dates before today and not already archived
    UPDATE event
    SET archived = TRUE
    WHERE date < CURDATE() AND archived = FALSE;

    -- Return a message indicating the number of archived events
    SELECT CONCAT('Archived ', ROW_COUNT(), ' events') AS result;
END // -- Procedure definition ends here

-- Drop the event scheduler if it already exists (optional, good for rerunning scripts)
DROP EVENT IF EXISTS daily_event_archiving //
