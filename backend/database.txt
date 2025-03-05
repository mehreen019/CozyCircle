select * from eventmanage.event;

use eventmanage;
DELIMITER //

CREATE TRIGGER decrease_event_capacity
AFTER INSERT ON eventmanage.attendee
FOR EACH ROW
BEGIN
    UPDATE eventmanage.event
    SET capacity = capacity - 1
    WHERE id = NEW.eventid AND capacity > 0;
END;

//

DELIMITER ;