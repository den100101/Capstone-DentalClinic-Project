-- Swiss Dental Clinic database checks
-- READ ONLY: these statements only SELECT information.
-- IMPORTANT: confirm the table and column names in the LIVE database first.
-- Do not run any ALTER, UPDATE, DELETE, or DROP statement as part of this review.

-- 1. List tables in the selected database.
SHOW TABLES;

-- 2. Check for appointment slots with more than one appointment.
-- Confirm the table and column names first.
SELECT appointment_date, appointment_time, COUNT(*) AS appointment_count
FROM appointments
GROUP BY appointment_date, appointment_time
HAVING COUNT(*) > 1;

-- 3. Check for patients with repeated name, birth date, and email combinations.
SELECT name, birthdate, email, COUNT(*) AS record_count
FROM patients
GROUP BY name, birthdate, email
HAVING COUNT(*) > 1;

-- 4. Check for appointments whose patient record is missing.
SELECT a.id, a.patient_id
FROM appointments AS a
LEFT JOIN patients AS p ON p.id = a.patient_id
WHERE p.id IS NULL;

-- 5. Check for tooth records whose patient record is missing.
SELECT t.id, t.patient_id
FROM tooth_records AS t
LEFT JOIN patient AS p ON p.id = t.patient_id
WHERE p.id IS NULL;

-- 6. Check for negative payment amounts.
-- Verify the actual deployed table and column names before running.
SELECT id, amount
FROM payment
WHERE amount < 0;

-- 7. Check for negative patient balances.
-- Verify the actual deployed table and column names before running.
SELECT id, patient_id, balance, next_balance,
       estimated_treatment_cost, required_payment_before_signing
FROM patient_documents
WHERE balance < 0
   OR next_balance < 0
   OR estimated_treatment_cost < 0
   OR required_payment_before_signing < 0;

-- 8. Review foreign keys and indexes. These queries read database metadata.
SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME,
       REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, COLUMN_NAME;

SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME, NON_UNIQUE
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
