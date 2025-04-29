DELIMITER //

DROP PROCEDURE IF EXISTS CalculateMembership //

CREATE PROCEDURE CalculateMembership(IN mapping_id INT, IN p_user_id INT, IN p_event_id INT)
BEGIN
    DECLARE user_score DOUBLE;
    DECLARE total_users INT;
    DECLARE user_rank INT;
    DECLARE percentile DECIMAL(10,2);
    DECLARE membership_level VARCHAR(10);
    DECLARE debug_message VARCHAR(255);

    -- Set debug message
    SET debug_message = CONCAT('Starting procedure with mapping_id=', mapping_id, ', p_user_id=', p_user_id, ', p_event_id=', p_event_id);
    
    SELECT debug_message;

    -- Get the user's score from the admin table
    SELECT score INTO user_score FROM admin WHERE id = p_user_id;
    
    SET debug_message = CONCAT('User score: ', IFNULL(user_score, 'NULL'));
    SELECT debug_message;

    -- If user score is NULL, default to 0
    IF user_score IS NULL THEN
        SET user_score = 0;
    END IF;

    -- Get the total number of users
    SELECT COUNT(*) INTO total_users FROM admin;
    
    SET debug_message = CONCAT('Total users: ', total_users);
    SELECT debug_message;

    -- Calculate the user's rank using RANK()
    SELECT user_rank INTO user_rank
    FROM (
        SELECT id, RANK() OVER (ORDER BY score DESC) AS user_rank
        FROM admin
    ) ranked_users
    WHERE id = p_user_id;
    
    SET debug_message = CONCAT('User rank: ', IFNULL(user_rank, 'NULL'));
    SELECT debug_message;

    -- If user rank is NULL, default to total_users (lowest rank)
    IF user_rank IS NULL THEN
        SET user_rank = total_users;
    END IF;

    -- Calculate percentile
    SET percentile = (user_rank / total_users) * 100;
    
    SET debug_message = CONCAT('Percentile: ', percentile);
    SELECT debug_message;

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
    
    SET debug_message = CONCAT('Membership level: ', membership_level);
    SELECT debug_message;

    -- Update the attendee record with membership level
    UPDATE attendee 
    SET membership = membership_level
    WHERE id = mapping_id;
    
    SET debug_message = CONCAT('Attendee updated. Row count: ', ROW_COUNT());
    SELECT debug_message;
END //

DELIMITER ;
