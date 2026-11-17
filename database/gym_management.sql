CREATE DATABASE IF NOT EXISTS gym_management;
USE gym_management;

CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  membership_type ENUM('Monthly', 'Quarterly', 'Yearly') NOT NULL,
  join_date DATE NOT NULL,
  status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional sample records for testing:
INSERT IGNORE INTO members (name, email, phone, membership_type, join_date, status) VALUES
('Rahim Ahmed', 'rahim@example.com', '01710000001', 'Monthly', '2026-11-01', 'Active'),
('Nusrat Jahan', 'nusrat@example.com', '01810000002', 'Yearly', '2026-10-15', 'Active'),
('Sakib Hasan', 'sakib@example.com', '01910000003', 'Quarterly', '2026-09-20', 'Inactive');
