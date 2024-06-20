/*
  Warnings:

  - You are about to drop the column `booking_date` on the `reservations` table. All the data in the column will be lost.
  - Added the required column `andTime` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "booking_date",
ADD COLUMN     "andTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
