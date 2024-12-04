ALTER TABLE `pprs_data` MODIFY COLUMN `periodicity_normal` varchar(16) NOT NULL;--> statement-breakpoint
ALTER TABLE `pprs_data` MODIFY COLUMN `periodicity_fact` varchar(16) NOT NULL;--> statement-breakpoint
ALTER TABLE `pprs_data` MODIFY COLUMN `norm_of_time` double(7,3) NOT NULL;