/*
  Warnings:

  - Added the required column `familyId` to the `refreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `refreshtoken` ADD COLUMN `familyId` VARCHAR(191) NOT NULL,
    ADD COLUMN `revokedAt` DATETIME(3) NULL;
