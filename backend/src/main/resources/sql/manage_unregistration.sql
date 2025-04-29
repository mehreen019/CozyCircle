DELIMITER //

DROP PROCEDURE HandleUnregistration;
//

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

DROP PROCEDURE PromoteFromWaitlist//


-- Create a new procedure that returns the promoted user's details
CREATE PROCEDURE GetAndRemoveFirstWaitlistEntry(
    IN p_eventId BIGINT,
    OUT p_promotedName VARCHAR(255),
    OUT p_promotedEmail VARCHAR(255)
)
BEGIN
    DECLARE first_waitlist_id BIGINT DEFAULT NULL;
    DECLARE promoted_pos INT;

    -- Find the first person on the waitlist
    SELECT id, name, email, position
    INTO first_waitlist_id, p_promotedName, p_promotedEmail, promoted_pos
    FROM eventmanage.wait_list
    WHERE eventid = p_eventId
    ORDER BY position ASC
    LIMIT 1;

    IF first_waitlist_id IS NOT NULL THEN
        -- Remove from waitlist
        DELETE FROM eventmanage.wait_list
        WHERE id = first_waitlist_id;

        -- Decrement positions for those remaining on the waitlist *after* the deleted one
        -- Use the position we just retrieved before deleting
        UPDATE eventmanage.wait_list
        SET position = position - 1
        WHERE eventid = p_eventId AND position > promoted_pos;

        -- Note: We are NOT inserting into the attendee table here.
        -- The caller (Java code) will handle the insert using the returned values.
    ELSE
        -- If no one found, set output parameters to indicate this
        SET p_promotedName = NULL;
        SET p_promotedEmail = NULL;
    END IF;
END //

DELIMITER ;