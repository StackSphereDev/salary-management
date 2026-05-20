import { existsSync } from 'fs';
import Database from 'better-sqlite3';

let isInitialized = false;
let initPromise: Promise<void> | null = null;

const SQL_SCHEMA = `
CREATE TABLE IF NOT EXISTS "employees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "salary" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "joiningDate" DATETIME NOT NULL,
    "employmentType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "employees_email_key" ON "employees"("email");
CREATE INDEX IF NOT EXISTS "employees_email_idx" ON "employees"("email");
CREATE INDEX IF NOT EXISTS "employees_department_idx" ON "employees"("department");
CREATE INDEX IF NOT EXISTS "employees_status_idx" ON "employees"("status");
CREATE INDEX IF NOT EXISTS "employees_department_status_idx" ON "employees"("department", "status");
CREATE INDEX IF NOT EXISTS "employees_joiningDate_idx" ON "employees"("joiningDate");
CREATE INDEX IF NOT EXISTS "employees_country_idx" ON "employees"("country");
`;

export async function ensureDatabaseInitialized(): Promise<void> {
  if (isInitialized) {
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const dbPath = '/tmp/dev.db';

    if (!existsSync(dbPath)) {
      const db = new Database(dbPath);
      db.exec(SQL_SCHEMA);
      db.close();
    }

    isInitialized = true;
  })();

  return initPromise;
}
