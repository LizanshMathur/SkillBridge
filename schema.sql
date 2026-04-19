CREATE DATABASE IF NOT EXISTS skillbridge;
USE skillbridge;
 
-- Users table (FIXED)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
 
  role VARCHAR(100) DEFAULT 'user',
 
  industry VARCHAR(100),
  experience VARCHAR(50)
);
 
-- Skills table
DROP TABLE IF EXISTS skills;
CREATE TABLE skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level ENUM('beginner','intermediate','advanced') NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- Career Goals table
DROP TABLE IF EXISTS career_goals;
CREATE TABLE career_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  target_role VARCHAR(100) NOT NULL,
  desired_skills TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- Learning Paths table
DROP TABLE IF EXISTS learning_paths;
CREATE TABLE learning_paths (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  roadmap_json JSON,
  roadmap_text TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);