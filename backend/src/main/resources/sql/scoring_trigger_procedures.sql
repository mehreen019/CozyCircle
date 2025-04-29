-- Create a stored procedure to calculate user score
DELIMITER //

CREATE PROCEDURE calculate_user_score(IN user_id INT)
BEGIN
    DECLARE event_count INT DEFAULT 0;
    DECLARE rating_count INT DEFAULT 0;
    DECLARE attend_count INT DEFAULT 0;
    DECLARE user_score DOUBLE DEFAULT 0.0;
    DECLARE user_email VARCHAR(255);
    DECLARE user_username VARCHAR(255);
    
    -- Get user email and username
    SELECT email, username INTO user_email, user_username 
    FROM admin 
    WHERE id = user_id;
    
    -- Count events created by user
    SELECT COUNT(*) INTO event_count 
    FROM event 
    WHERE username = user_username;
    
    -- Count ratings provided by user
    SELECT COUNT(*) INTO rating_count 
    FROM event_ratings 
    WHERE user_id = user_id;
    
    -- Count events attended by user
    SELECT COUNT(*) INTO attend_count 
    FROM attendee 
    WHERE email = user_email;
    
    -- Calculate score using weighted average
    -- Events created - weight 5
    -- Ratings provided - weight 2
    -- Events attended - weight 3
    SET user_score = (event_count * 5) + (rating_count * 2) + (attend_count * 3);
    
    -- Cap score at 100 (optional)
    -- SET user_score = LEAST(100, user_score);
    
    -- Update user's score
    UPDATE admin 
    SET score = user_score 
    WHERE id = user_id;
END //

DELIMITER ;

-- Create trigger for when a user creates an event
DELIMITER //

CREATE TRIGGER score_after_event_insert
AFTER INSERT ON event
FOR EACH ROW
BEGIN
    DECLARE user_id INT;
    
    -- Find the user ID based on username
    SELECT id INTO user_id 
    FROM admin 
    WHERE username = NEW.username;
    
    IF user_id IS NOT NULL THEN
        -- Call procedure to update score
        CALL calculate_user_score(user_id);
    END IF;
END //

DELIMITER ;

-- Create trigger for when a user provides a rating
DELIMITER //

CREATE TRIGGER score_after_rating_insert
AFTER INSERT ON event_ratings
FOR EACH ROW
BEGIN
    -- Call procedure to update score
    CALL calculate_user_score(NEW.user_id);
END //

DELIMITER ;

-- Create trigger for when a user registers for an event
DELIMITER //

DROP TRIGGER score_after_attendee_insert;

DELIMITER //

CREATE TRIGGER score_after_attendee_insert
    AFTER INSERT ON attendee
    FOR EACH ROW
BEGIN
    DECLARE user_id INT;

    -- Find *an* admin user ID based on email, taking only the first match
    SELECT id INTO user_id
    FROM admin
    WHERE email = NEW.email
    LIMIT 1; -- Added LIMIT 1 here

    IF user_id IS NOT NULL THEN
        -- Call procedure to update score
        CALL calculate_user_score(user_id);
    END IF;
END //

DELIMITER ;



-- Create a trigger to decrease user's score after an attendee record is deleted

DELIMITER //

DROP TRIGGER score_after_attendee_delete;

CREATE TRIGGER score_after_attendee_delete
    AFTER DELETE ON attendee
    FOR EACH ROW
BEGIN
    DECLARE user_id INT;

    -- Find *an* admin user ID based on email, taking only the first match if duplicates exist
    SELECT id INTO user_id
    FROM admin
    WHERE email = OLD.email
    LIMIT 1; -- Added LIMIT 1 here

    IF user_id IS NOT NULL THEN
        -- Call existing procedure to recalculate score
        CALL calculate_user_score(user_id);
    END IF;
END //

DELIMITER ;

-- Create score update log table if it doesn't exist (optional)
CREATE TABLE IF NOT EXISTS score_update_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    event_id BIGINT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin(id)
);


-- Calculate initial scores for all existing users
DELIMITER //

CREATE PROCEDURE initialize_all_user_scores()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE user_id INT;
    DECLARE user_cursor CURSOR FOR SELECT id FROM admin;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN user_cursor;
    
    read_loop: LOOP
        FETCH user_cursor INTO user_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        CALL calculate_user_score(user_id);
    END LOOP;
    
    CLOSE user_cursor;
END //

DELIMITER ;

-- Run this to initialize scores for all existing users
CALL initialize_all_user_scores();

-- Optional: Drop the initialization procedure after use
DROP PROCEDURE initialize_all_user_scores;