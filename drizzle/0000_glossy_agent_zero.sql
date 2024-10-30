CREATE TABLE `common_works` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(512) NOT NULL,
	`measure` varchar(128) NOT NULL,
	`norm_of_time` double(6,3) NOT NULL,
	`norm_of_time_name_short` varchar(32) NOT NULL,
	`norm_of_time_name_full` varchar(256) NOT NULL,
	`norm_of_time_document_name` varchar(256) NOT NULL,
	CONSTRAINT `common_works_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `credentials` (
	`id` int NOT NULL,
	`username` varchar(32) NOT NULL,
	`password` varchar(32) NOT NULL,
	CONSTRAINT `credentials_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `directions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`short_name` varchar(16) NOT NULL,
	CONSTRAINT `directions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `distances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_direction` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`short_name` varchar(16) NOT NULL,
	CONSTRAINT `distances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subdivisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_distance` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`short_name` varchar(16) NOT NULL,
	CONSTRAINT `subdivisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ppr_months_statuses` (
	`id_ppr` int NOT NULL,
	`jan` enum('none','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_aprove','in_process','fact_filling','fact_verification_engineer','fact_verification_time_norm','fact_on_agreement_sub_boss','done') NOT NULL DEFAULT 'none',
	`feb` enum('none','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_aprove','in_process','fact_filling','fact_verification_engineer','fact_verification_time_norm','fact_on_agreement_sub_boss','done') NOT NULL DEFAULT 'none',
	`mar` enum('none','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_aprove','in_process','fact_filling','fact_verification_engineer','fact_verification_time_norm','fact_on_agreement_sub_boss','done') NOT NULL DEFAULT 'none',
	`apr` enum('none','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_aprove','in_process','fact_filling','fact_verification_engineer','fact_verification_time_norm','fact_on_agreement_sub_boss','done') NOT NULL DEFAULT 'none',
	`may` enum('none','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_aprove','in_process','fact_filling','fact_verification_engineer','fact_verification_time_norm','fact_on_agreement_sub_boss','done') NOT NULL DEFAULT 'none',
	`june` enum('none','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_aprove','in_process','fact_filling','fact_verification_engineer','fact_verification_time_norm','fact_on_agreement_sub_boss','done') NOT NULL DEFAULT 'none',
	`july` enum('none','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_aprove','in_process','fact_filling','fact_verification_engineer','fact_verification_time_norm','fact_on_agreement_sub_boss','done') NOT NULL DEFAULT 'none',
	`aug` enum('none','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_aprove','in_process','fact_filling','fact_verification_engineer','fact_verification_time_norm','fact_on_agreement_sub_boss','done') NOT NULL DEFAULT 'none',
	`sept` enum('none','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_aprove','in_process','fact_filling','fact_verification_engineer','fact_verification_time_norm','fact_on_agreement_sub_boss','done') NOT NULL DEFAULT 'none',
	`oct` enum('none','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_aprove','in_process','fact_filling','fact_verification_engineer','fact_verification_time_norm','fact_on_agreement_sub_boss','done') NOT NULL DEFAULT 'none',
	`nov` enum('none','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_aprove','in_process','fact_filling','fact_verification_engineer','fact_verification_time_norm','fact_on_agreement_sub_boss','done') NOT NULL DEFAULT 'none',
	`dec` enum('none','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_aprove','in_process','fact_filling','fact_verification_engineer','fact_verification_time_norm','fact_on_agreement_sub_boss','done') NOT NULL DEFAULT 'none',
	CONSTRAINT `ppr_months_statuses_id_ppr_unique` UNIQUE(`id_ppr`)
);
--> statement-breakpoint
CREATE TABLE `ppr_working_mans` (
	`id_ppr` int NOT NULL,
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(128) NOT NULL DEFAULT '',
	`work_position` varchar(256) NOT NULL DEFAULT '',
	`participation` double(6,3) NOT NULL DEFAULT 1,
	`year_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`jan_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`feb_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`mar_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`apr_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`may_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`june_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`july_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`aug_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`sept_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`oct_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`nov_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`dec_plan_time` double(6,3) NOT NULL DEFAULT 0,
	`year_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`jan_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`feb_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`mar_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`apr_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`may_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`june_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`july_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`aug_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`sept_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`oct_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`nov_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`dec_plan_norm_time` double(6,3) NOT NULL DEFAULT 0,
	`year_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`jan_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`feb_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`mar_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`apr_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`may_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`june_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`july_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`aug_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`sept_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`oct_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`nov_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`dec_plan_tabel_time` double(6,3) NOT NULL DEFAULT 0,
	`year_fact_time` double(6,3) NOT NULL DEFAULT 0,
	`jan_fact_time` double(6,3) NOT NULL DEFAULT 0,
	`feb_fact_time` double(6,3) NOT NULL DEFAULT 0,
	`mar_fact_time` double(6,3) NOT NULL DEFAULT 0,
	`apr_fact_time` double(6,3) NOT NULL DEFAULT 0,
	`may_fact_time` double(6,3) NOT NULL DEFAULT 0,
	`june_fact_time` double(6,3) NOT NULL DEFAULT 0,
	`july_fact_time` double(6,3) NOT NULL DEFAULT 0,
	`aug_fact_time` double(6,3) NOT NULL DEFAULT 0,
	`sept_fact_time` double(6,3) NOT NULL DEFAULT 0,
	`oct_fact_time` double(6,3) NOT NULL DEFAULT 0,
	`nov_fact_time` double(6,3) NOT NULL DEFAULT 0,
	`dec_fact_time` double(6,3) NOT NULL DEFAULT 0,
	CONSTRAINT `ppr_working_mans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pprs_info` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`year` smallint NOT NULL,
	`status` enum('template','plan_creating','plan_on_agreement_engineer','plan_on_agreement_time_norm','plan_on_agreement_sub_boss','plan_on_aprove','in_process','done') NOT NULL,
	`created_at` date NOT NULL,
	`id_user_created_by` int NOT NULL,
	`id_direction` int,
	`id_distance` int,
	`id_subdivision` int,
	CONSTRAINT `pprs_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pprs_data` (
	`id_ppr` int NOT NULL,
	`order` smallint,
	`id` int AUTO_INCREMENT NOT NULL,
	`id_common_work` int,
	`is_work_aproved` boolean NOT NULL,
	`branch` enum('exploitation','additional','unforeseen') NOT NULL,
	`subbranch` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`location` varchar(128) NOT NULL,
	`line_class` tinyint NOT NULL,
	`measure` varchar(128) NOT NULL,
	`total_count` double(10,3) NOT NULL,
	`entry_year` smallint NOT NULL,
	`periodicity_normal` varchar(10) NOT NULL,
	`periodicity_fact` varchar(16) NOT NULL,
	`last_maintenance_year` smallint NOT NULL,
	`norm_of_time` double(6,3) NOT NULL,
	`norm_of_time_name_full` varchar(256) NOT NULL,
	`year_plan_work` json NOT NULL,
	`jan_plan_work` json NOT NULL,
	`feb_plan_work` json NOT NULL,
	`mar_plan_work` json NOT NULL,
	`apr_plan_work` json NOT NULL,
	`may_plan_work` json NOT NULL,
	`june_plan_work` json NOT NULL,
	`july_plan_work` json NOT NULL,
	`aug_plan_work` json NOT NULL,
	`sept_plan_work` json NOT NULL,
	`oct_plan_work` json NOT NULL,
	`nov_plan_work` json NOT NULL,
	`dec_plan_work` json NOT NULL,
	`year_plan_time` json NOT NULL,
	`jan_plan_time` json NOT NULL,
	`feb_plan_time` json NOT NULL,
	`mar_plan_time` json NOT NULL,
	`apr_plan_time` json NOT NULL,
	`may_plan_time` json NOT NULL,
	`june_plan_time` json NOT NULL,
	`july_plan_time` json NOT NULL,
	`aug_plan_time` json NOT NULL,
	`sept_plan_time` json NOT NULL,
	`oct_plan_time` json NOT NULL,
	`nov_plan_time` json NOT NULL,
	`dec_plan_time` json NOT NULL,
	`year_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`jan_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`feb_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`mar_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`apr_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`may_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`june_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`july_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`aug_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`sept_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`oct_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`nov_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`dec_fact_work` double(12,3) NOT NULL DEFAULT 0,
	`year_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	`jan_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	`feb_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	`mar_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	`apr_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	`may_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	`june_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	`july_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	`aug_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	`sept_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	`oct_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	`nov_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	`dec_fact_norm_time` double(12,3) NOT NULL DEFAULT 0,
	CONSTRAINT `pprs_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(32) NOT NULL,
	`last_name` varchar(32) NOT NULL,
	`middle_name` varchar(32) NOT NULL,
	`role` enum('subdivision','distance_engineer','distance_time_norm','distance_security_engineer','distance_sub_boss','distance_boss','direction','transenergo') NOT NULL,
	`id_subdivision` int,
	`id_distance` int,
	`id_direction` int,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `credentials` ADD CONSTRAINT `credentials_id_users_id_fk` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `distances` ADD CONSTRAINT `distances_id_direction_directions_id_fk` FOREIGN KEY (`id_direction`) REFERENCES `directions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subdivisions` ADD CONSTRAINT `subdivisions_id_distance_distances_id_fk` FOREIGN KEY (`id_distance`) REFERENCES `distances`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ppr_months_statuses` ADD CONSTRAINT `ppr_months_statuses_id_ppr_pprs_info_id_fk` FOREIGN KEY (`id_ppr`) REFERENCES `pprs_info`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ppr_working_mans` ADD CONSTRAINT `ppr_working_mans_id_ppr_pprs_info_id_fk` FOREIGN KEY (`id_ppr`) REFERENCES `pprs_info`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pprs_info` ADD CONSTRAINT `pprs_info_id_user_created_by_users_id_fk` FOREIGN KEY (`id_user_created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pprs_info` ADD CONSTRAINT `pprs_info_id_direction_directions_id_fk` FOREIGN KEY (`id_direction`) REFERENCES `directions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pprs_info` ADD CONSTRAINT `pprs_info_id_distance_distances_id_fk` FOREIGN KEY (`id_distance`) REFERENCES `distances`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pprs_info` ADD CONSTRAINT `pprs_info_id_subdivision_subdivisions_id_fk` FOREIGN KEY (`id_subdivision`) REFERENCES `subdivisions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pprs_data` ADD CONSTRAINT `pprs_data_id_ppr_pprs_info_id_fk` FOREIGN KEY (`id_ppr`) REFERENCES `pprs_info`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pprs_data` ADD CONSTRAINT `pprs_data_id_common_work_common_works_id_fk` FOREIGN KEY (`id_common_work`) REFERENCES `common_works`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_id_subdivision_subdivisions_id_fk` FOREIGN KEY (`id_subdivision`) REFERENCES `subdivisions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_id_distance_distances_id_fk` FOREIGN KEY (`id_distance`) REFERENCES `distances`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_id_direction_directions_id_fk` FOREIGN KEY (`id_direction`) REFERENCES `directions`(`id`) ON DELETE no action ON UPDATE no action;