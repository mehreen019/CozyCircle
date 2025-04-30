DELIMITER //

DROP PROCEDURE IF EXISTS CalculateMembership //

CREATE PROCEDURE CalculateMembership(IN mapping_id INT, IN p_user_id INT, IN p_event_id INT)
BEGIN
    DECLARE user_score DOUBLE;
    DECLARE total_users INT;
    DECLARE user_rank INT;
    DECLARE percentile DECIMAL(10,2);
    DECLARE membership_level VARCHAR(10);

    -- Get the user's score from the admin table
    SELECT score INTO user_score FROM admin WHERE id = p_user_id;

    -- If user score is NULL, default to 0
    IF user_score IS NULL THEN
        SET user_score = 0;
    END IF;

    -- Get the total number of users
    SELECT COUNT(*) INTO total_users FROM admin;

    -- Calculate the user's rank using RANK()
    SELECT usr_rank INTO user_rank
    FROM (
        SELECT id, RANK() OVER (ORDER BY score DESC) AS usr_rank
        FROM admin
    ) ranked_users
    WHERE id = p_user_id;

    -- If user rank is NULL, default to total_users (lowest rank)
    IF user_rank IS NULL THEN
        SET user_rank = total_users;
    END IF;

    -- Calculate percentile
    SET percentile = (user_rank * 100.0) / total_users;

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
    WHERE id = mapping_id;
END //

DELIMITER ;
