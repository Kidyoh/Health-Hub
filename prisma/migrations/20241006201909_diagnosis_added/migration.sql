-- CreateTable
CREATE TABLE `Diagnosis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `symptoms` VARCHAR(191) NOT NULL,
    `possibleCondition` VARCHAR(191) NOT NULL,
    `advice` VARCHAR(191) NULL,
    `diagnosisDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `teleconsultationId` INTEGER NULL,
    `appointmentId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Diagnosis_userId_idx`(`userId`),
    INDEX `Diagnosis_teleconsultationId_idx`(`teleconsultationId`),
    INDEX `Diagnosis_appointmentId_idx`(`appointmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Diagnosis` ADD CONSTRAINT `Diagnosis_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diagnosis` ADD CONSTRAINT `Diagnosis_teleconsultationId_fkey` FOREIGN KEY (`teleconsultationId`) REFERENCES `Teleconsultation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diagnosis` ADD CONSTRAINT `Diagnosis_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
