-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_facilityId_fkey`;

-- AlterTable
ALTER TABLE `appointment` MODIFY `facilityId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `HealthcareFacility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
