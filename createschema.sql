CREATE DATABASE IF NOT EXISTS manage_thesis;
USE manage_thesis;

CREATE TABLE `user` (
	`id` INT AUTO_INCREMENT NOT NULL,
    `firstname` VARCHAR(64) NOT NULL,
    `lastname` VARCHAR(64) NOT NULL,
    `type` TINYINT NOT NULL,
    `email` VARCHAR(64) UNIQUE NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `registration_year` int,
    `is_deleted` TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_user__type` (`type`),
    KEY `idx_user__email` (`email`)
    
);

CREATE TABLE `thesis` (
	`id` INT AUTO_INCREMENT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(64) NULL,
    `filepath` VARCHAR(500) NULL,
    `is_deleted` TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_thesis__category` (`category`)
);

CREATE TABLE `thesis_to_user` (
	`professor_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `thesis_id` INT NOT NULL,
    `created_date` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `published_date`TIMESTAMP(6) NULL,
    PRIMARY KEY(`student_id`, `thesis_id`),
    KEY `idx_ThesisToUser__professor_id` (`professor_id`),
    KEY `idx_ThesisToUser__student_id` (`student_id`),
    KEY `idx_ThesisToUser__thesis_id` (`thesis_id`),
    CONSTRAINT `fk_ThesisToUser__professor_id` FOREIGN KEY (`professor_id`) REFERENCES `USER` (`id`),
    CONSTRAINT `fk_ThesisToUser__student_id` FOREIGN KEY (`student_id`) REFERENCES `USER` (`id`),
    CONSTRAINT `fk_ThesisToUser__thesis_id` FOREIGN KEY (`thesis_id`) REFERENCES `thesis`(`id`)
);


