import { Pool } from 'pg';

async function testConnection() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:e%25UKa%3FY%402MdT7DH@db.yckdwoihjqjfijqagayk.supabase.co:5432/postgres',
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 10000,
    query_timeout: 10000,
  });

  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', result.rows[0]);
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testConnection();