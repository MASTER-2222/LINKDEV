import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:e%25UKa%3FY%402MdT7DH@db.yckdwoihjqjfijqagayk.supabase.co:5432/postgres';

console.log('DATABASE_URL:', DATABASE_URL ? 'loaded' : 'not loaded');

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Create tables if they don't exist
    await createTables(client);
    
    client.release();
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

const createTables = async (client: any) => {
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        headline TEXT,
        about TEXT,
        profile_picture TEXT,
        cover_photo TEXT,
        location VARCHAR(255),
        industry VARCHAR(255),
        website VARCHAR(255),
        resume TEXT,
        role VARCHAR(20) DEFAULT 'job_seeker' CHECK (role IN ('job_seeker', 'recruiter', 'admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Jobs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        salary VARCHAR(255),
        job_type VARCHAR(20) NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'contract', 'internship')),
        work_mode VARCHAR(20) NOT NULL CHECK (work_mode IN ('remote', 'on_site', 'hybrid')),
        experience_level VARCHAR(20) NOT NULL CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
        recruiter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Job applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interview', 'accepted', 'rejected')),
        cover_letter TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(job_id, applicant_id)
      )
    `);

    // Posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        image_url TEXT,
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Post likes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS post_likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(post_id, user_id)
      )
    `);

    // Comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Connections table
    await client.query(`
      CREATE TABLE IF NOT EXISTS connections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(sender_id, receiver_id),
        CHECK (sender_id != receiver_id)
      )
    `);

    // Create indexes for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_jobs_recruiter_id ON jobs(recruiter_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON job_applications(applicant_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_connections_sender_id ON connections(sender_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_connections_receiver_id ON connections(receiver_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status)');

    // Create updated_at trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Add triggers for updated_at
    const tables = ['users', 'jobs', 'job_applications', 'posts', 'comments', 'connections'];
    for (const table of tables) {
      await client.query(`
        DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
        CREATE TRIGGER update_${table}_updated_at 
        BEFORE UPDATE ON ${table} 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};