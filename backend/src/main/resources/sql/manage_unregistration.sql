DELIMITER //

CREATE PROCEDURE HandleUnregistration(IN p_eventId BIGINT, IN p_email VARCHAR(255))
BEGIN
    DECLARE user_found INT;

    -- Check if the user is registered
    SELECT COUNT(*) INTO user_found
    FROM eventmanage.attendee
    WHERE eventid = p_eventId AND email = p_email;

    IF user_found > 0 THEN
        -- Remove the user from attendees
        DELETE FROM eventmanage.attendee
        WHERE eventid = p_eventId AND email = p_email;

        -- Increase the capacity
        UPDATE eventmanage.event
        SET capacity = capacity + 1
        WHERE id = p_eventId;

        -- Check and promote someone from the waitlist
        CALL PromoteFromWaitlist(p_eventId);
    ELSE
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User not found in attendee list.';
    END IF;
END;
//

CREATE PROCEDURE PromoteFromWaitlist(IN p_eventId BIGINT)
BEGIN
    DECLARE first_waitlist_id BIGINT DEFAULT NULL;
    DECLARE first_waitlist_name VARCHAR(255);
    DECLARE first_waitlist_email VARCHAR(255);

    -- Try to get the first person on the waitlist
    SELECT id, name, email
    INTO first_waitlist_id, first_waitlist_name, first_waitlist_email
    FROM eventmanage.waitlist
    WHERE eventid = p_eventId
    ORDER BY position ASC
    LIMIT 1;

    IF first_waitlist_id IS NOT NULL THEN
        -- Add to attendees
        INSERT INTO eventmanage.attendee (eventid, name, email)
        VALUES (p_eventId, first_waitlist_name, first_waitlist_email);

        -- Remove from waitlist
        DELETE FROM eventmanage.waitlist
        WHERE id = first_waitlist_id;

        -- Update waitlist positions
        UPDATE eventmanage.waitlist
        SET position = position - 1
        WHERE eventid = p_eventId AND position > 1;

        -- Decrease capacity (attendee added)
        UPDATE eventmanage.event
        SET capacity = capacity - 1
        WHERE id = p_eventId;
    END IF;
END;
//

DELIMITER ;
