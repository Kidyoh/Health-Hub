/*
  Warnings:

  - You are about to drop the `pharmacy` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `teleconsultation` ADD COLUMN `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `rate` DOUBLE NULL;

-- DropTable
DROP TABLE `pharmacy`;
