CREATE TABLE `ppr_reports_notes` (
	`id_ppr` int NOT NULL,
	`jan` varchar(256) NOT NULL DEFAULT '',
	`feb` varchar(256) NOT NULL DEFAULT '',
	`mar` varchar(256) NOT NULL DEFAULT '',
	`apr` varchar(256) NOT NULL DEFAULT '',
	`may` varchar(256) NOT NULL DEFAULT '',
	`june` varchar(256) NOT NULL DEFAULT '',
	`july` varchar(256) NOT NULL DEFAULT '',
	`aug` varchar(256) NOT NULL DEFAULT '',
	`sept` varchar(256) NOT NULL DEFAULT '',
	`oct` varchar(256) NOT NULL DEFAULT '',
	`nov` varchar(256) NOT NULL DEFAULT '',
	`dec` varchar(256) NOT NULL DEFAULT '',
	CONSTRAINT `ppr_reports_notes_id_ppr_unique` UNIQUE(`id_ppr`)
);
--> statement-breakpoint
ALTER TABLE `ppr_reports_notes` ADD CONSTRAINT `ppr_reports_notes_id_ppr_pprs_info_id_fk` FOREIGN KEY (`id_ppr`) REFERENCES `pprs_info`(`id`) ON DELETE no action ON UPDATE no action;