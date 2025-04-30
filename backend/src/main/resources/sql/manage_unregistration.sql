DELIMITER //

DROP PROCEDURE IF EXISTS HandleUnregistration//

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

        -- Attempt to promote someone from the waitlist
        CALL PromoteFromWaitlist(p_eventId);
    ELSE
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User not found in attendee list.';
    END IF;
END//

DROP PROCEDURE IF EXISTS PromoteFromWaitlist//

CREATE PROCEDURE PromoteFromWaitlist(IN p_eventId BIGINT)
BEGIN
    DECLARE first_waitlist_id BIGINT DEFAULT NULL;
    DECLARE promoted_name VARCHAR(255);
    DECLARE promoted_email VARCHAR(255);
    DECLARE promoted_pos INT;

    -- Find the first person on the waitlist
    SELECT id, name, email, position
    INTO first_waitlist_id, promoted_name, promoted_email, promoted_pos
    FROM eventmanage.wait_list
    WHERE eventid = p_eventId
    ORDER BY position ASC
    LIMIT 1;

    IF first_waitlist_id IS NOT NULL THEN
        -- Remove from waitlist
        DELETE FROM eventmanage.wait_list
        WHERE id = first_waitlist_id;

        -- Decrement positions for those remaining on the waitlist
        UPDATE eventmanage.wait_list
        SET position = position - 1
        WHERE eventid = p_eventId AND position > promoted_pos;

        -- Add to attendees
        INSERT INTO eventmanage.attendee (eventid, name, email)
        VALUES (p_eventId, promoted_name, promoted_email);
    END IF;
END//

DROP PROCEDURE IF EXISTS GetAndRemoveFirstWaitlistEntry//

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

        -- Decrement positions for those remaining on the waitlist
        UPDATE eventmanage.wait_list
        SET position = position - 1
        WHERE eventid = p_eventId AND position > promoted_pos;
    ELSE
        -- If no one found, set output parameters to indicate this
        SET p_promotedName = NULL;
        SET p_promotedEmail = NULL;
    END IF;
END//

DELIMITER ;