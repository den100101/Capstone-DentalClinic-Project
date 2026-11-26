# MySQL Performance Optimization

## Purpose

This change improves common Swiss Dental Clinic queries while keeping Aiven MySQL as the permanent database. Redis or another caching service is not required.

## Changes in the application

### Connection pooling

The Flask SQLAlchemy engine is configured with connection health checks, connection recycling, a small pool, a limited overflow, and a connection timeout. This helps reuse database connections and discard stale connections instead of opening a new connection for every request.

### Database indexes

The SQLAlchemy models define indexes for:
- Appointment date, status, and time lookups.
- Appointment lists filtered by status and patient.
- Patient creation timestamps used by daily reports.
- Payment date filtering for daily revenue reports.

These model declarations apply automatically to newly created tables. They do not automatically add indexes to existing Aiven tables.

### Fewer repeated relationship queries

Appointment endpoints that serialize appointment and patient details now eager-load the patient relationship. The daily report also eager-loads each payment's patient relationship. This reduces repeated SELECT queries when many appointments or payments are returned.

## Applying indexes to the existing Aiven database

1. Make a verified database backup first.
2. Open the Aiven MySQL query tool or connect with a MySQL client.
3. Select the Swiss database.
4. Run the index-inspection query at the top of `backend/sql/mysql_performance_indexes.sql`.
5. Check whether each proposed index already exists. Do not create a duplicate index.
6. Run only the missing CREATE INDEX statements.
7. Run the verification query at the end.
8. Test appointment booking, appointment history, patient records, notifications, and daily reports.

The SQL file is intentionally separate from application startup. Deploying the backend does not automatically alter the production database.

## Important notes

- The SQL file assumes the existing Payment model's default table name is `payment`. Confirm the actual table name in Aiven before running the statements.
- Indexes consume storage and add some work to INSERT, UPDATE, and DELETE operations. Keep only indexes that support real queries.
- The patient search uses a contains-style pattern (`%text%`). A normal B-tree index generally cannot speed up a leading-wildcard search. This PR does not add an index that would give a misleading performance promise for that query.
- The existing list endpoints still return all matching records. Frontend pagination does not reduce database work unless the backend also uses limit/offset pagination. That change is intentionally not included because it would require coordinated API and frontend behavior changes.
- Do not add a unique appointment-slot index as part of this performance change. Existing data may contain duplicate slots, and the clinic's booking rules should be reviewed separately before adding a constraint.
- Connection pool limits apply per application worker/process. If Render runs multiple workers, total possible MySQL connections are the per-worker pool plus overflow multiplied by the worker count. Keep the pool small and compare it with the Aiven plan's connection limit.

## Validation checklist

- [ ] Confirm the Aiven table names and existing indexes.
- [ ] Back up the database before applying index changes.
- [ ] Run the SQL index inspection and verification queries.
- [ ] Run the backend tests or at minimum exercise all changed endpoints.
- [ ] Build and test the frontend against the deployed backend.
- [ ] Compare query time and Aiven connection usage before and after deployment.
