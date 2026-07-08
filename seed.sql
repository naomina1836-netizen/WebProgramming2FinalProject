INSERT INTO users(full_name,email,password,role)
VALUES

(
'System Admin',
'admin@nayo.com',
'password',
'admin'
),

(
'John Employer',
'employer@nayo.com',
'password',
'employer'
),

(
'Sarah Job Seeker',
'job@nayo.com',
'password',
'job_seeker'
);

INSERT INTO companies
(owner_id,company_name,description,location,website)

VALUES

(
2,
'Nayo Technologies',
'Software Development Company',
'Addis Ababa',
'https://nayojobs.com'
);

INSERT INTO jobs
(
company_id,
title,
description,
location,
salary,
job_type,
deadline
)

VALUES

(
1,
'Frontend Developer',
'React Developer with JavaScript experience.',
'Addis Ababa',
'30,000 ETB',
'Full Time',
'2026-12-31'
),

(
1,
'Backend Developer',
'Node.js Developer',
'Remote',
'35,000 ETB',
'Full Time',
'2026-12-31'
);