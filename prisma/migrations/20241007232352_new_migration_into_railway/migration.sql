/*
  Warnings:

  - Added the required column `teleconsultationId` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `HealthcareFacility` ADD COLUMN `appointmentPrice` DOUBLE NULL;

-- AlterTable
ALTER TABLE `Prescription` ADD COLUMN `teleconsultationId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Prescription_teleconsultationId_idx` ON `Prescription`(`teleconsultationId`);

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_teleconsultationId_fkey` FOREIGN KEY (`teleconsultationId`) REFERENCES `Teleconsultation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
