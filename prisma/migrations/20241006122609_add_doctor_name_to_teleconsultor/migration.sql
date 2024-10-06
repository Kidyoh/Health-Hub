-- CreateTable
CREATE TABLE `_FeedbackToTeleconsultor` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FeedbackToTeleconsultor_AB_unique`(`A`, `B`),
    INDEX `_FeedbackToTeleconsultor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FeedbackToTeleconsultor` ADD CONSTRAINT `_FeedbackToTeleconsultor_A_fkey` FOREIGN KEY (`A`) REFERENCES `Feedback`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FeedbackToTeleconsultor` ADD CONSTRAINT `_FeedbackToTeleconsultor_B_fkey` FOREIGN KEY (`B`) REFERENCES `Teleconsultor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
