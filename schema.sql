CREATE DATABASE skillbridge;
USE skillbridge;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- hashed
  role ENUM('user','admin') DEFAULT 'user',
  industry VARCHAR(100),          -- added for profile setup
  experience VARCHAR(50)          -- added for profile setup
);

-- Skills table
CREATE TABLE skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level ENUM('beginner','intermediate','advanced') NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Career Goals table
CREATE TABLE career_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  target_role VARCHAR(100) NOT NULL,
  desired_skills TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Learning Paths table
CREATE TABLE learning_paths (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  roadmap_json JSON,   -- structured roadmap
  roadmap_text TEXT,   -- plain text roadmap
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
