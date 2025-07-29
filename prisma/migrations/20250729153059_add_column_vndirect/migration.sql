/*
  Warnings:

  - You are about to drop the column `vn_direct_id` on the `Stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "vn_direct_id";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "vn_direct_id" TEXT;
