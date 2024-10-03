DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'boilerplate') THEN
        CREATE DATABASE boilerplate;
    END IF;
END
$$;