/*
  Warnings:

  - You are about to drop the column `seatOwner` on the `seats` table. All the data in the column will be lost.
  - Added the required column `seatNumber` to the `seats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "seats" DROP COLUMN "seatOwner",
ADD COLUMN     "seatNumber" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "booking_date" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "seats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
