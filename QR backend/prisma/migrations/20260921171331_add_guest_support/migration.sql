/*
  Warnings:

  - You are about to drop the column `loyaltyPointsEarned` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `loyaltyPoints` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[guestId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "pincode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "guestId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "loyaltyPointsEarned",
ADD COLUMN     "guestId" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "loyaltyPoints";

-- DropEnum
DROP TYPE "LoyaltyRewardType";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_guestId_key" ON "Cart"("guestId");
