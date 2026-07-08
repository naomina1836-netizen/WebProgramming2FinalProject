CREATE DATABASE IF NOT EXISTS nayo_jobs;
USE nayo_jobs;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS saved_jobs;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS company_profiles;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('job_seeker', 'employer', 'admin') DEFAULT 'job_seeker',
    phone VARCHAR(20),
    location VARCHAR(255),
    bio TEXT,
    skills TEXT,
    resume_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

CREATE TABLE IF NOT EXISTS profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    headline VARCHAR(255),
    bio TEXT,
    skills TEXT,
    experience TEXT,
    education TEXT,
    portfolio_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    phone VARCHAR(20),
    location VARCHAR(255),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
);

CREATE TABLE IF NOT EXISTS company_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_description TEXT,
    company_website VARCHAR(500),
    company_logo VARCHAR(500),
    company_size ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'),
    industry VARCHAR(100),
    founded_year YEAR,
    headquarters VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_company_name (company_name)
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    company VARCHAR(255),
    location VARCHAR(255),
    salary VARCHAR(100),
    job_type ENUM('full-time', 'part-time', 'contract', 'internship', 'remote') DEFAULT 'full-time',
    category VARCHAR(100),
    experience_level VARCHAR(50),
    requirements TEXT,
    responsibilities TEXT,
    status ENUM('active', 'closed', 'draft') DEFAULT 'active',
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_employer (employer_id),
    INDEX idx_status (status),
    INDEX idx_job_type (job_type),
    INDEX idx_category (category),
    INDEX idx_deadline (deadline),
    FULLTEXT INDEX ft_title_description (title, description)
);

CREATE TABLE IF NOT EXISTS applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    applicant_id INT NOT NULL,
    cover_letter TEXT,
    resume_url VARCHAR(500),
    status ENUM('pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'rejected', 'withdrawn') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, applicant_id),
    INDEX idx_job (job_id),
    INDEX idx_applicant (applicant_id),
    INDEX idx_status (status),
    INDEX idx_applied_at (applied_at)
);

CREATE TABLE IF NOT EXISTS saved_jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_saved (user_id, job_id),
    INDEX idx_user (user_id),
    INDEX idx_job (job_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    job_id INT,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
    INDEX idx_sender (sender_id),
    INDEX idx_receiver (receiver_id),
    INDEX idx_job (job_id),
    INDEX idx_created (created_at),
    INDEX idx_read (is_read)
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('application', 'interview', 'offer', 'message', 'system') DEFAULT 'system',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at),
    INDEX idx_type (type)
);

CREATE OR REPLACE VIEW v_job_details AS
SELECT 
    j.*,
    u.name AS employer_name,
    u.email AS employer_email,
    u.phone AS employer_phone,
    cp.company_name,
    cp.company_description,
    cp.company_website,
    cp.company_logo,
    cp.company_size,
    cp.industry,
    (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS total_applications,
    (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id AND a.status = 'pending') AS pending_applications,
    (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id AND a.status IN ('reviewed', 'shortlisted', 'interviewed')) AS active_applications,
    (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id AND a.status = 'rejected') AS rejected_applications
FROM jobs j
JOIN users u ON j.employer_id = u.id
LEFT JOIN company_profiles cp ON cp.user_id = u.id;

CREATE OR REPLACE VIEW v_application_details AS
SELECT 
    a.id AS application_id,
    a.status,
    a.cover_letter,
    a.resume_url,
    a.applied_at,
    a.updated_at,
    a.notes,
    u.id AS applicant_id,
    u.name AS applicant_name,
    u.email AS applicant_email,
    u.phone AS applicant_phone,
    u.location AS applicant_location,
    p.headline,
    p.skills,
    p.experience,
    p.education,
    p.portfolio_url,
    p.linkedin_url,
    p.github_url,
    j.id AS job_id,
    j.title AS job_title,
    j.description AS job_description,
    j.location AS job_location,
    j.salary AS job_salary,
    j.job_type AS job_type,
    j.company AS company_name,
    j.employer_id,
    u2.name AS employer_name,
    u2.email AS employer_email,
    cp.company_name AS employer_company_name,
    cp.company_website AS employer_company_website
FROM applications a
JOIN users u ON a.applicant_id = u.id
JOIN jobs j ON a.job_id = j.id
JOIN users u2 ON j.employer_id = u2.id
LEFT JOIN profiles p ON p.user_id = u.id
LEFT JOIN company_profiles cp ON cp.user_id = u2.id;

CREATE OR REPLACE VIEW v_employer_dashboard AS
SELECT 
    u.id AS employer_id,
    u.name AS employer_name,
    u.email AS employer_email,
    cp.company_name,
    cp.company_logo,
    cp.industry,
    COUNT(DISTINCT j.id) AS total_jobs,
    COUNT(DISTINCT CASE WHEN j.status = 'active' THEN j.id END) AS active_jobs,
    COUNT(DISTINCT CASE WHEN j.status = 'closed' THEN j.id END) AS closed_jobs,
    COUNT(DISTINCT CASE WHEN j.status = 'draft' THEN j.id END) AS draft_jobs,
    COUNT(DISTINCT a.id) AS total_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'pending' THEN a.id END) AS pending_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'reviewed' THEN a.id END) AS reviewed_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'shortlisted' THEN a.id END) AS shortlisted_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'interviewed' THEN a.id END) AS interviewed_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'offered' THEN a.id END) AS offered_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'rejected' THEN a.id END) AS rejected_applications
FROM users u
LEFT JOIN company_profiles cp ON cp.user_id = u.id
LEFT JOIN jobs j ON j.employer_id = u.id
LEFT JOIN applications a ON a.job_id = j.id
WHERE u.role = 'employer'
GROUP BY u.id;

