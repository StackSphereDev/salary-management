import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

function loadNames(filename: string): string[] {
  const filePath = path.join(__dirname, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  return content
    .split('\n')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
  'Product',
  'Customer Support',
  'Legal',
  'IT',
];

const JOB_TITLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Engineer',
  'Engineering Manager',
  'Sales Representative',
  'Sales Manager',
  'Account Executive',
  'Marketing Specialist',
  'Marketing Manager',
  'HR Specialist',
  'HR Manager',
  'Recruiter',
  'Financial Analyst',
  'Accountant',
  'Finance Manager',
  'Operations Manager',
  'Operations Coordinator',
  'Product Manager',
  'Product Designer',
  'Support Specialist',
  'Support Manager',
  'Legal Counsel',
  'IT Specialist',
  'System Administrator',
  'Data Analyst',
];

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'India',
  'Australia',
  'Singapore',
  'Japan',
  'Brazil',
];

const CURRENCIES = ['USD', 'CAD', 'GBP', 'EUR', 'INR', 'AUD', 'SGD', 'JPY', 'BRL'];

const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'];

interface EmployeeData {
  fullName: string;
  email: string;
  department: string;
  jobTitle: string;
  country: string;
  salary: number;
  currency: string;
  joiningDate: Date;
  employmentType: string;
  status: string;
}

export function generateEmployees(seed: number = 42): EmployeeData[] {
  const rng = new SeededRandom(seed);
  const firstNames = loadNames('first_names.txt');
  const lastNames = loadNames('last_names.txt');

  const employees: EmployeeData[] = [];
  const usedEmails = new Set<string>();

  const totalEmployees = 10000;
  const now = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(now.getFullYear() - 5);

  for (let i = 0; i < totalEmployees; i++) {
    const firstName = rng.choice(firstNames);
    const lastName = rng.choice(lastNames);
    const fullName = `${firstName} ${lastName}`;

    let email: string;
    let emailCounter = 0;
    do {
      const emailPrefix =
        emailCounter === 0
          ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}`
          : `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emailCounter}`;
      email = `${emailPrefix}@company.com`;
      emailCounter++;
    } while (usedEmails.has(email));

    usedEmails.add(email);

    const department = rng.choice(DEPARTMENTS);
    const jobTitle = rng.choice(JOB_TITLES);
    const country = rng.choice(COUNTRIES);
    const salary = rng.nextInt(30000, 250000);
    const currency = rng.choice(CURRENCIES);

    const joiningDateTimestamp = rng.nextInt(fiveYearsAgo.getTime(), now.getTime());
    const joiningDate = new Date(joiningDateTimestamp);

    const employmentType = rng.choice(EMPLOYMENT_TYPES);

    const statusRoll = rng.next();
    let status: string;
    if (statusRoll < 0.8) {
      status = 'ACTIVE';
    } else if (statusRoll < 0.95) {
      status = 'INACTIVE';
    } else {
      status = 'ON_LEAVE';
    }

    employees.push({
      fullName,
      email,
      department,
      jobTitle,
      country,
      salary,
      currency,
      joiningDate,
      employmentType,
      status,
    });
  }

  return employees;
}

async function seed() {
  console.log('🌱 Starting database seeding...');

  console.log('🗑️  Clearing existing employees...');
  await prisma.employee.deleteMany({});

  console.log('👥 Generating 10,000 employees...');
  const startGeneration = Date.now();
  const employees = generateEmployees();
  const generationTime = Date.now() - startGeneration;
  console.log(`✅ Generated ${employees.length} employees in ${generationTime}ms`);

  const BATCH_SIZE = 1000;
  const totalBatches = Math.ceil(employees.length / BATCH_SIZE);

  console.log(`📦 Inserting employees in ${totalBatches} batches of ${BATCH_SIZE}...`);

  const startInsertion = Date.now();
  for (let i = 0; i < totalBatches; i++) {
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, employees.length);
    const batch = employees.slice(start, end);

    await prisma.employee.createMany({
      data: batch,
    });

    const progress = (((i + 1) / totalBatches) * 100).toFixed(1);
    console.log(
      `   Batch ${i + 1}/${totalBatches} (${progress}%) - Inserted ${batch.length} employees`
    );
  }

  const insertionTime = Date.now() - startInsertion;
  console.log(`✅ Inserted all employees in ${insertionTime}ms`);

  const totalCount = await prisma.employee.count();
  console.log(`\n✨ Seeding completed! Total employees in database: ${totalCount}`);

  const totalTime = generationTime + insertionTime;
  console.log(`⏱️  Total time: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);
}

seed()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
