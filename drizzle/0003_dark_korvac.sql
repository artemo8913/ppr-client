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
	`periodicity_fact` varchar(10) NOT NULL,
	`last_maintenance_year` smallint NOT NULL,
	`norm_of_time` double(6,3) NOT NULL,
	`norm_of_time_name_full` varchar(256) NOT NULL,
	`unity` varchar(16) NOT NULL,
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
	`year_fact_work` double(6,3) NOT NULL DEFAULT 0,
	`jan_fact_work` double(6,3) NOT NULL DEFAULT 0,
	`feb_fact_work` double(6,3) NOT NULL DEFAULT 0,
	`mar_fact_work` double(6,3) NOT NULL DEFAULT 0,
	`apr_fact_work` double(6,3) NOT NULL DEFAULT 0,
	`may_fact_work` double(6,3) NOT NULL DEFAULT 0,
	`june_fact_work` double(6,3) NOT NULL DEFAULT 0,
	`july_fact_work` double(6,3) NOT NULL DEFAULT 0,
	`aug_fact_work` double(6,3) NOT NULL DEFAULT 0,
	`sept_fact_work` double(6,3) NOT NULL DEFAULT 0,
	`oct_fact_work` double(6,3) NOT NULL DEFAULT 0,
	`nov_fact_work` double(6,3) NOT NULL DEFAULT 0,
	`dec_fact_work` double(6,3) NOT NULL DEFAULT 0,
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
	`year_fact_time` double(12,3) NOT NULL DEFAULT 0,
	`jan_fact_time` double(12,3) NOT NULL DEFAULT 0,
	`feb_fact_time` double(12,3) NOT NULL DEFAULT 0,
	`mar_fact_time` double(12,3) NOT NULL DEFAULT 0,
	`apr_fact_time` double(12,3) NOT NULL DEFAULT 0,
	`may_fact_time` double(12,3) NOT NULL DEFAULT 0,
	`june_fact_time` double(12,3) NOT NULL DEFAULT 0,
	`july_fact_time` double(12,3) NOT NULL DEFAULT 0,
	`aug_fact_time` double(12,3) NOT NULL DEFAULT 0,
	`sept_fact_time` double(12,3) NOT NULL DEFAULT 0,
	`oct_fact_time` double(12,3) NOT NULL DEFAULT 0,
	`nov_fact_time` double(12,3) NOT NULL DEFAULT 0,
	`dec_fact_time` double(12,3) NOT NULL DEFAULT 0,
	CONSTRAINT `pprs_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `pprs_data` ADD CONSTRAINT `pprs_data_id_ppr_pprs_info_id_fk` FOREIGN KEY (`id_ppr`) REFERENCES `pprs_info`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pprs_data` ADD CONSTRAINT `pprs_data_id_common_work_common_works_id_fk` FOREIGN KEY (`id_common_work`) REFERENCES `common_works`(`id`) ON DELETE no action ON UPDATE no action;