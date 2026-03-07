ALTER TABLE `users` RENAME COLUMN "email" TO "name";--> statement-breakpoint
DROP INDEX `users_email_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_name_unique` ON `users` (`name`);