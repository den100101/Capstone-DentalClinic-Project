# Swiss Dental Clinic — Database Safety Notes

## Why this review was made
This document lists database risks to check before the clinic relies on the system every day. It does not change the live database.

## Important: what this review did not do
- No one connected to or changed the clinic's live database.
- No backup was created.
- No backup was restored or tested.
- No database table or column was changed.
- The SQL checks in this folder only read information. Review the table names against the actual database before running them.

## Main things to review

1. **Two appointments may get the same time.** The appointment model does not show a database rule that prevents two appointments from using the same date and time. The app should check this, and the database should also protect against it where the clinic's booking rules allow.
2. **Money values may round unexpectedly.** Some payment and balance fields use decimal-like values stored as floating-point numbers. Before changing these to an exact money format, check existing records and plan a safe migration.
3. **Patient records need clear deletion rules.** Decide what should happen to appointments, payments, signatures, and tooth records if a patient record is removed. Do not delete patient records until the clinic approves a retention policy.
4. **Backups must be set up and tested.** A backup is only useful if it can be restored. Use the database provider's backup feature or a scheduled secure backup, and test restoring a copy into a separate test database.
5. **Database changes need a repeatable process.** The project does not currently show a migration tool. Before changing live tables, set up and test a documented way to apply and track database changes.

## Safe backup plan

1. Open the database provider's dashboard and check whether automatic backups are enabled.
2. Confirm how often backups are made and how long they are kept.
3. Make sure backup access is limited to trusted administrators.
4. Keep a separate encrypted copy if the clinic's policy requires one. Do not put database backups, passwords, or patient information in GitHub.
5. Arrange a restore test in a separate test database. Never test by overwriting the live clinic database.
6. Record the date, person responsible, and result of each restore test.

If a command-line backup is needed, a database administrator should create it using the provider's required secure connection settings and a protected credentials file. Do not paste database passwords into commands, chat, source code, or GitHub.

## Before changing the live database

- Make a fresh backup and confirm it completed.
- Test that backup by restoring it to a separate test database.
- Review the affected records with the clinic.
- Agree on a maintenance time.
- Prepare a rollback plan.
- Apply the change to a test copy first.
- Check appointments, patients, payments, balances, signatures, and reports after the change.

## Suggested order

1. Confirm automatic backups and complete a restore test.
2. Check for duplicate appointment times and ask the clinic how conflicts should be handled.
3. Review money fields and plan any change to exact money storage.
4. Agree on patient-record retention and deletion rules.
5. Add a tracked database-change process.
6. Add database indexes only after checking real queries and existing data.

## Review checklist

- [ ] Automatic database backups are enabled.
- [ ] Backup schedule and retention period are documented.
- [ ] A restore test succeeded in a separate test database.
- [ ] Duplicate appointment times have been checked.
- [ ] Money fields have been reviewed.
- [ ] Patient-record retention rules are approved by the clinic.
- [ ] A safe process for future database changes is documented.

**Status:** This is a review guide only. It does not prove that backups are enabled or that a restore works. The clinic or database administrator must complete and record those checks.
