-- AlterTable
ALTER TABLE "User" ADD COLUMN     "workingDays" TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']::TEXT[];
