/*
  Warnings:

  - You are about to drop the column `date` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `notification` table. All the data in the column will be lost.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notification` DROP COLUMN `date`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `isRead` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;
