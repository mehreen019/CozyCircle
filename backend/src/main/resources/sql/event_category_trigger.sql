
ALTER TABLE event ADD COLUMN time_category VARCHAR(20);

DROP TRIGGER IF EXISTS before_event_insert_update;
DROP TRIGGER IF EXISTS before_event_update;


DELIMITER //
CREATE TRIGGER before_event_insert_update
    BEFORE INSERT ON event
    FOR EACH ROW
BEGIN
    IF DATE(NEW.date) = CURRENT_DATE() THEN
        SET NEW.time_category = 'CURRENT';
    ELSEIF DATE(NEW.date) > CURRENT_DATE() THEN
        SET NEW.time_category = 'UPCOMING';
    ELSE
        SET NEW.time_category = 'PAST';
    END IF;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER before_event_update
    BEFORE UPDATE ON event
    FOR EACH ROW
BEGIN
    IF NEW.date = CURRENT_DATE() THEN
        SET NEW.time_category = 'CURRENT';
    ELSEIF NEW.date > CURRENT_DATE() THEN
        SET NEW.time_category = 'UPCOMING';
    ELSE
        SET NEW.time_category = 'PAST';
    END IF;
END;
//
DELIMITER ;


SET GLOBAL event_scheduler = ON;


DROP EVENT IF EXISTS update_event_time_categories;
DELIMITER //
CREATE EVENT update_event_time_categories
    ON SCHEDULE EVERY 1 DAY
        STARTS (CURRENT_DATE + INTERVAL 1 DAY)
    DO
    BEGIN
        UPDATE event
        SET time_category = CASE
                                WHEN DATE(date) = CURRENT_DATE() THEN 'CURRENT'
                                WHEN DATE(date) > CURRENT_DATE() THEN 'UPCOMING'
                                ELSE 'PAST'
            END;
    END;
//
DELIMITER ;


UPDATE event
SET time_category = CASE
                        WHEN DATE(date) = CURRENT_DATE() THEN 'CURRENT'
                        WHEN DATE(date) > CURRENT_DATE() THEN 'UPCOMING'
                        ELSE 'PAST'
    END;
