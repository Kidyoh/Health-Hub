/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId]` on the table `Feedback` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `feedbackId` INTEGER NULL;

-- AlterTable
ALTER TABLE `feedback` ADD COLUMN `appointmentId` INTEGER NULL,
    ADD COLUMN `teleconsultationId` INTEGER NULL;

-- AlterTable
ALTER TABLE `teleconsultation` ADD COLUMN `notes` VARCHAR(191) NULL,
    MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE INDEX `Appointment_feedbackId_idx` ON `Appointment`(`feedbackId`);

-- CreateIndex
CREATE UNIQUE INDEX `Feedback_appointmentId_key` ON `Feedback`(`appointmentId`);

-- CreateIndex
CREATE INDEX `Feedback_teleconsultationId_idx` ON `Feedback`(`teleconsultationId`);

-- CreateIndex
CREATE INDEX `Feedback_appointmentId_idx` ON `Feedback`(`appointmentId`);

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_teleconsultationId_fkey` FOREIGN KEY (`teleconsultationId`) REFERENCES `Teleconsultation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
