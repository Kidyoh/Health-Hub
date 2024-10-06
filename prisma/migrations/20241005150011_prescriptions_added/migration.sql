-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `prescriptionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `prescription` ADD COLUMN `appointmentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
