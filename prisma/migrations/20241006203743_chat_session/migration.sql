/*
  Warnings:

  - You are about to drop the column `advice` on the `diagnosis` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentId` on the `diagnosis` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosisDate` on the `diagnosis` table. All the data in the column will be lost.
  - You are about to drop the column `possibleCondition` on the `diagnosis` table. All the data in the column will be lost.
  - You are about to drop the column `symptoms` on the `diagnosis` table. All the data in the column will be lost.
  - You are about to drop the column `teleconsultationId` on the `diagnosis` table. All the data in the column will be lost.
  - Added the required column `diagnosisText` to the `Diagnosis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `diagnosis` DROP FOREIGN KEY `Diagnosis_appointmentId_fkey`;

-- DropForeignKey
ALTER TABLE `diagnosis` DROP FOREIGN KEY `Diagnosis_teleconsultationId_fkey`;

-- AlterTable
ALTER TABLE `diagnosis` DROP COLUMN `advice`,
    DROP COLUMN `appointmentId`,
    DROP COLUMN `diagnosisDate`,
    DROP COLUMN `possibleCondition`,
    DROP COLUMN `symptoms`,
    DROP COLUMN `teleconsultationId`,
    ADD COLUMN `chatSessionId` INTEGER NULL,
    ADD COLUMN `diagnosisText` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ChatSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `sessionName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ChatSession_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DiagnosisToTeleconsultation` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DiagnosisToTeleconsultation_AB_unique`(`A`, `B`),
    INDEX `_DiagnosisToTeleconsultation_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Diagnosis_chatSessionId_idx` ON `Diagnosis`(`chatSessionId`);

-- AddForeignKey
ALTER TABLE `ChatSession` ADD CONSTRAINT `ChatSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diagnosis` ADD CONSTRAINT `Diagnosis_chatSessionId_fkey` FOREIGN KEY (`chatSessionId`) REFERENCES `ChatSession`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisToTeleconsultation` ADD CONSTRAINT `_DiagnosisToTeleconsultation_A_fkey` FOREIGN KEY (`A`) REFERENCES `Diagnosis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiagnosisToTeleconsultation` ADD CONSTRAINT `_DiagnosisToTeleconsultation_B_fkey` FOREIGN KEY (`B`) REFERENCES `Teleconsultation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
