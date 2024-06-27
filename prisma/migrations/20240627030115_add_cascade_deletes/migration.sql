-- DropForeignKey
ALTER TABLE "image_coworkings" DROP CONSTRAINT "image_coworkings_coworkingId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_coworkingId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_seatId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_userId_fkey";

-- DropForeignKey
ALTER TABLE "seats" DROP CONSTRAINT "seats_coworkingId_fkey";

-- AddForeignKey
ALTER TABLE "image_coworkings" ADD CONSTRAINT "image_coworkings_coworkingId_fkey" FOREIGN KEY ("coworkingId") REFERENCES "coworkings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_coworkingId_fkey" FOREIGN KEY ("coworkingId") REFERENCES "coworkings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "seats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_coworkingId_fkey" FOREIGN KEY ("coworkingId") REFERENCES "coworkings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
