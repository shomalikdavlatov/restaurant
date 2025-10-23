/*
  Warnings:

  - You are about to drop the column `device_id` on the `traffics` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,date_time]` on the table `traffics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- DropIndex
DROP INDEX "public"."traffics_user_id_date_time_device_id_key";

-- AlterTable
ALTER TABLE "public"."traffics" DROP COLUMN "device_id";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "public"."device" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_user_id_device_id_key" ON "public"."device"("user_id", "device_id");

-- CreateIndex
CREATE UNIQUE INDEX "traffics_user_id_date_time_key" ON "public"."traffics"("user_id", "date_time");

-- AddForeignKey
ALTER TABLE "public"."device" ADD CONSTRAINT "device_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
