-- Create a trigger to decrease user's score after an attendee record is deleted

DELIMITER //

CREATE TRIGGER score_after_attendee_delete
AFTER DELETE ON attendee
FOR EACH ROW
BEGIN
    DECLARE user_id INT;
    
    -- Find the user ID based on email
    SELECT id INTO user_id 
    FROM admin 
    WHERE email = OLD.email;
    
    IF user_id IS NOT NULL THEN
        -- Call existing procedure to recalculate score
        -- This will automatically decrease the score since there's one less attended event
        CALL calculate_user_score(user_id);
        
        -- Log the update (optional)
        INSERT INTO score_update_log (user_id, action, event_id, timestamp)
        VALUES (user_id, 'UNREGISTER', OLD.eventid, NOW());
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