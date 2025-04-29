-- Step 1: Add the new column (NO IF NOT EXISTS allowed!)
ALTER TABLE event ADD COLUMN time_category VARCHAR(20);

-- Step 2: Drop triggers if exist
DROP TRIGGER IF EXISTS before_event_insert_update;
DROP TRIGGER IF EXISTS before_event_update;

-- Step 3: Create triggers
DELIMITER //
CREATE TRIGGER before_event_insert_update
    BEFORE INSERT ON event
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

-- Step 4: Make sure Event Scheduler is ON
SET GLOBAL event_scheduler = ON;

-- Step 5: Create Scheduled Event
DROP EVENT IF EXISTS update_event_time_categories;
DELIMITER //
CREATE EVENT update_event_time_categories
    ON SCHEDULE EVERY 1 DAY
        STARTS (CURRENT_DATE + INTERVAL 1 DAY)
    DO
    BEGIN
        UPDATE event
        SET time_category = CASE
                                WHEN date = CURRENT_DATE() THEN 'CURRENT'
                                WHEN date > CURRENT_DATE() THEN 'UPCOMING'
                                ELSE 'PAST'
            END;
    END;
//
DELIMITER ;

-- Step 6: Immediately update all current events
UPDATE event
SET time_category = CASE
                        WHEN date = CURRENT_DATE() THEN 'CURRENT'
                        WHEN date > CURRENT_DATE() THEN 'UPCOMING'
                        ELSE 'PAST'
    END;
