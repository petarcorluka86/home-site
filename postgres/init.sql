-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Insert sample data (idempotent)
DO $$
BEGIN
    -- Only insert if no tasks exist
    IF NOT EXISTS (SELECT 1 FROM tasks LIMIT 1) THEN
        -- Insert sample tasks
        INSERT INTO tasks (title, description, status, priority, due_date) VALUES 
            ('Buy server on Hetzner', 'Purchase and configure a new server on Hetzner cloud platform', 'completed', 'high', '2024-01-15'),
            ('Setup domain (Namecheap)', 'Register and configure domain name through Namecheap', 'completed', 'high', '2024-01-16'),
            ('Setup SSL', 'Configure SSL certificates for secure connections', 'completed', 'high', '2024-01-17'),
            ('Setup Next.js app with Docker', 'Containerize the Next.js application using Docker', 'completed', 'medium', '2024-01-18'),
            ('Setup nginx reverse proxy', 'Configure nginx as reverse proxy for the application', 'completed', 'medium', '2024-01-19'),
            ('Setup auto deploy with GitHub actions', 'Implement CI/CD pipeline using GitHub Actions', 'completed', 'medium', '2024-01-20'),
            ('Setup Node.js (express) with Docker', 'Containerize the Express.js API server', 'in_progress', 'high', '2024-01-25'),
            ('Setup Postgres with Docker', 'Set up PostgreSQL database in Docker container', 'pending', 'high', '2024-01-26'),
            ('Use Docker Compose to run all services', 'Create docker-compose.yml to orchestrate all services', 'pending', 'medium', '2024-01-27'),
            ('Cancel ongoing same task if another task of same type should start', 'Implement task cancellation logic for duplicate task types', 'pending', 'low', '2024-01-28');
        
        RAISE NOTICE 'Sample data inserted successfully';
    ELSE
        RAISE NOTICE 'Sample data already exists, skipping...';
    END IF;
END $$;
