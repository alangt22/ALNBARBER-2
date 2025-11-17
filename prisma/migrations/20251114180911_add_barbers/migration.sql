/*
  Warnings:

  - Added the required column `barberName` to the `Appoitments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appoitments" ADD COLUMN     "barberName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "barbers" TEXT[];
