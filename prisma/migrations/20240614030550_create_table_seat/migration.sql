-- CreateTable
CREATE TABLE "seats" (
    "id" TEXT NOT NULL,
    "seatOwner" TEXT,
    "busy" BOOLEAN DEFAULT false,
    "coworkingId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_coworkingId_fkey" FOREIGN KEY ("coworkingId") REFERENCES "coworkings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
