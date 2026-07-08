CREATE DATABASE IF NOT EXISTS nayo_jobs;
USE nayo_jobs;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    location VARCHAR(255) NULL,
    bio TEXT NULL,
    skills TEXT NULL,
    role ENUM('job_seeker', 'employer', 'admin') DEFAULT 'job_seeker',
    resume_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_owner (owner_id)
);

CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    salary VARCHAR(255) NULL,
    job_type ENUM('full-time', 'part-time', 'contract', 'internship', 'remote') NOT NULL,
    deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_company (company_id),
    INDEX idx_deadline (deadline),
    INDEX idx_job_type (job_type)
);

CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
    file_path VARCHAR(255) NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, user_id),
    INDEX idx_job (job_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status)
);

CREATE OR REPLACE VIEW v_job_details AS
SELECT 
    j.*,
    c.company_name,
    c.location AS company_location,
    c.website AS company_website
FROM jobs j
LEFT JOIN companies c ON j.company_id = c.id;

CREATE OR REPLACE VIEW v_application_details AS
SELECT 
    a.id AS application_id,
    a.status,
    a.applied_at,
    a.file_path,
    u.id AS user_id,
    u.name AS applicant_name,
    u.email AS applicant_email,
    u.phone AS applicant_phone,
    u.location AS applicant_location,
    j.id AS job_id,
    j.title AS job_title,
    j.location AS job_location,
    c.id AS company_id,
    c.company_name
FROM applications a
JOIN users u ON a.user_id = u.id
JOIN jobs j ON a.job_id = j.id
JOIN companies c ON j.company_id = c.id;

DELIMITER //
CREATE PROCEDURE sp_get_employer_applications(
    IN employer_id INT
)
BEGIN
    SELECT 
        a.*,
        u.name AS applicant_name,
        u.email AS applicant_email,
        j.title AS job_title
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN companies c ON j.company_id = c.id
    JOIN users u ON a.user_id = u.id
    WHERE c.owner_id = employer_id
    ORDER BY a.applied_at DESC;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_jobs_with_application_count()
BEGIN
    SELECT 
        j.*,
        c.company_name,
        COUNT(a.id) AS application_count
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    LEFT JOIN applications a ON j.id = a.job_id
    WHERE j.deadline >= CURDATE()
    GROUP BY j.id
    ORDER BY j.created_at DESC;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_check_company_owner
BEFORE INSERT ON companies
FOR EACH ROW
BEGIN
    DECLARE existing_count INT;
    SELECT COUNT(*) INTO existing_count 
    FROM companies 
    WHERE owner_id = NEW.owner_id;
    
    IF existing_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This user already owns a company';
    END IF;
END //
DELIMITER ;

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_jobs_deadline ON jobs(deadline);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);

SHOW TABLES;

DESCRIBE users;
DESCRIBE companies;
DESCRIBE jobs;
DESCRIBE applications;