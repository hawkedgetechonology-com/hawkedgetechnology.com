const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { neon } = require('@neondatabase/serverless');

// Load environment variables from .env.local
function loadEnv() {
  if (process.env.DATABASE_URL) return;
  
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const parts = trimmed.split('=');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            let value = parts.slice(1).join('=').trim();
            // Remove surrounding quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            process.env[key] = value;
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to parse .env.local:', err.message);
  }
}

loadEnv();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('Error: DATABASE_URL is not defined in process.env or .env.local');
  process.exit(1);
}

console.log('Connecting to Neon Database...');
const sql = neon(dbUrl);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function runSetup() {
  try {
    console.log('Creating "consultation_bookings" table...');
    await sql`
      CREATE TABLE IF NOT EXISTS consultation_bookings (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        company VARCHAR(100),
        preferred_date VARCHAR(50) NOT NULL,
        preferred_time VARCHAR(50) NOT NULL,
        purpose VARCHAR(500) NOT NULL,
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✓ "consultation_bookings" table created or already exists.');

    console.log('Creating "project_inquiries" table...');
    await sql`
      CREATE TABLE IF NOT EXISTS project_inquiries (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        company VARCHAR(100),
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(30),
        country VARCHAR(100),
        linkedin VARCHAR(200),
        website VARCHAR(200),
        services TEXT[] NOT NULL,
        project_title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        business_goal TEXT NOT NULL,
        target_audience VARCHAR(500) NOT NULL,
        expected_features TEXT NOT NULL,
        technologies VARCHAR(500),
        existing_website VARCHAR(200),
        budget VARCHAR(100) NOT NULL,
        timeline VARCHAR(100) NOT NULL,
        deadline VARCHAR(100),
        file_url VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✓ "project_inquiries" table created or already exists.');

    console.log('Creating "users" table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✓ "users" table created or already exists.');

    console.log('Checking for default admin account...');
    const existingUsers = await sql`
      SELECT id FROM users WHERE username = 'admin' LIMIT 1;
    `;

    if (existingUsers.length === 0) {
      console.log('Seeding default admin account (username: admin, password: adminpassword)...');
      const defaultPassword = 'adminpassword';
      const passwordHash = hashPassword(defaultPassword);

      await sql`
        INSERT INTO users (username, password_hash, role)
        VALUES ('admin', ${passwordHash}, 'admin');
      `;
      console.log('✓ Default admin account created successfully!');
    } else {
      console.log('✓ Admin account "admin" already exists.');
    }

    console.log('\nDatabase setup completed successfully! 🎉');
  } catch (error) {
    console.error('Setup failed with error:', error);
    process.exit(1);
  }
}

runSetup();
