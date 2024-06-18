/*
  Warnings:

  - Added the required column `coworkingId` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "coworkingId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_coworkingId_fkey" FOREIGN KEY ("coworkingId") REFERENCES "coworkings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
