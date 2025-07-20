/*
  Warnings:

  - You are about to drop the column `changePercent` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `currentPrice` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Stock` table. All the data in the column will be lost.
  - Added the required column `change_percent` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_name` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_price` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "changePercent",
DROP COLUMN "companyName",
DROP COLUMN "currentPrice",
DROP COLUMN "logoUrl",
DROP COLUMN "updatedAt",
ADD COLUMN     "change_percent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "company_name" TEXT NOT NULL,
ADD COLUMN     "current_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logo_url" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
