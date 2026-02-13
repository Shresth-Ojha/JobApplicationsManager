-- Backfill: set lastReminderAck to updatedAt for pre-existing applications
-- that still have the default CURRENT_TIMESTAMP value from the initial migration
UPDATE "applications" SET "lastReminderAck" = "updatedAt";
