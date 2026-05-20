import { exec } from 'child_process';
import { existsSync } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);
let isInitialized = false;
let initPromise: Promise<void> | null = null;

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
      await execAsync('npx prisma db push --accept-data-loss --skip-generate', {
        env: { ...process.env, DATABASE_URL: `file:${dbPath}` },
      });
    }

    isInitialized = true;
  })();

  return initPromise;
}
