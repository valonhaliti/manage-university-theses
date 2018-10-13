CREATE DATABASE IF NOT EXISTS manage_thesis;
USE manage_thesis;

CREATE TABLE IF NOT EXISTS `user` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `firstname` VARCHAR(64) NOT NULL,
    `lastname` VARCHAR(64) NOT NULL,
    `type` TINYINT NOT NULL,
    `email` VARCHAR(64) UNIQUE NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `registration_year` INT NULL,
    `is_deleted` TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_user__type` (`type`),
    KEY `idx_user__email` (`email`)
);

CREATE TABLE IF NOT EXISTS `thesis` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(64) NULL,
    `filepath` VARCHAR(500) NULL,
    `created_date` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `published_date`TIMESTAMP(6) NULL,
    `is_deleted` TINYINT NOT NULL DEFAULT 0,
    `added_by` INT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_thesis__category` (`category`),
    CONSTRAINT `fk_Thesis__added_by` FOREIGN KEY (`added_by`) REFERENCES `USER` (`id`)
);

CREATE TABLE IF NOT EXISTS `keyword` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS  `thesis_to_user` (
    `professor_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `thesis_id` INT NOT NULL,
    PRIMARY KEY(`student_id`, `thesis_id`),
    KEY `idx_ThesisToUser__professor_id` (`professor_id`),
    KEY `idx_ThesisToUser__student_id` (`student_id`),
    KEY `idx_ThesisToUser__thesis_id` (`thesis_id`),
    CONSTRAINT `fk_ThesisToUser__professor_id` FOREIGN KEY (`professor_id`) REFERENCES `USER` (`id`),
    CONSTRAINT `fk_ThesisToUser__student_id` FOREIGN KEY (`student_id`) REFERENCES `USER` (`id`),
    CONSTRAINT `fk_ThesisToUser__thesis_id` FOREIGN KEY (`thesis_id`) REFERENCES `thesis`(`id`)
);

CREATE TABLE IF NOT EXISTS `thesis_to_keyword` (
	`thesis_id` INT NOT NULL,
    `keyword_id` INT NOT NULL,
    CONSTRAINT `fk_ThesisToKeyword__thesis_id` FOREIGN KEY (`thesis_id`) REFERENCES `thesis` (`id`),
    CONSTRAINT `fk_ThesisToKeyword__keyword_id` FOREIGN KEY (`keyword_id`) REFERENCES `keyword` (`id`),
    CONSTRAINT `fk_ThesisToKeyword__thesis_id__keyword_id` UNIQUE (`thesis_id`, `keyword_id`)
);


