DELIMITER //

DROP TRIGGER manage_event_registration;
//

CREATE TRIGGER manage_event_registration
BEFORE INSERT ON eventmanage.attendee
FOR EACH ROW
BEGIN
    DECLARE current_capacity INT;
    DECLARE waitlist_position INT;

    -- Get current capacity of the event
    SELECT capacity INTO current_capacity
    FROM eventmanage.event
    WHERE id = NEW.eventid;

    -- Check if capacity is full
    IF current_capacity <= 0 THEN
        -- Determine next waitlist position
        SELECT IFNULL(MAX(position), 0) + 1 INTO waitlist_position
        FROM eventmanage.wait_list
        WHERE eventid = NEW.eventid;

        -- Insert into waitlist
        INSERT INTO eventmanage.wait_list (eventid, name, email, registration_time, position)
        VALUES (NEW.eventid, NEW.name, NEW.email, NOW(), waitlist_position);

        -- Cancel original attendee insert
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Event is full. User added to waitlist.';
    END IF;
END;
//

DELIMITER ;