DELIMITER //
CREATE PROCEDURE sp_get_employer_jobs(
    IN p_employer_id INT
)
BEGIN
    SELECT 
        j.*,
        cp.company_name,
        COUNT(DISTINCT a.id) AS total_applications,
        SUM(CASE WHEN a.status = 'pending' THEN 1 ELSE 0 END) AS pending_applications,
        SUM(CASE WHEN a.status = 'reviewed' THEN 1 ELSE 0 END) AS reviewed_applications,
        SUM(CASE WHEN a.status = 'shortlisted' THEN 1 ELSE 0 END) AS shortlisted_applications,
        SUM(CASE WHEN a.status = 'interviewed' THEN 1 ELSE 0 END) AS interviewed_applications,
        SUM(CASE WHEN a.status = 'offered' THEN 1 ELSE 0 END) AS offered_applications,
        SUM(CASE WHEN a.status = 'rejected' THEN 1 ELSE 0 END) AS rejected_applications
    FROM jobs j
    LEFT JOIN company_profiles cp ON cp.user_id = j.employer_id
    LEFT JOIN applications a ON a.job_id = j.id
    WHERE j.employer_id = p_employer_id
    GROUP BY j.id
    ORDER BY j.created_at DESC;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_job_applications(
    IN p_job_id INT
)
BEGIN
    SELECT 
        a.*,
        u.name AS applicant_name,
        u.email AS applicant_email,
        u.phone AS applicant_phone,
        u.location AS applicant_location,
        p.headline,
        p.skills,
        p.experience,
        p.education,
        p.portfolio_url,
        p.linkedin_url,
        p.github_url
    FROM applications a
    JOIN users u ON a.applicant_id = u.id
    LEFT JOIN profiles p ON p.user_id = u.id
    WHERE a.job_id = p_job_id
    ORDER BY a.applied_at DESC;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_employer_stats(
    IN p_employer_id INT
)
BEGIN
    SELECT 
        COUNT(DISTINCT j.id) AS total_jobs,
        SUM(CASE WHEN j.status = 'active' THEN 1 ELSE 0 END) AS active_jobs,
        SUM(CASE WHEN j.status = 'closed' THEN 1 ELSE 0 END) AS closed_jobs,
        SUM(CASE WHEN j.status = 'draft' THEN 1 ELSE 0 END) AS draft_jobs,
        COUNT(DISTINCT a.id) AS total_applications,
        SUM(CASE WHEN a.status = 'pending' THEN 1 ELSE 0 END) AS pending_applications,
        SUM(CASE WHEN a.status = 'reviewed' THEN 1 ELSE 0 END) AS reviewed_applications,
        SUM(CASE WHEN a.status = 'shortlisted' THEN 1 ELSE 0 END) AS shortlisted_applications,
        SUM(CASE WHEN a.status = 'interviewed' THEN 1 ELSE 0 END) AS interviewed_applications,
        SUM(CASE WHEN a.status = 'offered' THEN 1 ELSE 0 END) AS offered_applications,
        SUM(CASE WHEN a.status = 'rejected' THEN 1 ELSE 0 END) AS rejected_applications
    FROM jobs j
    LEFT JOIN applications a ON a.job_id = j.id
    WHERE j.employer_id = p_employer_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_applicant_applications(
    IN p_applicant_id INT
)
BEGIN
    SELECT 
        a.*,
        j.title AS job_title,
        j.location AS job_location,
        j.salary AS job_salary,
        j.job_type,
        j.company,
        u.name AS employer_name,
        cp.company_name AS company_name
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON j.employer_id = u.id
    LEFT JOIN company_profiles cp ON cp.user_id = u.id
    WHERE a.applicant_id = p_applicant_id
    ORDER BY a.applied_at DESC;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_create_profile_on_signup
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.role = 'job_seeker' THEN
        INSERT INTO profiles (user_id) VALUES (NEW.id);
    ELSEIF NEW.role = 'employer' THEN
        INSERT INTO company_profiles (user_id, company_name) 
        VALUES (NEW.id, CONCAT(NEW.name, "'s Company"));
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_check_company_profile
BEFORE INSERT ON company_profiles
FOR EACH ROW
BEGIN
    DECLARE existing_count INT;
    SELECT COUNT(*) INTO existing_count 
    FROM company_profiles 
    WHERE user_id = NEW.user_id;
    
    IF existing_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This user already has a company profile';
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_check_duplicate_application
BEFORE INSERT ON applications
FOR EACH ROW
BEGIN
    DECLARE existing_count INT;
    SELECT COUNT(*) INTO existing_count 
    FROM applications 
    WHERE job_id = NEW.job_id AND applicant_id = NEW.applicant_id;
    
    IF existing_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You have already applied for this job';
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_application_notification
AFTER INSERT ON applications
FOR EACH ROW
BEGIN
    DECLARE employer_id INT;
    
    SELECT employer_id INTO employer_id 
    FROM jobs 
    WHERE id = NEW.job_id;
    
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
        employer_id,
        'application',
        'New Application Received',
        'A new application has been submitted for your job posting.',
        CONCAT('/employer/applications.php?job_id=', NEW.job_id)
    );
END //
DELIMITER ;

CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_employer_status ON jobs(employer_id, status);
CREATE INDEX idx_jobs_type_status ON jobs(job_type, status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);
CREATE INDEX idx_applications_job_status ON applications(job_id, status);
CREATE INDEX idx_applications_applicant_status ON applications(applicant_id, status);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);ble_type = 'VIEW';
SHOW PROCEDURE STATUS WHERE Db = 'nayo_jobs';
SHOW TRIGGERS LIKE 'users';
