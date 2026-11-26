-- Swiss Dental Clinic: MySQL performance indexes
-- Review the existing indexes first. Run each CREATE INDEX only if that
-- index name is not already present in the target table.
-- Take a verified backup before applying this file to the production database.

SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME, SEQ_IN_INDEX
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('appointments', 'patients', 'payment', 'notifications')
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- Appointment lookups by date/status/time, including taken-slot and daily views.
CREATE INDEX ix_appointments_date_status_time
ON appointments (appointment_date, status, appointment_time);

-- Appointment lists filtered by status and ordered/grouped by date.
CREATE INDEX ix_appointments_status_date
ON appointments (status, appointment_date);

-- Patient appointment history filtered by patient and ordered by date.
CREATE INDEX ix_appointments_patient_date
ON appointments (patient_id, appointment_date);

-- Daily patient registration report.
CREATE INDEX ix_patients_created_at
ON patients (created_at);

-- Daily payment/revenue report.
CREATE INDEX ix_payment_payment_date
ON payment (payment_date);

-- Verify index creation after running the statements.
SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME, SEQ_IN_INDEX
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
  AND INDEX_NAME IN (
    'ix_appointments_date_status_time',
    'ix_appointments_status_date',
    'ix_appointments_patient_date',
    'ix_patients_created_at',
    'ix_payment_payment_date'
  )
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
