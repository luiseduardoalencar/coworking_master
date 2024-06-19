/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `coworkings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "coworkings" DROP COLUMN "imageUrl";

-- CreateTable
CREATE TABLE "image_coworkings" (
    "id" TEXT NOT NULL,
    "imagePath" TEXT,
    "coworkingId" TEXT NOT NULL,

    CONSTRAINT "image_coworkings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "image_coworkings" ADD CONSTRAINT "image_coworkings_coworkingId_fkey" FOREIGN KEY ("coworkingId") REFERENCES "coworkings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
