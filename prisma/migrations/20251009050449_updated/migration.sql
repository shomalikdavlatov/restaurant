/*
  Warnings:

  - You are about to drop the column `date` on the `traffics` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,date_time,device_id]` on the table `traffics` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."traffics_device_id_key";

-- DropIndex
DROP INDEX "public"."traffics_user_id_date_device_id_key";

-- AlterTable
ALTER TABLE "public"."traffics" DROP COLUMN "date",
ADD COLUMN     "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "traffics_user_id_date_time_device_id_key" ON "public"."traffics"("user_id", "date_time", "device_id");
