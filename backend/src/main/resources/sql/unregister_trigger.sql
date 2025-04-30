DELIMITER $$

-- Create the trigger
CREATE TRIGGER after_attendee_delete
    AFTER DELETE ON attendee
    FOR EACH ROW
BEGIN
    DECLARE first_waitlisted_id BIGINT;
    DECLARE first_waitlisted_name VARCHAR(255);
    DECLARE first_waitlisted_email VARCHAR(255);
    DECLARE first_waitlisted_position INT;
    DECLARE new_attendee_id BIGINT;

    -- Find the first person on the waitlist for this event
    SELECT id, name, email, position
    INTO first_waitlisted_id, first_waitlisted_name, first_waitlisted_email, first_waitlisted_position
    FROM wait_list
    WHERE eventid = OLD.eventid
    ORDER BY position ASC
        LIMIT 1;

    -- If someone was found, promote them
    IF first_waitlisted_id IS NOT NULL THEN

        -- Get the next attendee ID
    SELECT COALESCE(MAX(id) + 1, 1)
    INTO new_attendee_id
    FROM attendee;

    -- Insert the waitlisted person as an attendee
    INSERT INTO attendee (id, eventid, name, email)
    VALUES (new_attendee_id, OLD.eventid, first_waitlisted_name, first_waitlisted_email);

    -- Remove the promoted person from waitlist
    DELETE FROM wait_list
    WHERE id = first_waitlisted_id;

    -- Update positions of remaining waitlist
    UPDATE wait_list
    SET position = position - 1
    WHERE eventid = OLD.eventid AND position > first_waitlisted_position;

    ELSE
        -- If no one is on the waitlist, increase event capacity
    UPDATE event
    SET capacity = capacity + 1
    WHERE id = OLD.eventid;
END IF;

END$$

DELIMITER ;
