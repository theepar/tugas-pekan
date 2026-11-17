CREATE TABLE IF NOT EXISTS students (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nim VARCHAR(12) NOT NULL UNIQUE CHECK (nim ~ '^[0-9]{12}$'),
    name VARCHAR(120) NOT NULL CHECK (length(trim(name)) >= 2),
    email VARCHAR(150) NOT NULL UNIQUE,
    study_program VARCHAR(100) NOT NULL CHECK (length(trim(study_program)) >= 2),
    cohort SMALLINT NOT NULL CHECK (cohort BETWEEN 2000 AND 2100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO students (nim, name, email, study_program, cohort) VALUES
('103022400016', 'I Putu Gede Deva Gundhala', '103022400016@example.com', 'Rekayasa Perangkat Lunak', 2024),
('103022400017', 'Mahasiswa Contoh A', '103022400017@example.com', 'Rekayasa Perangkat Lunak', 2024),
('103022400018', 'Mahasiswa Contoh B', '103022400018@example.com', 'Informatika', 2024)
ON CONFLICT DO NOTHING;
