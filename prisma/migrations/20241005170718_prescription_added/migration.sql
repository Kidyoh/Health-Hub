/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `prescription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prescriptionId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `prescription` DROP FOREIGN KEY `Prescription_appointmentId_fkey`;

-- AlterTable
ALTER TABLE `prescription` DROP COLUMN `appointmentId`;

-- CreateIndex
CREATE UNIQUE INDEX `Appointment_prescriptionId_key` ON `Appointment`(`prescriptionId`);

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_prescriptionId_fkey` FOREIGN KEY (`prescriptionId`) REFERENCES `Prescription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
