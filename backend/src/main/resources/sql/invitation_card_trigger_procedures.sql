DELIMITER //

CREATE PROCEDURE CalculateMembership(IN p_user_id BIGINT, IN p_event_id BIGINT)
BEGIN
    -- Declare variables
    DECLARE user_score INT;
    DECLARE membership_level VARCHAR(10);
    DECLARE user_rank INT;
    DECLARE total_users INT;
    DECLARE percentile DECIMAL(10,2);
    
    -- Get total number of attendees for the event
    SELECT COUNT(*) INTO total_users FROM attendee WHERE eventid = p_event_id;
    
    -- Calculate user's score based on previous events attended and ratings given
    -- This is a simplified example - you might want to customize this based on your scoring criteria
    SELECT COUNT(a.id) INTO user_score 
    FROM attendee a 
    WHERE a.email = (SELECT email FROM attendee WHERE id = p_user_id);
    
    -- Calculate user's rank among all attendees
    SELECT COUNT(*) + 1 INTO user_rank
    FROM attendee a1
    JOIN (
        SELECT a2.email, COUNT(a2.id) as score
        FROM attendee a2
        GROUP BY a2.email
    ) scores ON a1.email = scores.email
    WHERE scores.score > user_score
    AND a1.eventid = p_event_id;
    
    -- Calculate percentile
    SET percentile = (user_rank / total_users) * 100;
    
    -- Determine membership level based on percentile
    IF percentile <= 25 THEN
        SET membership_level = 'PLATINUM';
    ELSEIF percentile <= 50 THEN
        SET membership_level = 'GOLD';
    ELSEIF percentile <= 75 THEN
        SET membership_level = 'SILVER';
    ELSE
        SET membership_level = 'BRONZE';
    END IF;
    
    -- Update the attendee record with membership level
    UPDATE attendee 
    SET membership = membership_level
    WHERE id = p_user_id AND eventid = p_event_id;
    
END //

DELIMITER ;